'use strict';

function runBlock($log, $rootScope, permission) {
	'ngInject';

	$rootScope.$on("$stateChangeStart", permission.init);

	$log.debug('run block end.');
	
}

export default runBlock;
