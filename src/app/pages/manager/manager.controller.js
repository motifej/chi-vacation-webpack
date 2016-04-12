import { find } from 'lodash';

export default class ManagerController {
  constructor ($scope, $timeout, firebaseService, userList, $uibModal, moment, groups, status, toastr) {
    'ngInject';

    this.firebaseService = firebaseService;
    this.toastr = toastr;
    this.users = userList;
    this.groups = groups;
    this.status = status;
    this.filter = {};
    this.filtredUser;
    this.statusFilter = { status: status.INPROGRESS };
    this.groupFilter = {};
    this.modal = $uibModal;
    this.pageState = "Vacations";
    let today = new Date();
    today = today.setHours(0,0,0,0);
    this.order = 'startDate';
    this.oneThing = userList[0];
    this.awesomeThings = userList;
    this.userName = [];
    this.events = [];
    this.newEvent = {};
    this.selected = "sds";
    this.calendarView = 'month';
    this.calendarDay = new Date(today);
    this.newEvent.startsAt = new Date(today); 
    this.newEvent.endsAt = new Date(today);
    this.setDateInfo();

this.columnDefs = [
          { name:'firstName', field: 'firstName'},
          { name:'lastName', field: 'lastName' },
          { name:'startDate', field: 'startDate', type: 'date'},
          { name:'endDate', field: 'endDate', type: 'date'}
        ]
  }

    calcNewVacations(group) {
     var sum = 0;
     this.users.forEach(item => {
      if(item.group == group) {
        angular.forEach(item.vacations[this.pageState], el => {
          if(el.status == this.status.INPROGRESS) {
            sum++;
          }
        })
      }
     })
     return sum; 
    }
    confirmVacation(user, id) {

      let total = this.pageState === 'Vacations' ? user.vacations.total : user.vacations.dayOff;      
      var vacation = find(user.vacations[this.pageState], { id: id });
      let days = moment().isoWeekdayCalc(vacation.startDate,vacation.endDate,[1,2,3,4,5]);
      if(total >= days){
        vacation.status = this.status.CONFIRMED;
        if (this.pageState === 'Vacations') {
          user.vacations.total -= days
        } else {
          user.vacations.dayOff -= days
        }
        this.firebaseService.updateUserData(user).then(
          () => this.toastr.success('Vacation confirmed', 'Success'),
          error => this.toastr.error(error.error.message, 'Error confirming vacation')
          );
      } else {
        //todo translate message
        this.toastr.error('Not enough days', 'Error')
     }

    }
    
    rejectVacation(user, id) {
     var vacation = find(user.vacations[this.pageState], { id: id });
      if(vacation.status == this.status.CONFIRMED){
        let days = moment().isoWeekdayCalc(vacation.startDate,vacation.endDate,[1,2,3,4,5]);
        if (this.pageState === 'Vacations') {
          user.vacations.total += days
        } else {
          user.vacations.dayOff += days
        }
      }
     find(user.vacations[this.pageState], { id: id }).status = this.status.REJECTED;
      this.firebaseService.updateUserData(user).then(
        () => this.toastr.success('Vacation rejected', 'Success'),
        error => this.toastr.error(error.error.message, 'Error rejecting vacation')
        );
    }

    choiceGroup(group) {
      this.filter = { group: group };
      this.groupFilter = { group: group };
      this.setDateInfo();
    }

    choiceUser(uid, group, user) {
      this.filter = { uid: uid, group:group };
      this.groupFilter = { group: group };
      this.filtredUser = user;
      this.setDateInfo();
    }

    choiceButtonFilter(filter) {
      this.statusFilter.status = filter;
      this.setDateInfo();
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

    isRepeated(obj) {
      for (var i in obj) {
        return false;
      }
      return true;
    }
    
    changePageState(state) {
      this.pageState = state;
      this.setDateInfo();
    }
    

    _fillEvents(vacation) {
        angular.forEach(this.awesomeThings, (value) => {
        var user = value;
        if ( (vacation in value.vacations) && (!this.filter.group || this.filter.group == value.group) && (!this.filter.uid || this.filter.uid == value.uid) ) {
          let list = value.vacations[vacation];
          var {firstName, lastName} = value;
          angular.forEach(list, (value) => {
            var {startDate, endDate, status} = value;
              if (value.status == this.statusFilter.status || this.statusFilter.status == "") {
                // let typeEvent = {
                //   rejected: vacation === 'Vacations' ? 'important' : 'vv-dayoff-rejected',
                //   confirmed: vacation === 'Vacations' ? 'info' : 'vv-dayoff-confirmed', 
                //   inprogress: vacation === 'Vacations' ? 'warning' : 'vv-dayoff-warning', 
                // };
                let typeEvent = {rejected:'important',confirmed:'info', inprogress:'warning'};
                var event = 
                {
                  title: firstName + ' '+ lastName,
                  type: typeEvent[status],
                  cssClass: vacation === 'Vacations' ? '' : 'm-dayoff',
                  startsAt: new Date(startDate),
                  endsAt: new Date(endDate),
                  editable: false,
                  deletable: false,
                  incrementsBadgeTotal: true,
                  user: user
                };
                this.events.push(event);
              }
            
          });
        }
      });
    }

    setDateInfo() {
      var events = this.events = [];
      this._fillEvents('Vacations');
      this._fillEvents('DaysOff');

    }


  calcDays(startDate, endDate) {
    return moment().isoWeekdayCalc(startDate, endDate, [1, 2, 3, 4, 5])
  }

  setOrder(val) {
    this.order = val;
  }

  isActive(val) {
    return val === this.order;
  }

} 
