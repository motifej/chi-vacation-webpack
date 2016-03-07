import newUserFormTmpl from './modal/addNewUser/newUserForm.html';
import userInfoTmpl from './modal/userInfo/userInfo.html';

export default class ManagerController {
  constructor ($scope, $timeout, firebaseService, userList, /*$modal,*/ moment, groups, status) {
    'ngInject';

    this.firebaseService = firebaseService;
    this.users = userList/*.map(user => {
      user.vacations.list = user.vacations.list.filter(item => item.startDate && item.endDate);
      return user;
    })*/;
    this.groups = groups;
    this.status = status;
    this.filter = {};
    this.statusFilter = { status: status.INPROGRESS };
    //this.modal = $modal;

  }

    confirmVacation(user, id) {
     var vacation = find(user.vacations.list, { id: id });
     vacation.status = status.CONFIRMED;
      //user.vacations.total -= moment().isoWeekdayCalc(vacation.startDate,vacation.endDate,[1,2,3,4,5]);
      this.firebaseService.updateUserData(user);
    }
    rejectVacation(user, id) {
     find(user.vacations.list, { id: id }).status = this.status.REJECTED;
      this.firebaseService.updateUserData(user);
    }
    choiceGroup(group) {
      this.filter = { group: group };
    }
    choiceUser(user) {
      this.filter = { uid: user };
    }
    choiceButtonFilter(filter) {
      this.statusFilter.status = filter;
    }
    openNewUserForm() {
      this.modal.open({
        templateUrl: newUserFormTmpl,
        controller: require('./modal/addNewUser/addNewUser.controller'),
        controllerAs: 'user'
      });
    }
    userInfo(user) {
      this.modal.open({
        templateUrl: userInfoTmpl,
        controller: require('./modal/userInfo/userInfo.controller'),
        controllerAs: 'info',
        resolve: {
          user: user
        }
      });
    }

} 
