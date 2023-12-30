const { StatusCodes } = require("http-status-codes");
const path = require("path");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadImage = async (req, res) => {
  // check if file exists
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded");
  }
  const postImage = req.files.file;

  // check format of file
  if (!postImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image");
  }

  // check size
  const maxSize = 1024 * 1024;
  if (postImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload images smaller than 1 MB"
    );
  }

  const postImageName = new Date().getTime() + "_" + postImage.name;
  const imagePath = path.join(
    __dirname,
    "../public/images/" + `${postImageName}`
  );
  await postImage.mv(imagePath);
  const result = await cloudinary.uploader.upload(imagePath, {
    use_filename: true,
    folder: "mern-social-media",
  });
  fs.unlinkSync(imagePath);
  return res.status(StatusCodes.OK).json({ image: result.secure_url });
};

// const uploadImage = async (req, res) => {
//   const result = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
//     use_filename: true,
//     folder: "mern-social-media",
//   });
//   fs.unlinkSync(req.files.file.tempFilePath);
//   return res.status(StatusCodes.OK).json({ image: result.secure_url });
// };

module.exports = { uploadImage };
