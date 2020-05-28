const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "12345",
  database: "colmotor",
  port: "5432",
});

const getProducts = async (req, res) => {
  const response = await pool.query("Select * from productos");
  if (!response) {
    res.status(404);
  }
  res.status(200).json(response.rows);
};

const createProduct = async (req, res) => {
  const { descripcion, existencia, precio } = req.body;
  const response = await pool.query(
    "INSERT INTO productos (descripcion,existencia,precio) VALUES($1,$2,$3)",
    [descripcion, existencia, precio]
  );
  console.log(response);
  if (response) {
    res.status(200).send({ respuesta: "producto creado" });
  }
};

const deleteProduct = async (req, res) => {
  const response = await pool.query(
    `delete from productos where codigo_producto=${req.params.id}`
  );
  res.json(response.rows);

  console.log(req.params.id);
};

const getProductByParam = async (req, res) => {
  const response = await pool.query(
    `SELECT * from productos  WHERE UPPER(descripcion) LIKE UPPER('%${req.params.descripcion}%')`
  );
  res.json(response.rows);
};

const getProductsById = async (req, res) => {
  const response = await pool.query(
    "Select * from productos WHERE codigo_producto=$1",
    [req.params.id]
  );

  res.status(200).json(response.rows);
  console.log(req.params.id);
};

const updateProduct = async (req, res) => {
  const { codigo_producto, descripcion, existencia, precio } = req.body;
  const response = await pool.query(
    "UPDATE productos SET descripcion=$1, existencia=$2,precio=$3 WHERE codigo_producto=$4",
    [descripcion, existencia, precio, codigo_producto]
  );
  res.json("Producto actualizado");
  console.log(response);
};
module.exports = {
  getProducts,
  getProductsById,
  createProduct,
  getProductByParam,
  deleteProduct,
  updateProduct,
};
