require("dotenv").config();
require("express-async-errors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const xss = require("xss-clean");
const multer = require("multer");
const fileUpload = require("express-fileupload");

const express = require("express");
const app = express();

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

app.use(express.static("./public"));

// middleware
app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(xss());
app.use(morgan("common"));
app.use(fileUpload());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api", uploadRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening at port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
