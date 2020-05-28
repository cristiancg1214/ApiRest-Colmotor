//import query from "../db/query";

const { Pool } = require("pg");
const successMessage = { status: "success", data: {} };
const errorMessage = { status: "error" };
const status = {
  success: 200,
  error: 500,
  notfound: 404,
  unauthorized: 401,
  conflict: 409,
  created: 201,
  bad: 400,
  nocontent: 204,
};

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "12345",
  database: "colmotor",
  port: "5432",
});

const getUsers = async (req, res) => {
  const response = await pool.query("Select * from usuarios order by nombre");

  if (!response) {
    res.status(404);
  }
  res.status(200).json(response.rows);
};

const getUserByParam = async (req, res) => {
  const response = await pool.query(
    `SELECT * from usuarios  WHERE UPPER(nombre) LIKE UPPER('%${req.params.nombre}%') order by nombre`
  );
  res.json(response.rows);
};

const getUserByParamId = async (req, res) => {
  const response = await pool.query(
    `SELECT * from usuarios  WHERE cedula=${req.params.cedula}`
  );

  // res.status(200).json(response.rows);

  res.status(200).send(response.rows);
};

const createUser = async (req, res) => {
  try {
    const { cedula, nombre, correo, contrasena, tipo_usuario } = req.body;
    const response = await pool.query(
      "INSERT INTO usuarios (cedula,nombre,correo,contrasena,tipo_usuario) VALUES($1,$2,$3,$4,$5)",
      [cedula, nombre, correo, contrasena, tipo_usuario]
    );
    if (response) {
      res.json(response.rowCount);
    }
  } catch (error) {
    return res.send("Error creando usuario");
  }
};

const getUserByParamId2 = async (req, res) => {
  const { cedula } = req.params;
  const findMesaQuery = "SELECT * from usuarios where cedula=$1";
  try {
    const { rows } = await pool.query(findMesaQuery, [cedula]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      //errorMessage.error = "No existe la mesa";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    //errorMessage.error = "Error Inesperado";
    // return res.status(status.error).send(errorMessage);
  }
};

const updateUser = async (req, res) => {
  const { cedula, nombre, correo, contrasena, tipo_usuario } = req.body;
  const response = await pool.query(
    "UPDATE usuarios SET nombre=$1, correo=$2,contrasena=$3, tipo_usuario=$4 WHERE cedula=$5",
    [nombre, correo, contrasena, tipo_usuario, cedula]
  );
  res.json("User updated");
  console.log(response);
};

module.exports = {
  getUsers,
  createUser,
  getUserByParam,
  getUserByParamId,
  updateUser,
};
