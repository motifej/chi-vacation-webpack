export default class UserInfoController {
  constructor (user, isDelShow, isEditShow, $uibModal, moment) {
    'ngInject';
    this.user = user;
    this.modal = $uibModal;
    this.isDelShow = isDelShow;
    this.isEditShow = isEditShow;
    
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
  }