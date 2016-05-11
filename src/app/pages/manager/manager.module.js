'use strict';

import './manager.scss';

import ManagerController from '../admin/vv.controller';

const managerModule = angular.module('manager-module', []);

managerModule.controller('ManagerController', ManagerController);

export default managerModule;