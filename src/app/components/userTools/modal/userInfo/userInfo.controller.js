export default class UserInfoController {
  constructor (user, isDelShow, isEditShow, $uibModal, moment) {
    'ngInject';
    this.user = user;
    this.modal = $uibModal;
    this.isDelShow = isDelShow;
    this.isEditShow = isEditShow;
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
  }