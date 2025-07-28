const multer = require('multer');
const path = require('path');

const makeStorage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (req, file, cb) => {
      console.log('File received:', file);
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });

const sectionUpload = {
  vision: multer({ storage: makeStorage('visions') }),
  mission: multer({ storage: makeStorage('missions') }),
  core: multer({ storage: makeStorage('cores') }),
};

module.exports = sectionUpload;
[{"missionDescription":"bansi gohillllllllllllll","missionImageUrl":""}]