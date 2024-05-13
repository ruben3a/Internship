import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

// Read the JSON file
const file = fs.readFileSync("tryouts2.json", "utf8");
const parsedData = JSON.parse(file);

// Page 1: Display utility names
app.get("/", (req, res) => {
  const utilityNames = parsedData.utilities.map((utility) => utility.name);
  console.log(utilityNames);
  res.render("utility3.ejs", { utilities: utilityNames });
});

// Page 2: Display objects based on utility
app.get("/:utility/equipments", (req, res) => {
  const utilityReq = req.params.utility;
  const utilitydata = parsedData.utilities.find(
    (utility) => utility.name === utilityReq
  );
  if (!utilitydata) {
    return res.status(404).json({ error: "Utility not found" });
  }
  res.render("equipments3.ejs", { equipments: utilitydata.objects });
});

// Page 3: Display dates of the selected object
app.get("/page3/:utilityName/:index", (req, res) => {
  const utilityName = req.params.utilityName;
  const index = parseInt(req.params.index);
  const utility = parsedData.utilities.find(
    (utility) => utility.name === utilityName
  );
  if (!utility) {
    return res.status(404).json({ error: "Utility not found" });
  }
  const object = utility.objects[index];
  if (!object) {
    return res.status(404).json({ error: "Object not found" });
  }
  res.json(object.dates);
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
