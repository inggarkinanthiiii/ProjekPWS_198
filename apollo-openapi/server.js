require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/apikey", require("./routes/apikey")); 
app.use("/api/admin", require("./routes/admin"));
app.use("/uploads", express.static("uploads"));


// SWAGGER
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Apollo Open API running on http://localhost:" + PORT);
  console.log("Swagger Docs: http://localhost:" + PORT + "/docs");
});
