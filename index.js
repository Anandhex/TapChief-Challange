var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const path = require("path");
var helpers = require("./helpers/helper");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: "5mb",
    extended: true
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/static"));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "./") });
});

// For indexing of the document
app.post("/api/index/", (req, res) => {
  if (req.body.document) {
    var table = helpers.index(req.body.document);
    res.send(table);
  }
  res.send({ err: "Something went wrong!" });
});

// For searching for a word in the document
app.post("/api/search/", (req, res) => {
  if (req.body.key !== "" && req.body.invertTable) {
    var doc = helpers.search(req.body.key, req.body.invertTable);
    res.send(doc);
  }

  if (!req.body.invertTable) {
    res.send({ dataMissing: "Please upload the data" });
  } else if (!req.body.key) {
    res.send({ dataMissing: "Please enter the word" });
  } else res.send({ err: "Something went wrong!" });
});

// clearing the index
app.get("/api/clear", (req, res) => {
  res.send({ invertTable: [], success: "cleared" });
});

app.listen(process.env.PORT || 4000, () => {});
