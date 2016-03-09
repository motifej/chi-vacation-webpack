'use strict';
var DEVELOPMENT = false;
function config($logProvider, $compileProvider, toastrConfig) {
	'ngInject';

  // Enable log
  $compileProvider.debugInfoEnabled(DEVELOPMENT);
  $logProvider.debugEnabled(true);

  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 2000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.progressBar = true;
  
}

export default config;
