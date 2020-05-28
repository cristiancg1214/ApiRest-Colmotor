const express = require("express");
const app = express();

//middle

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//rutas
var cors = require("cors");

app.use(cors());

app.use(require("./routes/index"));

app.listen(3003);
console.log("Server on port 3003");
