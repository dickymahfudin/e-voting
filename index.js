const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const apiRoute = require("./api");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () =>
  console.log(`Server Running on : http://localhost:${PORT}`)
);

app.get("/", (req, res) => {
  res.send("dism");
});

app.use("/api", apiRoute);
