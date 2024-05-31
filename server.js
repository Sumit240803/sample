const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const app = express();
const port = 3000;
require('dotenv').config();
admin.initializeApp({
  credential: admin.credential.cert({
    projectId : process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail : process.env.FIREBASE_CLIENT_EMAIL
  }),
  databaseURL:
    "https://titanclasses-a2d86-default-rtdb.asia-southeast1.firebasedatabase.app",
});
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/photos_2", express.static(path.join(__dirname, "photos_2")));
app.use("/pages", express.static(path.join(__dirname, "pages")));
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer({ dest: "uploads/" });
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});
app.get("/educator", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "educator.html"));
});
app.post(
  "/submit",
  upload.fields([
    { name: "verification-id-front", maxCount: 1 },
    { name: "verification-id-back", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req, res) => {
    const formData = req.body;
    const files = req.files;
    console.log(files);
    console.log(formData);
    const ref = admin.database().ref("fileMetaData");
    const filePromise = files.map((file) => {
      const fileData = {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      };
      return ref.push(fileData);
    });
    const storage = admin.storage().bucket();
    const uploadPromise = files.map((file) => {
      const destination = `files/${formData.name}`;
      return storage.upload(file.path, { destination });
    });
    Promise.all([...filePromise, ...uploadPromise])
      .then(() => {
        res.send("Form submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        res.send("Error submitting form.");
      });
  }
);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
