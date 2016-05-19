export default class AddNewUserController {
  constructor ($filter, $uibModalInstance, $uibModal, toastr, sailsService, users, groups, user, isDelShow, sailsAuthService, mailService) {
    'ngInject';

    this.invalidForm = false;
    this.namePattern = '[a-zA-Zа-яА-Я]+';
    this.emailPattern = '\\w+.?\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,6}';
    this.filter = $filter;
    this.sailsService = sailsService;
    this.mailService = mailService;
    this.sailsAuthService = sailsAuthService;
    this.toastr = toastr;
    this.modal = $uibModal;
    this.modalInstance = $uibModalInstance;
    this.group = groups;
    this.role = users;
    this.isDelShow = isDelShow;

    this.newUser = angular.copy(user);
    this.newUser.employmentdate = new Date(this.newUser.employmentdate || 0);
    this.updateUser = this.sailsService.userResource.updateUser;
  }


  submitForm (isValid) {
    if (isValid) {
      this.invalidForm = false;
      this.modalInstance.close();
      delete this.newUser.vacations;
      delete this.newUser.daysoff;
      this.updateUser({id: this.newUser.id}, this.newUser).$promise.then(
        () => this.toastr.success('Edit user success', 'Success'),
        error => this.toastr.error(error.data.message, 'Error updating user')
        );
    } else {
      this.toastr.error('Not all fields are filled', 'Error');
      this.invalidForm = true;
    }
  }

  cancelNewUser() {
    this.modalInstance.dismiss('cancel');
  }

  deleteUser () {
    let modalInstance = this.modal.open({
      templateUrl: require('!!file!../confirmDialog/confirmDialog.html'),
      controller: require('../confirmDialog/confirmDialog.controller'),
      controllerAs: 'confirm',
      size: 'sm'
    });
    modalInstance.result.then(
      selectedItem => {
        if (selectedItem) {
          this.invalidForm = false;
          this.modalInstance.close();
          delete this.newUser.vacations;
          delete this.newUser.daysoff;
          this.updateUser({id: this.newUser.id}, angular.extend(this.newUser, {
            deleted: true
          })).$promise
            .then(
              () => this.toastr.success('Deleting user success', 'Success'),
              error => this.toastr.error(error.data.message, 'Error updating user')
            );
        }
      }
    )
  }

  resetPassword () {
    let modalInstance = this.modal.open({
      templateUrl: require('!!file!../confirmDialog/confirmDialog.html'),
      controller: require('../confirmDialog/confirmDialog.controller'),
      controllerAs: 'confirm',
      size: 'sm'
    }); 
    modalInstance.result.then(
      selectedItem => {
        if (selectedItem) {
          this.sailsAuthService.resetPassword(this.newUser.email)
            .then( (res) => 
              this.mailService.sendMailResetPassword({
                address: [{
                  address: this.newUser.email
                }],
                user: this.newUser,
                new_password: res.data.data,
                template_id: 'chi-password-reset'
              }))
            .then( () => {
              this.toastr.success('A new password was sent to user');
            })
            .catch( err => {
              this.toastr.error(err);
            });
        }

      }
    )
  }

}

