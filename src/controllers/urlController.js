const shortid = require("shortid");
  // const validator = require("validator");
const urlModel = require("../models/urlModel");

//Connect to redis
const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient(
  // 13190,
  12992, 
  // "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  "redis-12992.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);

// redisClient.auth("gkiOIPkytPI3ADi14jHMSWkZEo2J5TDG", function (err) {
redisClient.auth("Q7uFdUT3ZrBoWYWzf9X019ZIwQy0gTbY", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//----------------------------------------------------------------------------------------
//                                1. API -  POST/url/shorten
//----------------------------------------------------------------------------------------

const createUrl = async function (req, res) {
  try {
    const body = req.body;
       
       
    if (Object.keys(body).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Request Body: Body Empty." });
    }

    let { longUrl } = body;

    if (
      typeof longUrl === "undefined" ||
      longUrl === null ||
      (typeof longUrl === "string" && longUrl.length === 0)
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid <longUrl>." });
    }

    // !/^(https:\/\/www\.|http:\/\/www\.|www\.)[a-zA-Z0-9\-_.$]+\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?/gm.test(
    //   longUrl
    // )
    if (!validator.isURL(longUrl)) {
      return res
        .status(400)
        .send({ status: false, message: "<longURL> NOT a Valid URL Format." });
    }

    let cachesUrlData = await GET_ASYNC(`${req.body.longUrl}`);

    if (cachesUrlData) {
      return res.status(200).send({
        status: true,
        message: "URL Data coming from Cache.",
        data: JSON.parse(cachesUrlData),
      });
    } else {
      const longUrlUnique = await urlModel.findOne({ longUrl });
      if (longUrlUnique) {
        return res.status(400).send({
          status: false,
          message: `<longURL>: <${longUrl}> Already Exists in Database.`,
        });
      }

      const urlCode = shortid.generate().toLowerCase();
      const baseUrl = "http://localhost:3000";
      const shortUrl = baseUrl + "/" + urlCode;

      const data = { longUrl, shortUrl, urlCode };

      const createData = await urlModel.create(data);

      const result = {
        longUrl: createData.longUrl,
        shortUrl: createData.shortUrl,
        urlCode: createData.urlCode,
      };

      await SET_ASYNC(`${req.body.longUrl}`, JSON.stringify(result));

      return res.status(201).send({
        status: true,
        message: "Successfully Generated Short URL.",
        data: result,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//----------------------------------------------------------------------------------------
//                                2. API -  GET/:urlCode
//----------------------------------------------------------------------------------------

const getUrl = async function (req, res) {
  try {
    let requestParams = req.params.urlCode;

    let cachesUrlData = await GET_ASYNC(`${requestParams}`);

    //convert to object
    const urlData = JSON.parse(cachesUrlData);
    if (cachesUrlData) {
      return res.status(302).redirect(urlData.longUrl);
    } else {
      let findUrlCode = await urlModel
        .findOne({ urlCode: requestParams })
        .select({ urlCode: 1, longUrl: 1, shortUrl: 1, _id: 0 });

      if (!findUrlCode) {
        return res.status(404).send({
          status: false,
          message: `<urlCode>: <${requestParams}> NOT Found.`,
        });
      }

      await SET_ASYNC(`${requestParams}`, JSON.stringify(findUrlCode));
      return res.status(302).redirect(findUrlCode.longUrl);
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrl, getUrl };
