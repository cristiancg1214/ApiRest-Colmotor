const { Router } = require("express");
const router = Router();

const {
  getUsers,
  createUser,
  getUserByParam,
  getUserByParamId,
  updateUser,
} = require("../controllers/users.controller");

const {
  getProducts,
  createProduct,
  getProductByParam,
  deleteProduct,
  getProductsById,
  updateProduct,
} = require("../controllers/products.controller");

const {
  createFact,
  createTMP,
  getTMPVista,
  numeroFactura,
  postDetalleFactura,
  valoresTotales,
  descargarAFacturacion,
  getFacturaByParam,
  verDetalleFactura,
} = require("../controllers/facturacion.controller");

router.get("/users", getUsers);
router.get("/users/:nombre", getUserByParam);
router.get("/usersT/:cedula", getUserByParamId);
router.post("/users", createUser);
router.put("/users", updateUser);

router.put("/products", updateProduct);
router.get("/products", getProducts);
router.get("/productsT/:id", getProductsById);
router.get("/products/:descripcion", getProductByParam);
router.post("/products", createProduct);
router.delete("/products/:id", deleteProduct);

router.post("/facturation/:cedula", createFact);
router.post("/facturationTMP", createTMP);
router.get("/facturationTMP", getTMPVista);
router.get("/facturationNumeroF", numeroFactura);
router.get("/valoresTotales", valoresTotales);
router.post("/facturationDetalle/:id", postDetalleFactura);
router.post("/descargarFacturacion/:numero_factura", descargarAFacturacion);

router.get("/factura/:cedula", getFacturaByParam);
router.get("/verDetalleFactura/:numeroFactura", verDetalleFactura);
module.exports = router;
