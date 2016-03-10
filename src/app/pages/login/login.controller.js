function LoginController ($log, $state, $scope, firebaseService,toastr, states) {
  'ngInject';

  $scope.sending = false;
  $scope.signin = signin;
  $scope.states = states;
  $scope.passwordPattern = '.{1,}';
  $scope.resetPassword = resetPassword;
  $scope.changePassword = changePassword;


  function signin () {
    if($scope.authForm.$invalid) {
      toastr.warning('Fieldes hasn\'t be empty!');
      return
    }
    $scope.sending = true;
    firebaseService.signInUserByEmail({
      email: $scope.email,
      password: $scope.passw || $scope.newPassword
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

   function changePassword () {
    if ($scope.newPassword !== $scope.newPassword2) {
      toastr.error('Entered passwords are different!', 'Error');
      return
    }
    if ($scope.authForm.$valid) {
      $scope.sending = true;
      firebaseService
        .changeUserPass($scope.email, $scope.oldPassword, $scope.newPassword)
        .then(
          () => { 
            toastr.success('Password changed success!', 'Success');
            signin();
          },
          error => {
            $scope.sending = false;
            toastr.error(error.error.message, 'Error changing password!');
          }
        );
    } else {
      toastr.error('Not all fields are filled', 'Error');
    }
  }  

}

export default LoginController;