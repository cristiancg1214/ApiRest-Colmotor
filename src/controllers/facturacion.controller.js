const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "12345",
  database: "colmotor",
  port: "5432",
});

const createFact = async (req, res) => {
  const iva = 19;

  try {
    const response = await pool.query(
      "INSERT INTO facturas (cedula,subtotal,iva,total) VALUES($1,$2,$3,$4)",
      [req.params.cedula, 0, 0, 0]
    );
    console.log(response);
    res.status(200).send("Factura instanciada");
  } catch (error) {}
};

const numeroFactura = async (req, res) => {
  const iva = 19;

  try {
    const numFact = await pool.query(
      "select num_fact from facturas order by num_fact desc limit 1"
    );

    res.status(200).send({
      mensaje: "consulta bien realizada",
      numeroFactura: numFact.rows[0].num_fact,
    });
  } catch (error) {}
};

const createTMP = async (req, res) => {
  const hola;
  const { codigo_producto, cantidad, precio } = req.body;
  let response;
  try {
    response = await pool.query(
      "INSERT INTO temporal (id_producto,cantidad,precio) VALUES($1,$2,$3)",
      [codigo_producto, cantidad, precio]
    );

    res.send(response);
  } catch (error) {}

  console.log(response);
};

const getTMPVista = async (req, res) => {
  try {
    response = await pool.query(
      `select t.id_producto,p.descripcion, t.cantidad,t.precio,t.cantidad*t.precio as valor_neto,
      ((t.cantidad*t.precio)*0.19) as IVA,
      ((t.cantidad*t.precio)+((t.cantidad*t.precio)*0.19)) as Total
      from temporal 
      t,productos p where t.id_producto=p.codigo_producto`
    );

    res.status(200).send(response.rows);
  } catch (error) {}

  console.log(response);
};

const valoresTotales = async (req, res) => {
  const consultaValores = await pool.query(`select sum(cantidad*precio) as NETO, sum(cantidad*precio*(0.19)) as IVA,
  sum(((cantidad*precio)+((cantidad*precio)*0.19)))as TOTAL from temporal`);
  res.status(200).send(consultaValores.rows);
};
const postDetalleFactura = async (req, res) => {
  const { id_producto, precio, cantidad } = req.body;

  const response = await pool.query(
    `insert into detallefactura
  (num_fact,codigo_producto,precio,cantidad)values($1,$2,$3,$4)`,
    [req.params.id, id_producto, precio, cantidad]
  );

  const cantidadProductoStock = await pool.query(
    "select existencia from productos where codigo_producto=$1",
    [id_producto]
  );
  const restaExistencia = cantidadProductoStock.rows[0].existencia - cantidad;

  const actualizarExistenciaProducto = await pool.query(
    `UPDATE productos SET existencia=$1 WHERE codigo_producto=$2`,
    [restaExistencia, id_producto]
  );
  console.log(cantidad);
  res.send({ restaExistencia, id_producto });
};

const descargarAFacturacion = async (req, res) => {
  const { numero_factura } = req.params;
  const consultaValores = await pool.query(`select sum(cantidad*precio) as NETO, sum(cantidad*precio*(0.19)) as IVA,
  sum(((cantidad*precio)+((cantidad*precio)*0.19)))as TOTAL from temporal`);

  const subtotal = consultaValores.rows[0].neto;
  const iva = consultaValores.rows[0].iva;
  const total = consultaValores.rows[0].total;

  const actualizar = await pool.query(
    `UPDATE facturas SET subtotal=$1, iva=$2, total=$3 WHERE num_fact=$4`,
    [subtotal, iva, total, numero_factura]
  );

  const eliminarDatosTemporal = await pool.query(`DELETE FROM temporal`);
  if (actualizar) {
    res.status(200).send("Descargado a facturacion");
  }
};

const getFacturaByParam = async (req, res) => {
  const response = await pool.query(
    `SELECT * from facturas where cast(cedula as varchar(20)) like '%${req.params.cedula}%' order by num_fact`
  );

  res.json(response.rows);
};

const verDetalleFactura = async (req, res) => {
  const { numeroFactura } = req.params;
  const respuesta = await pool.query(
    `select dtf.id_detalle,pr.descripcion as Producto,dtf.cantidad as Cantidad,dtf.precio as Precio, 
    (dtf.cantidad*dtf.precio)as Valor_neto, ((dtf.cantidad*dtf.precio)*0.19) as Iva,
    (((dtf.cantidad*dtf.precio)*0.19)+(dtf.cantidad*dtf.precio)) as Total,f.subtotal as subtotal,
    f.iva as ivaTotal,f.total as total_factura from detalleFactura dtf, 
    facturas f,productos pr where dtf.num_fact=f.num_fact and dtf.codigo_producto=pr.codigo_producto and f.num_fact=$1`,
    [numeroFactura]
  );
  res.json(respuesta.rows);
};
module.exports = {
  createFact,
  createTMP,
  getTMPVista,
  numeroFactura,
  postDetalleFactura,
  valoresTotales,
  descargarAFacturacion,
  getFacturaByParam,
  verDetalleFactura,
};
