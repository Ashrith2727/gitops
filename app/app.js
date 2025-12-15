const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ status: "OK", service: "gitops-demo-app" });
});

app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});
