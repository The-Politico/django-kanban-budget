const open = require('open');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxyProc = require('express-http-proxy');
const webpackConfig = require('../../webpack-dev.config');

const app = express();

module.exports = {
  startServer: (port, proxy) => {
    const compiler = webpack(webpackConfig(port));
    const middleware = webpackMiddleware(compiler, {
      publicPath: '/static/budget/',
      stats: {
        colors: true,
      },
    });
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.use('/', proxyProc(`localhost:${proxy}`));

    app.listen(port, () => {
      app.keepAliveTimeout = 0;
    });

    middleware.waitUntilValid(() => {
      console.log(`app started on port ${port}`);
      open(`http://localhost:${port}`);
    });
  },
};
