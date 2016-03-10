export default class AddNewUserController {
  constructor ($filter, $uibModalInstance, toastr, firebaseService, users, groups, user) {
    'ngInject';

    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filter = $filter;
    this.firebaseService = firebaseService;
    this.toastr = toastr;
    this.modalInstance = $uibModalInstance;
    this.group = groups;
    this.role = users;

    this.newUser = angular.extend({}, user);
  }

  submitForm (isValid) {
    if (isValid) {
      this.invalidForm = false;
      this.modalInstance.close();
      this.newUser.password = this.newUser.email;
      this.firebaseService.updateUserData(this.newUser).then(
        () => this.toastr.success('Edit user success', 'Success'),
        error => this.toastr.error(error.error.message, 'Error updating user')
        );
    } else {
      this.toastr.error('Not all fields are filled', 'Error');
      this.invalidForm = true;
    }
  }

  phoneChanged() {
   this.newUser.phone = this.filter('phoneFilter')(this.newUser.phone);
  }

  cancelNewUser() {
    this.modalInstance.dismiss('cancel');
  }

}

