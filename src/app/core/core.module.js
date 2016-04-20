'use strict';
import FirebaseService from '../core/services/firebase.service'
import SailsService from '../core/services/sails.service'

const shared = angular.module('core.shared', []);
			shared.service('firebaseService', FirebaseService);
			shared.service('sailsService', SailsService);

//require('./directives/validation-test/validation-test.directive')(shared);

require('./constants/index.const')(shared);
require('./services/persmissions.service')(shared);
require('./services/firebaseResolver.provider')(shared);
require('./services/resolver.provider')(shared);

require('./filters/status.filter')(shared);
require('./filters/statusUser.filter')(shared);
require('./filters/phoneFilter.filter')(shared);
require('./filters/userFilterVacation.filter')(shared);
require('./filters/orderByObject.filter')(shared);

export default shared;
