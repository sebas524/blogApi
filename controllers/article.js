const Article = require("../models/Article");
const fs = require("fs");
const path = require("path");
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

  // * look for and update article

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

const uploadPhoto = (req, res) => {
  // * multer configuration:
  //// ! done already in routes file!!!
  // * see file:
  console.log(req.file);
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid request" });
  }
  // * name of img file:
  let filenameOriginal = req.file.originalname;
  // * extension of img file(we get it by splitting filename by the dot. ex: "mypic","jpeg"):
  let fileSplit = filenameOriginal.split(".");
  let fileExtension = fileSplit[1];
  // * check that extension is correct:
  if (
    fileExtension !== "png" &&
    fileExtension !== "jpg" &&
    fileExtension !== "jpeg" &&
    fileExtension !== "gif"
  ) {
    // * delete file and give respond:
    fs.unlink(req.file.path, (err) => {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid file type" });
    });
  } else {
    // * if everything goes well then we need to update the article in which the image is being uploaded to:

    // * article id as variable :
    let id = req.params.id;

    // * look for and update article
    Article.findOneAndUpdate(
      { _id: id },
      { image: req.file.filename },
      { new: true }
    )
      .then((updatedArticle) => {
        // * return response:

        return res.status(200).json({
          status: "success",
          article: updatedArticle,
          uploadedImageFile: req.file,
        });
      })
      .catch((error) => {
        console.error("Error in uploadPhoto:", error);

        return res.status(500).json({
          status: "error",
          message: "There was an error while updating, check server log.",
        });
      });
  }
};

const getImage = (req, res) => {
  let chosenImage = req.params.chosenImage; //! REMEBER chosenImage has to match :chosenImage in ROUTES!!!!!!!
  let physicalPath = `./images/articles/` + chosenImage;
  fs.stat(physicalPath, (error, exists) => {
    if (exists) {
      return res.sendFile(path.resolve(physicalPath));
    } else {
      return res.status(404).json({
        status: "error",
        message: "image does not exists",
        exists,
        chosenImage,
        physicalPath,
      });
    }
  });
};

const getArticleBySearchCriteria = (req, res) => {
  // * get search link:
  let search = req.params.search;
  //  * find OR:
  Article.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ],
  })
    .sort({ Date: -1 })
    .then((foundArticles) => {
      if (foundArticles <= 0) {
        throw new Error("No articles found");
      }

      return res.status(200).json({
        status: "success",
        foundArticles: foundArticles,
      });
    })
    .catch((err) => {
      return res
        .status(404)
        .json({ status: "error", message: "no articles have been found" });
    });
};

module.exports = {
  test,
  createArticle,
  getArticles,
  getArticle,
  deleteArticle,
  updateArticle,
  uploadPhoto,
  getImage,
  getArticleBySearchCriteria,
};
