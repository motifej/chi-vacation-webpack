'use strict';

import './user.scss';

import route from './user.route';

const userPageModule = angular.module('user-module', [
	'ui.router'
]);

userPageModule
    .config(route);

export default userPageModule;