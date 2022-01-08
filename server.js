const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoDb = require("./database/db");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());
const bookRoute = require("./routes/book.routes");

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Data base successfully connected");
    },
    (error) => {
      console.log("Database error: " + error);
    }
  );

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use("/api/books", bookRoute);

// Static directory path
// app.use(express.static(path.join(__dirname, "dist/")));

// //Base route
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist/index.html"));
// });

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist/angular-mean-crud")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/angular-mean-crud", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running");
  });
}

// PORT
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 404 Handler
app.use((req, res, next) => {
  next(createError(404));
});

//Error Handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
