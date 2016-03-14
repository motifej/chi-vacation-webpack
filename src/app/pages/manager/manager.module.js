'use strict';

import './manager.scss';

import ManagerController from './manager.controller';

const managerModule = angular.module('manager-module', ["ui.grid"]);

managerModule.controller('ManagerController', ManagerController);

export default managerModule;