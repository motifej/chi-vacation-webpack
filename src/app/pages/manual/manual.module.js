'use strict';

import './manual.scss';

import route from './manual.route';

const manualPageModule = angular.module('manual-module', [
	'ui.router'
]);

manualPageModule
    .config(route);

export default manualPageModule;