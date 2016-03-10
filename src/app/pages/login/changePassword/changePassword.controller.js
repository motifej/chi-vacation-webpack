export default class AddNewUserController {
  constructor ($uibModalInstance, toastr, firebaseService, user) {
    'ngInject';

    this.invalidForm = false;
    this.differentPasswords = false;
    this.passwordPattern = '\\w+';
    this.firebaseService = firebaseService;
    this.toastr = toastr;
    this.modalInstance = $uibModalInstance;
    this.email = user.email;
  }

  submitForm (isValid) {
    if (this.newPassword !== this.newPassword2) {
      this.differentPasswords = true;
      this.toastr.error('Entered passwords are different!', 'Error');
      return
    }
    this.differentPasswords = false;
    if (isValid) {
      this.invalidForm = false;
      this.firebaseService.changeUserPass(this.email, this.oldPassword, this.newPassword).then(
        () => {
          this.toastr.success('Password changed success', 'Success');
          this.modalInstance.close();
        },
        error => this.toastr.error(error.error.message, 'Error changing password')
        );
    } else {
      this.toastr.error('Not all fields are filled', 'Error');
      this.invalidForm = true;
    }
  }

  cancelChangePassword() {
    this.modalInstance.dismiss('cancel');
  }

}

