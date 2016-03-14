import { find } from 'lodash';

export default class ManagerController {
  constructor ($scope, $timeout, firebaseService, userList, $uibModal, moment, groups, status) {
    'ngInject';

    this.firebaseService = firebaseService;
    this.users = userList;
    debugger;
    this.groups = groups;
    this.status = status;
    this.filter = {};
    this.statusFilter = { status: status.INPROGRESS };
    this.modal = $uibModal;



this.columnDefs = [
          { name:'firstName', field: 'firstName'},
          { name:'lastName', field: 'lastName' },
          { name:'startDate', field: 'startDate', type: 'date'},
          { name:'endDate', field: 'endDate', type: 'date'}
        ]


  }

    confirmVacation(user, id) {
     var vacation = find(user.vacations.list, { id: id });
     if(user.vacations.total >= moment().isoWeekdayCalc(vacation.startDate,vacation.endDate,[1,2,3,4,5])){
     vacation.status = this.status.CONFIRMED;
      user.vacations.total -= moment().isoWeekdayCalc(vacation.startDate,vacation.endDate,[1,2,3,4,5]);
     }
      this.firebaseService.updateUserData(user);
    }
    rejectVacation(user, id) {
     var vacation = find(user.vacations.list, { id: id });
      if(vacation.status == this.status.CONFIRMED){
        user.vacations.total += moment().isoWeekdayCalc(vacation.startDate,vacation.endDate,[1,2,3,4,5]);
      }
     find(user.vacations.list, { id: id }).status = this.status.REJECTED;
      this.firebaseService.updateUserData(user);
    }
    choiceGroup(group) {
      this.filter = { group: group };
    }
    choiceUser(user, group) {
      this.filter = { uid: user, group:group };
    }
    choiceButtonFilter(filter) {
      this.statusFilter.status = filter;
    }
    openNewUserForm() {
      this.modal.open({
        templateUrl: require('!!file!./modal/addNewUser/newUserForm.html'),
        controller: require('./modal/addNewUser/addNewUser.controller'),
        controllerAs: 'user'
      });
    }
    userInfo(user) {
      this.modal.open({
        templateUrl: require('!!file!./modal/userInfo/userInfo.html'),
        controller: require('./modal/userInfo/userInfo.controller'),
        controllerAs: 'info',
        resolve: {
          user: user
        }
      });
    }

} 
