const { urlencoded } = require("body-parser");
const bodyParser = require("body-parser");
const express = require("express");
const route = require("../src/route/route");
const mongoose = require("mongoose")

const app = express();


app.use(bodyParser.json())
app.use(bodyparser.urlencoded({ extends: true }))

mongoose.connect("mongodb+srv://vishal221:QbG4QZXzT3SrfBAF@cluster0.jegkx.mongodb.net/group64Database",
    { useNewUrlParser: true })

    .then(() => console.log("mongoDb is connected"))
    .catch(err => console.log(err))

app.use("/", route)
app.listen(process.env.PORT || 3000, function () {
    console.log("express app running on port" + (process.env.PORT || 3000));
})