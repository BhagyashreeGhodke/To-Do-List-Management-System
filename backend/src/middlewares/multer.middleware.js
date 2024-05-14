import multer from "multer";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the upload directory exists
        const uploadDir = path.join(__dirname, "upload");
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Use a timestamp to make filenames unique
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.originalname}`;
        cb(null, filename);
    }
});

export const upload = multer({ storage });
