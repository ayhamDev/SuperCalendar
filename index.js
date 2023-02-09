const express = require("express");
const ip = require("ip");
const ConnectToDB = require("./db");
const Router = require("./router/router");
var cookies = require("cookie-parser");
const { patch } = require("./router/router");

const app = express();

// ENV VAR CONFIG
require("dotenv").config();

// CONST
const PORT = process.env.PORT || 4413;

// db
ConnectToDB(process.env.DB);
// Server Config
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookies());
// Router
app.use("/public", express.static("public"));
app.use("/", Router);

app.listen(PORT, () => {
  console.log(`The Application Is Running On http://${ip.address()}:${PORT}`);
  console.log("Connecting To db Plase Wait...");
});
