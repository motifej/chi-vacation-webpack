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
  constructor ($rootScope, $scope, toastr, actions, roles, states, sailsService, sailsAuthService, $uibModal, users, $state) {
    'ngInject';
    this.sailsAuthService = sailsAuthService;
    this.sailsService = sailsService;
    this.states = states;
    this.roles = roles;
    this.users = users;
    this.$state = $state;
    this.isCollapsed = false;
    this.user = {};
    this.actions = actions;
    this.toastr = toastr;
    this.manualState = this.states.MANUAL;
    this.$uibModal = $uibModal;
    this.activate($rootScope, $scope);
  }

  activate($rootScope, $scope) {
    let destr = $rootScope.$on(this.actions.USERLOADED,
      (ev, user) => this.user = user )
    $scope.$on('destroy', destr);
    let getAvalableDays = $rootScope.$on('getAvalableDays',
      (ev, sum) => {this.avalableDays = sum} )
    $scope.$on('destroy', getAvalableDays);
  }

  logOut() {
    this.isCollapsed = false;
    this.sailsAuthService.logOut();
    this.user = {};
  }

  isAdmin() {
    return this.user.role == this.roles.ADMIN;
  }

  isManager() {
    return this.user.role == this.roles.MANAGER;
  }
  
  isTeamLead() {
    return this.user.role == this.roles.TEAMLEAD;
  }

  manual() {
    this.$state.go(
      ~this.roles.MANAGERS.indexOf(this.user.role) ? 
        this.states.MANUALMANAGER : 
        this.states.MANUAL
    ); 
  }
  
  collapsed(val) {
    this.isCollapsed = val || !this.isCollapsed;
  }

  selected() {
    this.isCollapsed = false;
  }

  editProfile() {
    this.toastr.info('this feature in development state');
    this.isCollapsed = false;
  }

  settings() {
    this.isCollapsed = false;
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
