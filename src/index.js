const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const subscriptionRoutes = require("./routes/subscription.routes");
app.use("/api", subscriptionRoutes); 
app.get("/", (req, res) => res.send("Weather API is running"));

const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "../public")));
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
