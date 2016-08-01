'use strict';

import manualTpl from './manual.html';
import fullMmanualTpl from './fullManual.html';

function route($stateProvider, roles, states) {
  'ngInject';

  $stateProvider
    .state(states.MANUAL, {
      parent: states.SITE,
      url: '/manual',
      data: {
          roles: roles.USER
      },
      views: {
        'content@': {
          templateUrl: manualTpl
        }
      },
      resolve: {
        settings: sailsService => sailsService.getSettings()
      },
    })
    .state(states.MANUALMANAGER, {
      parent: states.SITE,
      url: '/full_manual',
      data: {
          roles: roles.MANAGERS
      },
      views: {
        'content@': {
          templateUrl: fullMmanualTpl
        }
      },
      resolve: {
        settings: sailsService => sailsService.getSettings()
      },
    })

}

export default route;