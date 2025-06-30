import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedExtension = [".jpg", ".svg", ".png"];

const filter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extension = path.extname(file.originalname);
  if (allowedExtension.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Only jpg, svg and png files are allowed! your is ${file.originalname}`
      )
    );
  }
};
const upload = multer({
  storage: storage,
  fileFilter: filter,
});

export default upload;
