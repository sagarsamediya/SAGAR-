const express = require('express');
const bodyParser = require("body-parser");
const route = require("./route/route");
const { default: mongoose } = require('mongoose');

const app = express(); 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extends: true }));

mongoose.connect("mongodb+srv://SagarSamediya:sagar@cluster0.p5frd.mongodb.net/group64Database?retryWrites=true&w=majority",
    { useNewUrlParser: true })

    .then(() => console.log("mongoDb is connected"))
    .catch(err => console.log(err))

app.use("/", route)
app.listen(process.env.PORT || 3000, function () {
    console.log("express app running on port" + (process.env.PORT || 3000));
})