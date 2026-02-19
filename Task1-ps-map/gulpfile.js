/***
 *    ██████╗ ███████╗ ██████╗ ██╗   ██╗██╗██████╗ ███████╗
 *    ██╔══██╗██╔════╝██╔═══██╗██║   ██║██║██╔══██╗██╔════╝
 *    ██████╔╝█████╗  ██║   ██║██║   ██║██║██████╔╝█████╗
 *    ██╔══██╗██╔══╝  ██║▄▄ ██║██║   ██║██║██╔══██╗██╔══╝
 *    ██║  ██║███████╗╚██████╔╝╚██████╔╝██║██║  ██║███████╗
 *    ╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝  ╚═════╝ ╚═╝╚═╝  ╚═╝╚══════╝
 */

const { task, series, parallel } = require("gulp");


/***
 *     ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗
 *    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝
 *    ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
 *    ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
 *    ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
 *     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝
 */
const { init } = require("./scripts/gulp/config");


/***
 *    ████████╗ █████╗ ███████╗██╗  ██╗███████╗
 *    ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝
 *       ██║   ███████║███████╗█████╔╝ ███████╗
 *       ██║   ██╔══██║╚════██║██╔═██╗ ╚════██║
 *       ██║   ██║  ██║███████║██║  ██╗███████║
 *       ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
 */

task("build", series(init({ isServe: false }), require("./scripts/gulp/_build")));
task("serve", series(init({ isServe: true }), require("./scripts/gulp/_serve")));
task("deploy", require("./scripts/deploy"));
task("build_dev", series(init({ isServe: false, noVersion: true, isDev: true }), require("./scripts/gulp/_build")));


task("styles", require("./scripts/gulp/_styles"));
task("scripts", require("./scripts/gulp/_scripts"));
task("pug", require("./scripts/gulp/_pug"));


task("email", require("./scripts/gulp/_email"));
task("copy-assets", require("./scripts/gulp/_assets").copyAssets);
task("lint", require("./scripts/gulp/_lint"));


task("build_bitrix", series(init({ isBitrix: true }), requireOnDemand("./scripts/gulp/bitrix"), require("./scripts/gulp/_build")));

// require('./scripts/gulp/components_status');
// require('./scripts/gulp/typograf');

function requireOnDemand(path) {
  return (cb) => {
    require(path);
    cb();
  };
}
