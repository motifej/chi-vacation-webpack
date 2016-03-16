'use strict';

function runBlock($log, $rootScope, permission) {
	'ngInject';

	$rootScope.$on("$stateChangeStart", permission.init);
	
}

export default runBlock;
