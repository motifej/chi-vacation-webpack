export default function (app) {

  app.service('permission', PermissionService);

  function PermissionService ($rootScope, $state, toastr, $parse, states, roles, sailsAuthService) {
    'ngInject'
    
    this.init = init;

    function init (event, toState, toParams, fromState) {
      if ( !sailsAuthService.getUserState() && toState.name !== states.LOGIN) {
        event.preventDefault();
        $state.go(states.LOGIN);
      }
      let roles = $parse('data.roles')(toState) || roles.ANONIM;
      if( !roles.length ){
        toastr.error('can not url fo this state');
        event.preventDefault();
        return;
      }

      if ( sailsAuthService.checkPersmissions(roles) ) {
        return;
      }

      event.preventDefault();

      if( fromState.url === '^' ) {
        if( sailsAuthService.getAuthUser() ) {
          $state.go(states.HOME);
        } else {
          $state.go(states.LOGIN);
        }
      }
    }

  }

}