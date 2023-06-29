const express = require("express");
const multer = require("multer");
const router = express.Router();

// * configuere where you want to store your images:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // * here will the images be saved:
    cb(null, "./images/articles");
  },
  //   * name that these files will have:
  filename: (req, file, cb) => {
    // * personalized name:
    cb(null, "article" + Date.now() + file.originalname);
  },
});

const uploads = multer({ storage: storage });

const ArticleController = require("../controllers/article");
// * test routes:
router.get("/test-route", ArticleController.test);
router.post("/create", ArticleController.createArticle);
router.get("/articles/:latest?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.delete("/article/:id", ArticleController.deleteArticle);
router.patch("/article/:id", ArticleController.updateArticle);
router.post(
  "/upload-img/:id",
  [uploads.single("file0")],
  ArticleController.uploadPhoto
);

module.exports = router;
