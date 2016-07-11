'use strict';
var DEVELOPMENT = false;
function config($logProvider, $compileProvider, toastrConfig, calendarConfig, $provide, actions) {
  'ngInject';

  // Enable log
  $compileProvider.debugInfoEnabled(DEVELOPMENT);
  $logProvider.debugEnabled(true);

  // Toastr config
  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 2000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.progressBar = true;

  // Calendar config
  calendarConfig.templates.calendarSlideBox = require('!!file!./pages/templates/calendarSlideBox.html');
  calendarConfig.templates.calendarMonthView = require('!!file!./pages/templates/calendarMonthView.html');
  calendarConfig.templates.calendarMonthCellEvents = require('!!file!./pages/templates/calendarMonthCellEvents.html');
  calendarConfig.templates.calendarMonthCell = require('!!file!./pages/templates/calendarMonthCell.html');
  calendarConfig.templates.calendarYearView = require('!!file!./pages/templates/calendarYearView.html');
  calendarConfig.templates.calendarDayView = require('!!file!./pages/templates/calendarDayView.html');
  calendarConfig.templates.calendarHourList = require('!!file!./pages/templates/calendarHourList.html');
  calendarConfig.dateFormatter = 'moment';
  calendarConfig.allDateFormats.moment.title.day = 'ddd D MMM YYYY';
  calendarConfig.allDateFormats.moment.date.day = 'D MMM YYYY';
  moment.locale('ua', {
    week : {
      dow : 1 // Monday is the first day of the week
    }
  });

  // Add to datepicker directive event 'monthchanged'
  $provide.decorator('uibDatepickerDirective', function($delegate, $injector) {
    let directive = $delegate[0],
    link = directive.link;

    directive.compile = function() {
      return function(scope, element, attrs, ctrl) {
        link.apply(this, arguments);

        scope.$watch(function() {
          return ctrl[0].activeDate.getTime();
        }, function(newVal, oldVal) {
          if (scope.datepickerMode == 'day') {
            oldVal = moment(oldVal).format('YYYY-MM');
            newVal = moment(newVal).format('YYYY-MM');

            if (oldVal !== newVal) {
              let $rootScope = $injector.get('$rootScope');
              $rootScope.$emit(actions.MONTHCHANGED, newVal);
            }
          }
        });
      };
    };
    return $delegate;
  });

}

export default config;
