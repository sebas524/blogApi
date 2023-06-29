const Article = require("../models/Article");
const { validateArticle } = require("../helpers/validate");

//
// ! METHODS:
//
const test = (req, res) => {
  return res.status(200).json({
    message: "hi from article controller",
  });
};

const createArticle = (req, res) => {
  // * parameters needed to be collected:

  let parameters = req.body;

  // * validate data given:

  try {
    //
    validateArticle(parameters);
    //
  } catch (error) {
    //
    return res
      .status(400)
      .json({ status: "error", message: "Data is missing or incorrect keys!" });
    //
  }

  // * create object to be saved and assign values to object based on model:
  const article = new Article(parameters);

  // * save article to DB:

  article
    .save()
    .then((savedArticle) => {
      return res.status(200).json({
        status: "success",
        article: savedArticle,
        message: "Article created successfully!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "error",
        message: "Unable to save article." + error.message,
      });
    });
};

const getArticles = (req, res) => {
  //

  let theRequest = Article.find({});

  if (req.params.latest === "latest") {
    theRequest.limit(3);
  }

  // * sort: if you want to sort them from newest to oldest then use -1:
  theRequest
    .sort({ date: -1 })
    .then((articles) => {
      return res.status(200).json({
        status: "success",
        parameter: req.params.latest,
        counter: articles.length,
        articles: articles,
      });
    })
    .catch((err) => {
      // * if no articles where found:
      return res.status(404).json({
        status: "error",
        message: "No articles were found.",
      });
    });
};

const getArticle = (req, res) => {
  // * article id as variable :
  let id = req.params.id;
  // * find article:
  Article.findById(id)
    .then((article) => {
      // * found::
      return res.status(200).json({
        status: "success",
        article: article,
      });
    })
    .catch((err) => {
      // * if no article was found:
      return res
        .status(404)
        .json({ status: "error", message: `Article with id ${id} not found.` });
    });
};

const deleteArticle = (req, res) => {
  // * article id as variable :
  let id = req.params.id;
  // * find and delete:
  Article.findOneAndDelete({
    _id: id,
  })
    .then((deletedItem) => {
      return res.status(200).json({
        status: "success",
        message: `Item with id ${id} successfully deleted.`,
      });
    })
    .catch(() => {
      return res.status(400).json({
        status: "error",
        message: `Item with id ${id} was not found.`,
      });
    });
};

const updateArticle = (req, res) => {
  // * article id as variable :
  let id = req.params.id;

  // *
  let parameters = req.body;

  // * validate data given:
  try {
    validateArticle(parameters);
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", message: "Data is missing or incorrect keys!" });
    //
  }

  Article.findOneAndUpdate({ _id: id }, parameters, { new: true })
    .then((updatedArticle) => {
      return res.status(200).json({
        status: "success",
        article: updatedArticle,
      });
    })
    .catch(() => {
      return res.status(400).json({
        status: "error",
        message: "There was an error while updating",
      });
    });
};

module.exports = {
  test,
  createArticle,
  getArticles,
  getArticle,
  deleteArticle,
  updateArticle,
};
