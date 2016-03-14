'use strict';

import './login.scss';

import LoginController from './login.controller';
import route from './login.route';

const loginModule = angular.module('login-module', []);

loginModule
    .config(route)
    .controller('LoginController', LoginController);

export default loginModule;