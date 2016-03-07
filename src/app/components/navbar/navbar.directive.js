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
  constructor (firebaseService, $rootScope, $scope, actions, roles, states) {
    'ngInject';
    this.firebaseService = firebaseService;
    this.states = states;
    this.roles = roles;
    this.user = {};
    this.actions = actions
    this.activate($rootScope, $scope);
  }

  activate($rootScope, $scope) {
    let destr = $rootScope.$on(this.actions.USERLOADED,
                  (ev, user) => this.user = user );
    $scope.$on('destroy', destr);
  }

  logOut() {
    this.firebaseService.logOut();
    this.user = {};
  }

  isAdmin() {
    return this.user.role == this.roles.ADMIN;
  }

  isManager() {
    return this.user.role == this.roles.MANAGER;
  }
}
