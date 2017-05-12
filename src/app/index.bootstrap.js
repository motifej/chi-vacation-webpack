'use strict';

// index.html page to dist folder
import '!!file-loader?name=[name].[ext]!../favicon.ico';

// main App module
import "./index.module";

//import "../assets/styles/sass/index.scss";
import "../assets/styles/bootstrap.min.scss";
import "../assets/styles/scss/main.scss";

angular.element(document).ready(function () {
  angular.bootstrap(document, ['test'], {
    strictDi: true
  });
});
