'use strict';
import * as roles  from '../../core/constants/roles.consts';
import * as states  from '../../core/constants/routeStates.const';
import errorTpl from './errorload.html';

function route($stateProvider) {
  'ngInject';

  $stateProvider
     .state(states.ERRLOAD, {
        data: {
            roles: roles.USER
        },
        views: {
          'content@': {
            templateUrl: errorTpl
            }
        }
    });

}

export default route;
