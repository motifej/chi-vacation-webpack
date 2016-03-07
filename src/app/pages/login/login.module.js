'use strict';

import './login.scss';

import LoginController from './login.controller';

const loginModule = angular.module('login-module', []);

loginModule.controller('LoginController', LoginController);

export default loginModule;