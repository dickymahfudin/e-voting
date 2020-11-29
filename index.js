const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const apiRoute = require("./api");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: "100mb" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.listen(PORT, () =>
  console.log(`Server Running on : http://localhost:${PORT}`)
);

app.get("/", (req, res) => {
  res.render("index", { data: 2 });
});

app.use("/api", apiRoute);
