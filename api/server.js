const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId : process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail : process.env.FIREBASE_CLIENT_EMAIL
  }),
  databaseURL:
    "https://titanclasses-a2d86-default-rtdb.asia-southeast1.firebasedatabase.app",
});
const bucket = admin.storage().bucket();
const db = admin.database();

const upload = multer({ dest: '/tmp/' }); // Vercel functions only support /tmp/ for writable directory

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/submit', upload.fields([
    { name: 'verification-id-front', maxCount: 1 },
    { name: 'verification-id-back', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), async (req, res) => {
    try {
        const formData = req.body;
        const files = req.files;

        const uploadedFiles = await uploadFilesToStorage(files);

        await saveFormDataToDatabase(formData, uploadedFiles);

        res.send('Form submitted successfully!');
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Error submitting form.');
    }
});

const uploadFilesToStorage = async (files) => {
    const fileUploadPromises = [];

    for (const fieldName in files) {
        const fileArray = files[fieldName];
        fileArray.forEach(file => {
            const destination = `uploads/${file.originalname}`;
            fileUploadPromises.push(
                bucket.upload(file.path, { destination }).then(uploadResponse => {
                    return {
                        fieldName,
                        filePath: uploadResponse[0].metadata.mediaLink,
                        originalName: file.originalname,
                        size: file.size,
                        mimeType: file.mimetype
                    };
                })
            );
        });
    }

    return Promise.all(fileUploadPromises);
};

const saveFormDataToDatabase = async (formData, uploadedFiles) => {
    const dataToSave = {
        ...formData,
        files: uploadedFiles
    };

    const ref = db.ref('submissions');
    await ref.push(dataToSave);
};

module.exports = app;
