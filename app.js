var http = require("http"),
  express = require("express"),
  logger = require("morgan"),
  errorhandler = require("errorhandler"),
  bodyParser = require("body-parser");
var app = express();
app.set("view engine", "jade");
app.set("port", process.env.PORT || 3000);
app.use(logger("combined"));
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.render("index");
});

app.use(errorhandler());

var server = http.createServer(app);
var io = require("socket.io").listen(server);

io.sockets.on("connection", socket => {
  socket.on("messageChange", data => {
    console.log(data);
    socket.emit(
      "receive",
      data.message
        .split("")
        .reverse()
        .join("")
    );
  });
});

server.listen(app.get("port"), () => {
  console.log("start " + app.get("port"));
});
