export default class AddNewUserController {
  constructor ($filter, $uibModalInstance, toastr, sailsService, users, groups, user) {
    'ngInject';

    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filter = $filter;
    this.sailsService = sailsService;
    this.toastr = toastr;
    this.modalInstance = $uibModalInstance;
    this.group = groups;
    this.role = users;
    this.employmentdate = new Date(user.employmentdate || 0);

    this.newUser = angular.extend({}, user);
  }

  submitForm (isValid) {
    if (isValid) {
      this.invalidForm = false;
      this.modalInstance.close();
      this.sailsService.userResource.updateUser({id: this.newUser.id}, this.newUser).$promise.then(
        () => this.toastr.success('Edit user success', 'Success'),
        error => this.toastr.error(error.data.message, 'Error updating user')
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

  deleteUser () {
      this.invalidForm = false;
      this.modalInstance.close();
      this.sailsService.userResource.deleteUser({id: this.newUser.id}, this.newUser).$promise.then(
        () => this.toastr.success('Deleting user success', 'Success'),
        error => this.toastr.error(error.data.message, 'Error deleting user')
        );
  }

}

