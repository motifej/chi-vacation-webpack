function LoginController ($log, $state, $scope, firebaseService,toastr, states) {
  'ngInject';

  $scope.signin = signin;
  $scope.states = states;
  $scope.sending = false;
  $scope.resetPassword = resetPassword;


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

  function resetPassword () {
    if($scope.resetPasswordForm.$invalid) {
      toastr.warning('Fieldes hasn\'t be empty!');
      return
    }
    $scope.sending = true;
    firebaseService.resetAndSendPassword($scope.email)
    .then( () => {
      toastr.success('Check your email!');
      $state.go(states.LOGIN);
    }).catch( err => {
      toastr.error(err.error.message, err.error.code);
      $log.error(err);
      $scope.sending = false;
    });
  }  

}

export default LoginController;