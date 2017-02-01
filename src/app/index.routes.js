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
          url: '/admin?id?type',
          data: {
              roles: roles.ADMIN
          },
          resolve: {
            asyncPreloading: resolverProvider.adminPagePrealoading,
            userData : sailsService => sailsService.getUsers(),
            settings: sailsService => sailsService.getSettings()
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
          url: '/manager?id?type',
          data: {
              roles: roles.MANAGER
          },
          resolve: {
            asyncPreloading: resolverProvider.adminPagePrealoading,
            userData : sailsService => sailsService.getUsers(),
            settings: sailsService => sailsService.getSettings()
          },

          views: {
            'content@': {
              templateUrl: require('!!file-loader?name=templates/[name].[ext]!./pages/admin/vv.html'),
              controller: 'VvController',
              controllerAs: 'admin'
              }
          }
        })
        .state(states.TEAMLEAD, {
          parent: states.SITE,
          url: '/team-lead?id?type',
          data: {
              roles: roles.TEAMLEAD
          },
          resolve: {
            asyncPreloading: resolverProvider.adminPagePrealoading,
            userData : sailsService => sailsService.getUsers(),
            settings: sailsService => sailsService.getSettings()
          },

          views: {
            'content@': {
              templateUrl: require('!!file-loader?name=templates/[name].[ext]!./pages/admin/vv.html'),
              controller: 'VvController',
              controllerAs: 'admin'
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
            userData : sailsService => sailsService.getUsers()
          },
          views: {
            'content@': {
              templateUrl: require('!!file-loader?name=templates/[name].[ext]!./pages/admin/vv.html'),
              controller: 'VvController',
              controllerAs: 'admin'
              }
          }
        }).state(states.CHANGEPASSWORD, {
            views: {
              'content@': {
                templateUrl: require('!!file-loader?name=templates/[name].[ext]!./pages/login/changePassword.html'),
                controller: 'LoginController'
              }
            }          
          });


  $urlRouterProvider.otherwise('/login');

}

export default angular
  .module('index.routes', [])
    .config(routeConfig);