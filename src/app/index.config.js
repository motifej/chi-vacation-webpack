'use strict';
var DEVELOPMENT = false;
function config($logProvider, $compileProvider, toastrConfig, calendarConfig/*, $sailsProvider*/) {
	'ngInject';

  // Enable log
  $compileProvider.debugInfoEnabled(DEVELOPMENT);
  $logProvider.debugEnabled(true);

  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 2000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.progressBar = true;

  calendarConfig.templates.calendarSlideBox = require('!!file!./pages/templates/calendarSlideBox.html');
  calendarConfig.templates.calendarMonthView = require('!!file!./pages/templates/calendarMonthView.html');
  calendarConfig.templates.calendarMonthCellEvents = require('!!file!./pages/templates/calendarMonthCellEvents.html');
  
  //$sailsProvider.url = 'http://localhost:3000';

}

export default config;
