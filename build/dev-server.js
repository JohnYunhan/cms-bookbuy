require('./check-versions')()
var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require("mongoose")

var Api = require('../server/api');
var { AuthCookie, Page, CheckLogin } = require("../server/authority");

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
  // Define HTTP proxies to your custom API backend
  // https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
app.locals.pages = {}; //设置一个缓存
var compiler = webpack(webpackConfig)

const opts = {
  server: {
    //防止长期运行的程序出现数据库连接错误
    socketOptions: { keepAlive: 1 }
  }
};
mongoose.connect("mongodb://admin:123456@localhost:27017/BookBuyDB", opts); //连接测试库

app.use(favicon(path.join(__dirname, './favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(AuthCookie);

app.use('/api', Api);
//验证账号是否过期
app.get('/', (req, res, next) => {
  let adminId = req.AdminInfo.Id;
  if (adminId === "") {
    res.redirect('/login');
  } else {
    res.redirect('/index');
  }
})

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
  // force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
