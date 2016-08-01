'use strict';

import * as components from './index.components';
import config from './index.config';
import run from './index.run';

const App = angular.module(
  "test", [
    // plugins
    require('angular-ui-router'),
    "ngAnimate", 
  	"ngCookies", 
  	"ngTouch", 
  	"ngSanitize", 
  	"ngMessages", 
  	"ngAria", 
  	"oc.lazyLoad",
    'toastr',
    "ui.bootstrap",
    "mwl.calendar",
    "ngStorage",
    "btorfs.multiselect",
    //"ngSails",


    require('angular-resource'),

    require("./core/core.module").name,

    // components
    require("./index.components").name,

    // routes
    require("./index.routes").name,

    // pages
    require("./pages/user/user.module").name,
    require("./pages/manual/manual.module").name,
    require("./pages/error/error.module").name

  ]
);

App
  .config(config)
  .run(run);



export default App;
