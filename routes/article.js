const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/article");
// * test routes:
router.get("/test-route", ArticleController.test);
router.post("/create", ArticleController.createArticle);
router.get("/articles/:latest?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.delete("/article/:id", ArticleController.deleteArticle);
router.patch("/article/:id", ArticleController.updateArticle);

module.exports = router;
