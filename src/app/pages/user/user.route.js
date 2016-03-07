'use strict';

import userTpl from './user.html';

function route($stateProvider, roles, states) {
  'ngInject';

  $stateProvider
    .state(states.HOME, {
      parent: states.SITE,
      url: '/',
      data: {
          roles: roles.USER
      },
      views: {
        'content@': {
          templateUrl: userTpl,
          controller: require('./user.controller'),
          controllerAs: 'userCtrl'
        }
      }
    })

}

export default route;