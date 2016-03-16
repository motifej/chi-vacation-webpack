'use strict';
var DEVELOPMENT = false;
function config($logProvider, $compileProvider, toastrConfig, calendarConfig) {
	'ngInject';

  // Enable log
  $compileProvider.debugInfoEnabled(DEVELOPMENT);
  $logProvider.debugEnabled(true);

  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 2000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.progressBar = true;

  calendarConfig.templates.calendarSlideBox = require('!!file!./pages/templates/calendarSlideBox.html');
  
}

export default config;
