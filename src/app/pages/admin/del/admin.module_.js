'use strict';

import './vv.scss';

import VvController from './vv.controller';

const adminModule = angular.module('admin-module', []);

adminModule.controller('VvController', VvController);

export default adminModule;