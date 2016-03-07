'use strict';
import FirebaseService from '../core/services/firebase.service'

const shared = angular.module('core.shared', []);
			shared.service('firebaseService', FirebaseService);

//require('./directives/validation-test/validation-test.directive')(shared);

require('./constants/index.const')(shared);
require('./services/persmissions.service')(shared);
require('./services/firebaseResolver.provider')(shared);
require('./services/resolver.provider')(shared);

require('./filters/status.filter')(shared);
require('./filters/phoneFilter.filter')(shared);
require('./filters/userFilterVacation.filter')(shared);

export default shared;
