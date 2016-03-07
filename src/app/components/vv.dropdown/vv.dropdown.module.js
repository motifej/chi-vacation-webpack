'use strict';

import dropdownListDirective from './vv.dropdown.directive';
import './vv.dropdown.scss';

const vvDropdownModule = angular.module('vv-dropdown-module', []);

vvDropdownModule
  .directive('dropdownListDirective', dropdownListDirective);

export default vvDropdownModule;
