import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// Read the JSON file
const file = fs.readFileSync("tryouts2.json", "utf8");
const parsedData = JSON.parse(file);

const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Page 1: Display utility names
app.get("/", (req, res) => {
  const utilityNames = parsedData.utilities.map((utility) => utility.name);
  console.log(parsedData.utilities);
  res.render("utility3.ejs", {
    data: parsedData.utilities,
    utilities: utilityNames,
  });
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
  console.log(utilitydata);
  res.render("equipments3.ejs", {
    equipmentsArray: utilitydata.objects,
    utility: utilityReq,
  });
});

app.post("/add-equipment", (req, res) => {
  const { utilityName, newEquipment } = req.body;

  // Validate the input
  if (!utilityName || !newEquipment) {
    return res
      .status(400)
      .json({ message: "Utility name and new equipment data are required" });
  }

  // Read existing data from the JSON file
  let data = readJsonFile(dataFilePath);

  // Find the utility object by name
  const utility = data.utilities.find((u) => u.name === utilityName);

  if (utility && Array.isArray(utility.objects)) {
    // Add the new equipment to the objects array
    utility.objects.push(newEquipment);

    // Write the updated data back to the JSON file
    writeJsonFile(dataFilePath, data);

    // Send a response back to the client
    res
      .status(201)
      .json({ message: "Equipment added successfully", newEquipment });
  } else {
    // Send an error response if the utility is not found or objects is not an array
    res
      .status(400)
      .json({ message: "Utility not found or objects is not an array" });
  }
});

// Page 3: Display dates of the selected object
app.get("/:utility/:equipments/:index/dates", (req, res) => {
  const utilityReq = req.params.utility;
  const index = parseInt(req.params.index);
  const utilitydata = parsedData.utilities.find(
    (utility) => utility.name === utilityReq
  );
  if (!utilitydata) {
    return res.status(404).json({ error: "Utility not found" });
  }
  const object = utilitydata.objects[index];
  if (!object) {
    return res.status(404).json({ error: "Object not found" });
  }
  console.log(object.dates);
  const datesArray = Object.entries(object.dates).map(([key, value]) => ({
    key,
    value,
  }));
  res.render("dates3.ejs", { utilityReq, index, dates: datesArray });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
