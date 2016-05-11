'use strict';
import SailsService from '../core/services/sails.service'
import MailService from '../core/services/mail.service'
import SailsAuthService from '../core/services/sailsAuth.service'

const shared = angular.module('core.shared', []);
			shared.service('sailsService', SailsService);
			shared.service('mailService', MailService);
			shared.service('sailsAuthService', SailsAuthService);

//require('./directives/validation-test/validation-test.directive')(shared);

require('./constants/index.const')(shared);
require('./services/persmissions.service')(shared);
require('./services/sailsResolver.provider')(shared);
require('./services/resolver.provider')(shared);

require('./filters/status.filter')(shared);
require('./filters/statusUser.filter')(shared);
require('./filters/phoneFilter.filter')(shared);
require('./filters/userFilterVacation.filter')(shared);
require('./filters/orderByObject.filter')(shared);

export default shared;
