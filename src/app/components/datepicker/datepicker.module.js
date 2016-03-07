'use strict';

import DatepickerDirective from './datepicker.directive';
import './datepicker.scss';

const datepickerModule = angular.module('datepicker-module', []);

datepickerModule
  .directive('vacDatepicker', DatepickerDirective);

export default datepickerModule;
