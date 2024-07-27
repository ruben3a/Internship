import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import inquirer from "inquirer";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
const filePath = "data.json";

// Read the JSON file
const file = fs.readFileSync("data.json", "utf8");
const parsedData = JSON.parse(file);

function writeJsonFile() {
  fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2), "utf8");
}

// Page 1: Display utility names
app.get("/", (req, res) => {
  const utilityNames = parsedData.utilities.map((utility) => utility.name);
  console.log(parsedData.utilities);
  res.render("utilities.ejs", {
    data: parsedData.utilities,
    utilities: utilityNames,
  });
});

app.get("/AllEquipments", (req, res) => {
  res.render("AllEquipments.ejs", { utility: parsedData.utilities });
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
  res.render("equipment.ejs", {
    equipmentsArray: utilitydata.objects,
    utility: utilityReq,
  });
});

app.get("/:utility/newEquipment", (req, res) => {
  const utilityReq = req.params.utility;
  res.render("newEquipment.ejs", { utility: utilityReq });
});

app.post("/:utility/New-Equipment", (req, res) => {
  const utilityReq = req.params.utility;
  const newEquipment = req.body;

  // Validate the input
  if (!newEquipment) {
    return res.status(400).json({ message: "New equipment data is required" });
  }

  // Find the utility object by name
  const utility = parsedData.utilities.find((i) => i.name === utilityReq);

  if (utility && Array.isArray(utility.objects)) {
    // Add the new equipment to the objects array
    utility.objects.push(newEquipment);

    // Write the updated data back to the JSON file
    writeJsonFile();

    // Send a response back to the client
    console.log(201);
    console.log({ message: "Equipment added successfully", newEquipment });
    res.redirect("/");
  } else {
    // Send an error response if the utility is not found or objects is not an array
    res
      .status(400)
      .json({ message: "Utility not found or objects is not an array" });
  }
});

app.get("/:utility/:equipments/delete", (req, res) => {
  const utilityReq = req.params.utility;
  const EquipName = req.params.equipments;
  res.render("deleteEquipment.ejs", {
    utility: utilityReq,
    equipment: EquipName,
  });
});

app.post("/:utility/:equipments/Delete-Equipment", (req, res) => {
  const utilityReq = req.params.utility;
  const EquipName = req.params.equipments;
  const confirmation = req.body.confirmation;

  // Validate the input
  if (confirmation != "confirm") {
    return res.status(400).json({ message: "Confirmation required" });
  }

  // Find the utility object by name
  const utility = parsedData.utilities.find((i) => i.name === utilityReq);
  if (utility && Array.isArray(utility.objects)) {
    // Add the new equipment to the objects array
    const Equipindex = utility.objects.findIndex(
      (equipment) => equipment.equipment === EquipName
    );

    if (Equipindex !== -1) {
      // Remove the equipment from the objects array
      utility.objects.splice(Equipindex, 1);

      // Write the updated data back to the JSON file
      writeJsonFile();

      // Send a response back to the client
      console.log(201);
      console.log({ message: "Equipment deleted successfully" });
      res.redirect("/");
    } else {
      // Send an error response if the utility is not found or objects is not an array
      res
        .status(400)
        .json({ message: "Utility not found or objects is not an array" });
    }
  }
});

// Page 3: Display dates of the selected object
app.get("/:utility/:equipments/:index/dates", (req, res) => {
  const utilityReq = req.params.utility;
  const index = parseInt(req.params.index);
  const equipment = req.params.equipments;
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
  const datesArray = Object.entries(object.dates).map(([key, value]) => ({
    key,
    value,
  }));
  res.render("moreInfo.ejs", { object, utilityReq, index, dates: datesArray });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
