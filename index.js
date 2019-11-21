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

app.post("/api/index/", (req, res) => {
  if (req.body.document) {
    var table = helpers.index(req.body.document);
    res.send(table);
  }
  res.send({ err: "Something went wrong!" });
});
app.post("/api/search/", (req, res) => {
  if (req.body.key !== "" && req.body.invertTable) {
    var doc = helpers.search(req.body.key, req.body.invertTable);
    res.send(doc);
  }
  res.send({ err: "Something went wrong!" });
});

app.listen(process.env.PORT || 4000, () => {});
