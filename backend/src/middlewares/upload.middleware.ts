//  this is for version 1 which stores files in out project 
// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: "uploads/originals",
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     }
// });

// export const upload = multer({ storage });

import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

export default upload;