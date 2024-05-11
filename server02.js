import express from "express";
import fetch from "file-fetch";

const app = express();

//missing the styling because of the public folder - remember!!!

const port = 3000;

async function fetchData() {
  try {
    const response = await fetch("tryouts.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const file = await response.json();
    return file;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to handle it further
  }
}

app.get("/", async (req, res) => {
  try {
    const file = await fetchData();
    res.render("utility.ejs", { data: file });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/equipment/:category", async (req, res) => {
  try {
    const file = await fetchData();
    const category = req.params.category;
    if (file.hasOwnProperty(category)) {
      res.json(file[category]);
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
