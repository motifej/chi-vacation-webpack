'use strict';

function routeConfig($urlRouterProvider, $stateProvider, resolverProvider, sailsResolverProvider, roles, states) {
  'ngInject';

    $stateProvider
        .state(states.LOGIN, {
          url: '/login',
          data: {
              roles: roles.ANONIM
          },
          views: {
            'content@': {
              templateUrl: require('!!file-loader?name=templates/[name].[ext]!./pages/login/login.html'),
              controller: 'LoginController'
            }
          },
          resolve: {
            asyncPreloading: resolverProvider.loginPagePrealoading
          }
        })       
        .state(states.SITE, {
          'abstract': true,
          resolve: {
            user : sailsResolverProvider.loadUser
          }
        })
        .state(states.ADMIN, {
          parent: states.SITE,
          url: '/admin',
          data: {
              roles: roles.ADMIN
          },
          resolve: {
            asyncPreloading: resolverProvider.adminPagePrealoading,
            userData : function(sailsService) {
              return sailsService.getUsers()
            }
          },
          views: {
            'content@': {
              templateUrl: require('!!file-loader?name=templates/[name].[ext]!./pages/admin/vv.html'),
              controller: 'VvController',
              controllerAs: 'admin'
              }
          }
        })
        .state(states.MANAGER, {
          parent: states.SITE,
          url: '/manager',
          data: {
              roles: roles.MANAGER
          },
          resolve: {
            asyncPreloading: resolverProvider.managerPagePrealoading,
            //userList : sailsResolverProvider.getUsersList,
            userData : function(sailsService) {
              return sailsService.getUsers()
            }
          },

          views: {
            'content@': {
              templateUrl: require('!!file-loader?name=templates/[name].[ext]!./pages/manager/manager.html'),
              controller: 'ManagerController',
              controllerAs: 'manager'
              }
          }
        })
        .state(states.SETTINGS, {
          parent: states.SITE,
          url: '/settings',
          data: {
              roles: roles.MANAGER
          },
          resolve: {
            asyncPreloading: resolverProvider.adminPagePrealoading,
            userData : function(sailsService) {
              return sailsService.getUsers()
            }
          },
          views: {
            'content@': {
              templateUrl: require('!!file-loader?name=templates/[name].[ext]!./pages/admin/vv.html'),
              controller: 'VvController',
              controllerAs: 'admin'
              }
          }
        });


  $urlRouterProvider.otherwise('/login');

}

export default angular
  .module('index.routes', [])
    .config(routeConfig);