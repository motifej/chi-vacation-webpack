import { USERSTORAGEKEY } from './core/constants/localstorage.consts';
'use strict';

function runBlock($log, $rootScope, permission, $http, $localStorage) {
	'ngInject';

	$rootScope.$on("$stateChangeStart", permission.init);

	let token = $localStorage[ USERSTORAGEKEY ].data.token;
	if (token) 
		$http.defaults.headers.common.Authorization = 'Bearer ' + token;
}

export default runBlock;
