const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const apiRoute = require("./api");
const models = require("./models");
const cors = require("cors");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.listen(PORT, () =>
  console.log(`Server Running on : http://localhost:${PORT}`)
);

app.get("/", async (req, res) => {
  const candidates = await models.Candidate.findAll();
  const candidate1 = candidates[0];
  const candidate2 = candidates[1];
  res.render("index", { candidate1, candidate2 });
});

app.use("/api", apiRoute);
