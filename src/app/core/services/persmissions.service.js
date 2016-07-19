export default function (app) {

  app.service('permission', PermissionService);

  function PermissionService ($state, toastr, $parse, states, roles, sailsAuthService, $rootScope) {
    'ngInject'
    
    this.init = init;
    this.$rootScope = $rootScope;

    function init (event, toState, toParams, fromState) {
      if ( !sailsAuthService.getUserState() && toState.name !== states.LOGIN 
        && toState.name !== states.CHANGEPASSWORD && toState.name !== states.RESETPASSWORD) {
        event.preventDefault();
        $rootScope.prevParams = toParams;
        $rootScope.prevState = toState;
        $state.go(states.LOGIN);
      }
      
      let roles = $parse('data.roles')(toState) || roles.ANONIM;
      if( !roles.length ){
        toastr.error('can not url fo this state');
        event.preventDefault();
        return;
      }

      if ( sailsAuthService.checkPersmissions(roles) ) {
        return true;
      }

      event.preventDefault();

      if( fromState.url === '^' ) {
        let { user } = sailsAuthService.getAuthUser();
        let { type, id } = toParams;
        if( user ) {
          if ( type && id && (user.role === states.ADMIN || user.role === states.MANAGER ) ) {
            $state.go(user.role, toParams);
          } else {
            $state.go(states.HOME);
          }
        } else {
          $state.go(states.LOGIN);
        }
      }
    }

  }

}