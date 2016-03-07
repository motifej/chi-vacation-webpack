'use strict';

export default angular.module('index.components', [
	require('./components/navbar/navbar.module').name,
	require('./components/vv.dropdown/vv.dropdown.module').name,
	require('./components/datepicker/datepicker.module').name
]);
