import { find } from 'lodash';

export default class VvController {
  constructor ($scope, $timeout, firebaseService, userData, $uibModal, moment, groups, status, toastr, user, $log, sailsService) {
    'ngInject';
    
    this.firebaseService = firebaseService;
    this.sailsService = sailsService;
    this.toastr = toastr;
    this.users = userData.data;
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
    $scope.startdate = new Date();
    $scope.minStartDate = new Date($scope.startdate);
    $scope.enddate = new Date($scope.startdate);
    $scope.minEndDate = new Date($scope.startdate);
    this.user = user;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.user = user;
    this.vacationDays = this.calcDays();
    this.moment = moment;
    this.$log = $log;
    this.vacationState = 'vacations';
    this.activate($scope);


    
  }

  activate(scope) {

    scope.$watch('startdate', function() {
      if (scope.enddate <= scope.startdate) scope.enddate = new Date(scope.startdate);
      scope.minEndDate = new Date(scope.startdate);
    });

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
      this.calcEnableDays(this.$scope.startdate);
    }

    choiceButtonFilter(filter) {
      this.statusFilter.status = filter;
      this.setDateInfo();
      debugger;
    }

    openNewUserForm() {
      this.modal.open({
        templateUrl: require('!!file!../../components/userTools/modal/addNewUser/newUserForm.html'),
        controller: require('../../components/userTools/modal/addNewUser/addNewUser.controller'),
        controllerAs: 'user'
      });
    }

    userInfo(user) {
      console.log(user);
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

  calcEnableDays(vacationStartDate) {

      let user = this.filtredUser;

      let days = moment().isoWeekdayCalc(user.employmentdate, vacationStartDate,[1,2,3,4,5,6,7]) - 1;
      let employmentdate = new Date(user.employmentdate);

      user.totalDays = 0;
      user.enableDays = 0;
      user.enableCurDays = 0;
      user.enablePrevDays = 0;
      user.spendVacation = 0;
      user.spendPrevVacation = 0;
      user.enableDaysOff = 0;
      user.spendDaysOff = 0;
      user.year = Math.floor(days / 365.25);
      if(user.year != 0 
        && ((employmentdate.getMonth() == vacationStartDate.getMonth() && employmentdate.getDate() <= vacationStartDate.getDate()) 
          || (new Date(moment(employmentdate).add(1, 'month')).getMonth() == vacationStartDate.getMonth() && employmentdate.getDate() > vacationStartDate.getDate()))) 
      {
        console.log(
          this.calcDays(moment(employmentdate)
            .add(user.year, 'year')
            .add(1, 'month'), vacationStartDate), 
          this.calcDays(vacationStartDate, moment(employmentdate)
            .add(user.year, 'year')
            .add(1, 'month')))

        user.vacations
          .filter( item => item.year == (user.year - 1) && item.status != "rejected" )
          .forEach( item => user.spendPrevVacation += this.calcDays(item.startdate, item.enddate));

        user.enablePrevDays += 
          (20 - user.spendPrevVacation > this.calcDays(vacationStartDate, moment(employmentdate).add(user.year, 'year').add(1, 'month')) - 1) 
          ? this.calcDays( vacationStartDate, moment(employmentdate).add(user.year, 'year').add(1, 'month') ) - 1 
          : 20 - user.spendPrevVacation;

        user.enableDays += user.enablePrevDays;
      }
      user.vacations
      .filter( item => item.year == user.year && item.status != "rejected" )
      .forEach( item => user.spendVacation += this.calcDays(item.startdate, item.enddate));

      user.totalDays += Math.round((days % 365.25)*20/365.25);
      console.log(user.totalDays)
      user.enableCurDays += user.totalDays - user.spendVacation;
      user.enableDays += user.enableCurDays < 0 ? 0 : user.enableCurDays;
      user.daysoff.forEach( item => {
        user.spendDaysOff += this.calcDays( item.startdate, item.enddate);
      });
      user.enableDaysOff = 5 - user.spendDaysOff;
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
          vm.vacations.push({startDate: list[item].startdate, endDate: list[item].enddate, status: list[item].status, commentary: list[item].commentary});
        }
      }
    });

    if (vm.vacations && isCrossingIntervals(vm.vacations)) {
      this.toastr.error('Vacation intervals are crossing! Please, choose correct date.', toastrOptions);
      return;
    }

    let total = this.vacationState === 'vacations' ? this.filtredUser.enableDays : this.filtredUser.enableDaysOff;
    if (this.filtredUser.vacationDays > total) {
      this.toastr.error('You have exceeded the number of available days!', toastrOptions);
      return;
    }

    vacation = {
      startDate: sDate,
      endDate: eDate,
      status: 'inprogress',
      commentary: null
    };
    let {create} = this.sailsService[this.vacationState + 'Resource'];
    const {id: uid} = this.filtredUser;

    // this.firebaseService.createNewVacation(vacation, this.vacationState, this.filtredUser.uid);
    if(this.vacationState == "vacations") {
      if(this.filtredUser.enablePrevDays) {
        if(this.filtredUser.vacationDays > this.filtredUser.enablePrevDays){
          let mDate = moment(sDate).isoAddWeekdaysFromSet(this.filtredUser.enablePrevDays - 1, [1,2,3,4,5]);
          create({uid, startdate: new Date(sDate), enddate: new Date(mDate), status: "new", year: this.filtredUser.year - 1 }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions)
      },
      e => {
        this.toastr.error(e.data.data.raw.message, 'Error creating vacation', toastrOptions)
    });
          create({uid, startdate: moment(new Date(mDate)).add(1, 'day'), enddate: new Date(eDate), status: "new", year: this.filtredUser.year }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions)
      },
      e => {
        this.toastr.error(e.data.data.raw.message, 'Error creating vacation', toastrOptions)
    });
        } else {
          create({uid, startdate: new Date(sDate), enddate: new Date(eDate), status: "new", year: this.filtredUser.year - 1 }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions)
      },
      e => {
        this.toastr.error(e.data.data.raw.message, 'Error creating vacation', toastrOptions)
    });
        }
      } else {
        create({uid, startdate: new Date(sDate), enddate: new Date(eDate), status: "new", year: this.filtredUser.year }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions)
      },
      e => {
        this.toastr.error(e.data.data.raw.message, 'Error creating vacation', toastrOptions)
    });
      }
    } else {
      create({uid, startDate: new Date(sDate), endDate: new Date(eDate), status: "new", year: this.filtredUser.year }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions)
      },
      e => {
        this.toastr.error(e.data.data.raw.message, 'Error creating vacation', toastrOptions)
    });
    }
    


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
    this.$timeout(()=> {this.filtredUser.vacationDays = this.moment().isoWeekdayCalc(this.$scope.startdate, this.$scope.enddate, [1, 2, 3, 4, 5]);this.calcEnableDays(this.$scope.startdate)});

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