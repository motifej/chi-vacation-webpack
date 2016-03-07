export default function (app) {
  
  app.service('permission', PermissionService);

  function PermissionService ($rootScope, $state, firebaseService, toastr, $parse, states, roles) {
    'ngInject'
    
    this.init = init;

    function init (event, toState, toParams, fromState) {
      let roles = $parse('data.roles')(toState) || roles.ANONIM;
      if( !roles.length ){
        toastr.error('can not url fo this state');
        event.preventDefault();
        return;
      }

      if ( firebaseService.checkPersmissions(roles) ) {
        return;
      }

      event.preventDefault();

      if( fromState.url === '^' ) {
          if( firebaseService.getAuthUser() ) {
              $state.go(states.HOME);
          } else {
              $state.go(states.LOGIN);
          }
      }
    }
  }

}