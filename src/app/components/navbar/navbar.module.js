'use strict';

import NavbarDirective from './navbar.directive';
import './navbar.scss';

const navbarModule = angular.module('navbar-module', []);

navbarModule
  .directive('vacNavbar', NavbarDirective);

export default navbarModule;
