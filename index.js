const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const hotShow = require("./mock/hotShow");
const hotMovie = require("./mock/hotMovie");
const hotTvShow = require("./mock/hotTvShow");
const hotBook = require("./mock/hotBook");
const hotMusic = require("./mock/hotMusic");
const top250 = require("./mock/top250");
const { getList, searchById, generateMovieComments, generateShortComments } = require("./utils/mockData");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 所有模块数据
const allList = {
  hotShow,
  hotMovie,
  hotTvShow,
  hotBook,
  hotMusic,
  top250
}

// 允许跨域
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  // 此处根据前端请求携带的请求头进行配置
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  // 如请求头需要携带Authorization和Client-Type，应进行配置
  // res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization, Client-Type");
  // console.log(req.url, req.path);
  // req.model = /^\/(.*?)(\?|$)/.exec(req.url)[1];
  next();
});

const listRouter = express.Router();
// 处理流程相同
app.use("/list/:movieType", (req, res, next) => {
  req.model = req.params.movieType
  next()
}, listRouter)

// 支持 get
listRouter.get("/", async (req, res, next) => {
  try {
    res.send(getList(req.query, allList[req.model]))
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: `${req.path}: ${error.message}` })
  }
});

// 支持 post
listRouter.post("/", async (req, res, next) => {
  try {
    res.send(getList(req.body, allList[req.model]))
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: `${req.path}: ${error.message}` })
  }
});

// 通过id获取数据
app.post('/searchById', async (req, res, next) => {
  try {
    const { type } = req.body
    res.send(searchById(req.body, allList[type]))
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: `${req.path}: ${error.message}` })
  }
})

// 获取短评论
app.get('/shortComments', async (req, res, next) => {
  try {
    // const { type } = req.body
    res.send(generateShortComments(8))
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: `${req.path}: ${error.message}` })
  }
})

// 获取长评论
app.get('/movieComments', async (req, res, next) => {
  try {
    // const { type } = req.body
    res.send(generateMovieComments(8))
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: `${req.path}: ${error.message}` })
  }
})

app.listen("3002", () => {
  console.log("服务器 http://localhost:3002");
});
