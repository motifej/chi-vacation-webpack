function LoginController ($log, $state, $scope, firebaseService,toastr, states) {
  'ngInject';

  $scope.signin = signin;
  $scope.sending = false;


  function signin () {
    if($scope.loginForm.$invalid) {
      toastr.warning('Fieldes hasn\'t be empty!');
      return
    }
    $scope.sending = true;
    firebaseService.signInUserByEmail({
      email: $scope.email,
      password: $scope.passw
    }).then( () => {
        $state.go(states.HOME);
    }).catch( err => {
      toastr.error(err.error.message, err.error.code);
      $log.error(err);
      $scope.sending = false;
    });
  }

}

export default LoginController;