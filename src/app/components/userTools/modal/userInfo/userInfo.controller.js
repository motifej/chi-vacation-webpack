export default class UserInfoController {
  constructor (user, isDelShow, isEditShow, $uibModal, moment, $uibModalInstance, sailsService, toastr, sailsAuthService) {
    'ngInject';
    this.user = user;
    this.modal = $uibModal;
    this.isDelShow = isDelShow;
    this.isEditShow = isEditShow;
    this.modalInstance = $uibModalInstance;
    this.newUser = angular.copy(user);
    this.sailsService = sailsService;
    this.updateUser = this.sailsService.userResource.updateUser;
    this.toastr = toastr;
    this.sailsAuthService = sailsAuthService;
    console.log(this.isDelShow)
    
    }
    editUser(user) {
    	this.modal.open({
        templateUrl: require('!!file!../editUser/editForm.html'),
        controller: require('../editUser/editUser.controller'),
        controllerAs: 'user',
        resolve: {
        	user: user,
            isDelShow: this.isDelShow
        }
      });
    }
    calcEnableDays() {
        let days = moment().isoWeekdayCalc(this.user.employmentdate, new Date(),[1,2,3,4,5,6,7]);
        return Math.round((days % 365.25)*20/365.25);
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
            delete this.newUser.workfromhome;
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
                template_id: 'chi-password-reset',
                host_addr: location.origin + '/#/login' 
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