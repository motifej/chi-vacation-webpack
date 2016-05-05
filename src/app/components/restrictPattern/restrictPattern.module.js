'use strict';

import restrictPatternDirective from './restrict-pattern.directive';

const restrictPatternModule = angular.module('restrict-pattern-module', []);

restrictPatternModule
  .directive('restrictPattern', restrictPatternDirective);

export default restrictPatternModule;
