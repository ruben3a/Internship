import express from "express";
import fs from "fs";
import path from "path";

const app = express();

const port = 3000;

app.use(express.static("public"));
const file = JSON.parse(fs.readFileSync("tryouts.json"));

app.get("/", (req, res) => {
  res.render("utility.ejs", { data: file });
});

app.get("/equipment/:category", (req, res) => {
  const category = req.params.category;
  if (file.hasOwnProperty(category)) {
    res.json(file[category]);
  } else {
    res.status(404).send("Category not found");
  }
});

app.listen(port, () => {
  console.log("running");
});
