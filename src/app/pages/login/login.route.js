'use strict';

function route($stateProvider, roles, states) {
  'ngInject';

  $stateProvider
    .state(states.RESETPASSWORD, {
      data: {
        roles: roles.ANONIM
      },
      views: {
        'content@': {
          templateUrl: require('!!file-loader?name=templates/[name].[ext]!./resetPassword.html'),
          controller: 'LoginController'
        }
      }          
    })
    .state(states.CHANGEPASSWORD, {
      data: {
        roles: roles.ANONIM
      },
      views: {
        'content@': {
          templateUrl: require('!!file-loader?name=templates/[name].[ext]!./changePassword.html'),
          controller: 'LoginController'
        }
      }          
    })  

}

export default route;