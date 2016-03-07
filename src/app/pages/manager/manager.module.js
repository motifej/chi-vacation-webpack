'use strict';

import './manager.scss';

import ManagerController from './manager.controller';

const managerModule = angular.module('manager-module', []);

managerModule.controller('ManagerController', ManagerController);

export default managerModule;