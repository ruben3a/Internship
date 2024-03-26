import express from "express";
import fs from "fs";
import path from "path";

const app = express();

const port = 3000;

var file = fs.readFileSync("equipamentos.json");
const data = JSON.parse(file);

app.get("/", (req, res) => {
  res.send(data);
});

app.listen(port, () => {
  console.log("running");
});
