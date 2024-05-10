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

app.get("/equipment/:utility", (req, res) => {
  const utility = req.params.utility;

  // Find the utility object in the 'file' array based on the utility name
  const equipment = file.find(
    (utilityObj) => Object.keys(utilityObj)[0] === utility
  );

  // Extract the equipment array from the utility object
  const equipmentData = equipment ? equipment[utility] : [];

  // Render the 'equipments.ejs' template with the utility and equipment data
  res.render("equipments.ejs", { utility, equipment: equipmentData });
});

app.get("/equipment/:equipmentName/dates", (req, res) => {
  const equipmentName = req.params.equipmentName;
  // Render a new template to display dates relative to the equipment
  res.render("dates.ejs", { equipmentName });
});

app.listen(port, () => {
  console.log("running");
});
