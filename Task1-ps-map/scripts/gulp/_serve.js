const gulp = require('gulp');

const browserSync = require('browser-sync');
const proxy = require('http-proxy-middleware');

const styles = require('./_styles');
const scripts = require('./_scripts');
const lint = require('./_lint');
const pug = require('./_pug');

const CONFIG = require('./config');

module.exports = gulp.series(require('./_clean'), gulp.series(gulp.parallel(pug, styles, scripts, lint/*, 'svg'*/), run));

function run(cb) {
  const middleware = [];
  const srv_middleware = getMiddleware();
  if (srv_middleware.pathRewrite) {
    middleware.unshift(pathRewrite(srv_middleware.pathRewrite));
  }
  if (srv_middleware.proxy) {
    middleware.unshift(proxy.apply(null, srv_middleware.proxy));
  }


  browserSync({
    notify: false,
    port: 9000,
    logLevel: 'warn',
    server: {
      baseDir: ['.tmp', 'app'],
      serveStaticOptions: {
        extensions: ['html']
      },
      middleware: middleware
    }
  });


  let b = CONFIG.getBrowserify();
  for (let p in b) {
    b[p].on('update', scripts); // on any dep update, runs the bundler
    b[p].on('log', console.log); // output build logs to terminal
  }


  require('./watch')(browserSync);
}

function pathRewrite(rules) {
  return function(req, res, next) {
    // var fileName = url.parse(req.url);

    req.url = rules.reduce(function (url, rule) {
      switch (typeof rule.path) {
        case 'string':
          return url.replace(rule.test, rule.path);
        case 'function':
          return url.replace(rule.test, rule.path);
      }
      return url;
    }, req.url);

    return next();
  }
}

function getMiddleware() {
  /**
   Если от codeigniter (cms, которую использует Женя для API) приходит `Disallowed Key Characters`,
   то проблема, скорее всего, в том, что среди COOKIE в localhost есть параметр содержащий @ в названии
   */
  return {
    proxy: [
      "/api/**/*",
      {
        target:"https://postman-echo.com",
        // auth: "user:password",
        // logLevel: "debug",
        changeOrigin: true
      }
    ],
    pathRewrite: [
      {
        test: /^\/(.+\/)?([^/.]+)$/,
        path: "/index.html"
      }
    ]
  };
}
