'use strict';

import route from './error.route';
import './errorload.scss';

const errorPageModule = angular.module('main-module', [
  'ui.router'
]);

errorPageModule
    .config(route);

export default errorPageModule;
