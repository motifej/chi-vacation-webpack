import navbarTpl from './navbar.html';

export default function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: navbarTpl,
    scope: {
    },
    controller: NavbarController,
    controllerAs: 'vm'
  };

  return directive;
}

class NavbarController {
  constructor ($rootScope, $scope, toastr, actions, roles, states, sailsService, sailsAuthService, $uibModal) {
    'ngInject';
    this.sailsAuthService = sailsAuthService;
    this.sailsService = sailsService;
    this.states = states;
    this.roles = roles;
    this.isCollapsed = false;
    this.user = {};
    this.actions = actions;
    this.toastr = toastr;
    this.$uibModal = $uibModal;
    this.activate($rootScope, $scope);
  }

  activate($rootScope, $scope) {
    let destr = $rootScope.$on(this.actions.USERLOADED,
                  (ev, user) => this.user = user );
    $scope.$on('destroy', destr);
  }

  logOut() {
    this.sailsAuthService.logOut();
    this.user = {};
  }

  isAdmin() {
    return this.user.role == this.roles.ADMIN;
  }

  isManager() {
    return this.user.role == this.roles.MANAGER;
  }

  collapsed(val) {
    this.isCollapsed = val || !this.isCollapsed;
  }

  editProfile() {
    this.toastr.info('this feature in development state');
  }

  settings() {
    this.$uibModal.open({
        templateUrl: require('!!file!../userTools/modal/settings/settingsForm.html'),
        controller: require('../userTools/modal/settings/settings.controller'),
        controllerAs: 'user',
        resolve: {
          settings: this.sailsService.getSettings
        }
      });
  }
}
