import { find } from 'lodash';

export default class VvController {
  constructor ($scope, $timeout, firebaseService, userData, $uibModal, moment, groups, status, toastr, user, $log, sailsService) {
    'ngInject';
    
    this.firebaseService = firebaseService;
    this.sailsService = sailsService;
    this.toastr = toastr;
    this.users = userData.data;
    this.sailsService.setUsers(userData);
console.log(angular.copy(this.users));
    this.groups = groups;
    this.status = status;
    this.filter = {};
    this.filtredUser;
    this.statusFilter = { status: status.NEW };
    this.groupFilter = {};
    this.modal = $uibModal;
    this.pageState = "vacations";
    let today = new Date();
    today = today.setHours(0,0,0,0);
    this.order = 'startDate';
    this.oneThing = [];
    this.userName = [];
    this.events = [];
    this.newEvent = {};
    this.selected = "sds";
    this.calendarView = 'month';
    this.calendarDay = new Date(today);
    this.newEvent.startsAt = new Date(today); 
    this.newEvent.endsAt = new Date(today);
    this.setDateInfo();
    //  USERS
    $scope.startDate = new Date();
    $scope.minStartDate = new Date($scope.startDate);
    $scope.endDate = new Date($scope.startDate);
    $scope.minEndDate = new Date($scope.startDate);
    this.user = user;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.user = user;
    this.vacationDays = this.calcDays();
    this.moment = moment;
    this.$log = $log;
    this.vacationState = 'vacations';
/*    sailsService.userResource.getUserData({id: 7}).$promise.then(item => {
      console.log(item.User)
    })
    


      console.log(user);
      console.log(sailsService.userResource.getUserData({id: 7}).User);*/


    

this.columnDefs = [
          { name:'firstName', field: 'firstName'},
          { name:'lastName', field: 'lastName' },
          { name:'startDate', field: 'startDate', type: 'date'},
          { name:'endDate', field: 'endDate', type: 'date'}
        ]
  }

    calcNewVacations(group) {
     /*var sum = 0;
     this.users.forEach(item => {
      if(item.group == group) {
        angular.forEach(item[this.pageState], el => {
          if(el.status == this.status.NEW) {
            sum++;
          }
        })
      }
     })
     return sum; */
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
      this.filtredUser = {};
    }

    choiceUser(id, group, user) {
      this.filter = { id: id, group:group };
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
        templateUrl: require('!!file!../../components/userTools/modal/addNewUser/newUserForm.html'),
        controller: require('../../components/userTools/modal/addNewUser/addNewUser.controller'),
        controllerAs: 'user'
      });
    }

    userInfo(user) {
      this.modal.open({
        templateUrl: require('!!file!../../components/userTools/modal/userInfo/userInfo.html'),
        controller: require('../../components/userTools/modal/userInfo/userInfo.controller'),
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
        angular.forEach(this.users, (value) => {
        var user = value;
        if ( (vacation in value) && (!this.filter.group || this.filter.group == value.group) && (!this.filter.id || this.filter.id == value.id) ) {
          let list = value[vacation];
          var {firstname, lastname} = value;
          angular.forEach(list, (value) => {
            var {startdate, enddate, status} = value;
              if (value.status == this.statusFilter.status || this.statusFilter.status == "") {
                // let typeEvent = {
                //   rejected: vacation === 'Vacations' ? 'important' : 'vv-dayoff-rejected',
                //   confirmed: vacation === 'Vacations' ? 'info' : 'vv-dayoff-confirmed', 
                //   inprogress: vacation === 'Vacations' ? 'warning' : 'vv-dayoff-warning', 
                // };
                let typeEvent = {rejected:'important',confirmed:'info', inprogress:'warning', new:'warning'};
                var event = 
                {
                  title: firstname + ' '+ lastname,
                  type: typeEvent[status],
                  cssClass: vacation === 'vacations' ? '' : 'm-dayoff',
                  startsAt: new Date(startdate),
                  endsAt: new Date(enddate),
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
    this._fillEvents('vacations');
    this._fillEvents('daysoff');

  }

  submitHandler(startDate, endDate) {
    let vm = this;
    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let toastrOptions = {progressBar: false};
    let vacation;
    
    let listArray = [];
    vm.vacations = [];
    listArray.push(this.filtredUser['vacations']);
    listArray.push(this.filtredUser['daysoff']);



    listArray.forEach( list => {
      if (list) {
        for (let item in list) {
          if (list[item].status === 'rejected') continue;
          vm.vacations.push({startDate: list[item].startDate, endDate: list[item].endDate, status: list[item].status, commentary: list[item].commentary});
        }
      }
    });

    if (vm.vacations && isCrossingIntervals(vm.vacations)) {
      this.toastr.error('Vacation intervals are crossing! Please, choose correct date.', toastrOptions);
      return;
    }

    /*let total = this.vacationState === 'Vacations' ? this.filtredUser.vacations.total : this.filtredUser.vacations.dayOff;
    if (this.vacationDays > total) {
      this.toastr.error('You have exceeded the number of available days!', toastrOptions);
      return;
    }*/

    vacation = {
      startDate: sDate,
      endDate: eDate,
      status: 'inprogress',
      commentary: null
    };

    this.firebaseService.createNewVacation(vacation, this.vacationState, this.filtredUser.uid);
    if(this.vacationState == "vacations") {
      this.sailsService.vacationRequest.postVacation({uid: this.filtredUser.id, startDate: new Date(sDate), endDate: new Date(eDate), status: "new" });
    } else {
      this.sailsService.daysOffRequest.postDaysOff({uid: this.filtredUser.id, startDate: new Date(sDate), endDate: new Date(eDate), status: "new" });
    }
    

    this.toastr.success('Vacation request was sent successfully!', toastrOptions);

    function isCrossingIntervals(dateIntervals) {
      if(dateIntervals.length === 0) return false;

      let result = dateIntervals.filter(function(item) {
        if  (sDate <= new Date(item.endDate).getTime() && eDate >= new Date(item.startDate).getTime()) {
          return true;
        }
      });

      return !!result.length;

    }
  }

  changeVacationState(state) {
    this.vacationState = state;
  }

  isVacationState(state) {
    return this.vacationState === state;
  }

  calcDaysCalc() {
    this.$timeout(()=> this.vacationDays = this.moment().isoWeekdayCalc(this.$scope.startDate, this.$scope.endDate, [1, 2, 3, 4, 5]));
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



/*

export default class VvController {
  constructor (firebaseService, userList, moment) {
    'ngInject';
    //let today = new Date();
    //today = today.setHours(0,0,0,0);
    //this.toda = today;
    this.oneThing = userList[0];
    this.awesomeThings = userList;
    this.userName = [];
    this.events = [];
    this.newEvent = {};
    this.calendarView = 'month';
    this.startDate = new Date();
    this.calendarDay = new Date();
    this.newEvent.startsAt = new Date(this.startDate);
    this.newEvent.endsAt = new Date(this.startDate);
    this.search = "";
  }

  _fillEvents(vacation) {
    let {startsAt, endsAt} = this.newEvent;
    startsAt = startsAt.setHours(0,0,0,0);
    endsAt = endsAt.setHours(23,59,59,0);
    angular.forEach(this.awesomeThings, (value) => {

      if ( (vacation in value.vacations) ) {
        let list = value.vacations[vacation];
        var {firstName, lastName} = value;
        angular.forEach(list, (value) => {
          var {startDate, endDate, status} = value;
          if(startDate <= endsAt && endDate >= startsAt) {
            if (value.status == "confirmed") {
              var event = 
              {
                title: firstName + ' '+ lastName,
                type: vacation === 'Vacations' ? 'info' : 'vv-dayoff',
                startsAt: new Date(startDate),
                endsAt: new Date(endDate),
                editable: false,
                deletable: false,
                incrementsBadgeTotal: true,
              };
              this.events.push(event);
            }
          }
        });
      }
    });
  }


  dateChange() {
    if(this.newEvent.endsAt < this.newEvent.startsAt) 
      this.newEvent.endsAt = this.newEvent.startsAt;
  }
  
  setDateInfo() {
    this.search = "";
    this.oneThing = null;

    this.events = [];
    this._fillEvents('DaysOff');
    this._fillEvents('Vacations');
    console.log(this.events);
  }
}
*/