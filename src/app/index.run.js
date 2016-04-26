import { USERSTORAGEKEY } from './core/constants/localstorage.consts';
'use strict';

function runBlock($log, $rootScope, permission, $http, $localStorage, $parse) {
	'ngInject';

	$rootScope.$on("$stateChangeStart", permission.init);

	let token = $parse('data.token')($localStorage[ USERSTORAGEKEY ])
	if (token) 
		$http.defaults.headers.common.Authorization = 'Bearer ' + token;
}

export default runBlock;
