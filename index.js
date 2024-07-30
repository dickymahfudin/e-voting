const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const apiRoute = require("./api");
const models = require("./models");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(expressLayouts);
app.use(bodyParser.json({ limit: "100mb" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("layout", "./layout");
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => console.log(`Server Running on : http://localhost:${PORT}`));

app.get("/", async (req, res) => {
  const candidates = await models.Candidate.findAll();
  const candidate1 = candidates[0];
  const candidate2 = candidates[1];
  res.render("index", { candidate1, candidate2 });
});

app.get("/register", async (req, res) => {
  const ektp = await models.Temp.findByPk(1);
  res.render("register", { ektp });
});

app.get("/users", async (req, res) => {
  const users = await models.User.findAll({ order: [["id", "DESC"]] });
  res.render("user", { users });
});

app.post("/users/delete/:id", async (req, res) => {
  const { id } = req.params;
  await models.User.destroy({ where: { id, status: false } });
  res.redirect("/users");
});

app.post("/users/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;
  await models.User.update({ nama }, { where: { id } });
  res.redirect("/users");
});

app.use("/api", apiRoute);
