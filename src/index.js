const express = require("express");
const { default: mongoose } = require("mongoose");
const route = require("..");
const multer = require("multer");
const app = express();

app.use(express.json());
app.use(multer().any());

let url =
  "mongodb+srv://productManagemnt:o43JmbjCcjjTZR3s@cluster0.giwsczp.mongodb.net/group1Database";
let port = process.env.PORT || 3000;

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(port, function () {
  console.log(`Express is listening on ${port}`);
});
