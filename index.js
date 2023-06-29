const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const routesArticle = require("./routes/article");

// * connect to database:
connection();

// * create node server:
const app = express();
// * configure cors (for when connecting with front end):
app.use(cors());
// * convert body to json object:
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // * for form-urlencoded as well.
//
// ! ROUTES:
app.use("/api", routesArticle);

//

// * create server and listen to requests:
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
