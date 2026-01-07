// --------------------------------------------------
// Import Multer
// --------------------------------------------------
import multer from "multer";
import fs from "fs";
import path from "path";

// --------------------------------------------------
// Ensure Upload Directory Exists
// --------------------------------------------------
// Multer does NOT create folders automatically,
// so we manually ensure the temp directory exists
const uploadPath = path.resolve("public/temp");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// --------------------------------------------------
// Multer Storage Configuration
// --------------------------------------------------
const storage = multer.diskStorage({

  // --------------------------------------------------
  // destination → where files will be stored locally
  // --------------------------------------------------
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  // --------------------------------------------------
  // filename → how uploaded file will be named
  // --------------------------------------------------
  filename: function (req, file, cb) {

    // Unique suffix to prevent filename collision
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Final filename
    // Example: avatar-1700000000000-123456789
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

// --------------------------------------------------
// Multer Upload Middleware
// --------------------------------------------------
const upload = multer({
  storage,
});


// --------------------------------------------------
// Export Upload Middleware
// --------------------------------------------------
export { upload };
