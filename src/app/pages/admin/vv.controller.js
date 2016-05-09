import { find } from 'lodash';

export default class VvController {
  constructor ($scope, $timeout, userData, $uibModal, moment, groups, status, toastr, user, sailsService) {
    'ngInject';
    
    this.sailsService = sailsService;
    this.toastr = toastr;
    this.users = userData;
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
    this.vacationDays = this.calcDays();
    this.moment = moment;
    this.vacationState = 'vacations';
    this.activate($scope);
    this.dropdownFilter = "Confirmed";


    
  }

  activate(scope) {

    scope.$watch('startdate', function() {
      if (scope.enddate <= scope.startdate) scope.enddate = new Date(scope.startdate);
      scope.minEndDate = new Date(scope.startdate);
    });

  }

    calcNewVacations(group) {
     var sum = 0;
     this.users.forEach(item => {
      if(item.group == group) {
        angular.forEach(item[this.pageState], el => {
          if(el.status == this.status.NEW) {
            sum++;
          }
        })
      }
     })
     return sum; 
    }
    
    confirmVacation(user, id) {
      let vacation = find(user[this.pageState], { id: id });
        this.sailsService[this.pageState + 'Resource']
          .update({id: vacation.id}, angular.extend({}, vacation, {status: 'confirmed'})).$promise
          .then(
            () => this.toastr.success('Vacation confirmed', 'Success'),
            error => this.toastr.error(error.data.data.raw.message, 'Error confirming vacation')
          );
      }
    
    rejectVacation(user, id) {
     let vacation = find(user[this.pageState], { id: id });
      this.sailsService[this.pageState + 'Resource']
        .update({id: vacation.id}, angular.extend({}, vacation, {status: 'rejected'})).$promise
        .then(
          () => this.toastr.success('Vacation rejected', 'Success'),
          error => this.toastr.error(error.data.data.raw.message, 'Error rejecting vacation')
        );
    }

    pushAddedDays(isAdd) {
      let added = angular.copy(this.filtredUser.added);
      added[this.filtredUser.year] = (this.filtredUser.added[this.filtredUser.year] || 0) + (isAdd ? parseInt(this.filtredUser.addedDays) : 0 - parseInt(this.filtredUser.addedDays));
      this.sailsService.userResource.updateUser({id: this.filtredUser.id}, {added: added}).$promise.then(
        () => this.toastr.success('Changed added days', 'Success'),
        error => this.toastr.error(error.data.message, 'Error updating user')
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
      this.filtredUser.addedDays = 0;
      this.setDateInfo();
      this.calcEnableDays(this.$scope.startdate);
    }

    choiceButtonFilter(filter) {
      this.statusFilter.status = filter;
      this.setDateInfo();
    }

    choiceDropdownFilter(filter) {
      this.dropdownFilter = filter;
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

      let user = this.initUserData(vacationStartDate, this.filtredUser);

      

      if(user.year != 0 
        && ((user.formatedEmploymentDate.getMonth() == vacationStartDate.getMonth() && user.formatedEmploymentDate.getDate() <= vacationStartDate.getDate()) 
          || (new Date(moment(user.formatedEmploymentDate).add(1, 'month')).getMonth() == vacationStartDate.getMonth() && user.formatedEmploymentDate.getDate() > vacationStartDate.getDate()))) 
      {
        console.log(
          this.calcDays(moment(user.formatedEmploymentDate)
            .add(user.year, 'year')
            .add(1, 'month'), vacationStartDate), 
          this.calcDays(vacationStartDate, moment(user.formatedEmploymentDate)
            .add(user.year, 'year')
            .add(1, 'month')))

        user.vacations
          .filter( item => item.year == (user.year - 1) && item.status != "rejected" )
          .forEach( item => user.spendPrevVacation += this.calcDays(item.startdate, item.enddate));

        user.availablePrevDays += this.calcAvailablePrevDays(vacationStartDate, user);

        user.availableDays += user.availablePrevDays < 0 ? 0 : user.availablePrevDays;
      }
      user.vacations
      .filter( item => item.year == user.year && item.status != "rejected" )
      .forEach( item => user.spendVacation += this.calcDays(item.startdate, item.enddate));

      console.log(user.totalDays)
      user.availableCurDays += user.totalDays - user.spendVacation;
      user.availableDays += user.availableCurDays < 0 ? 0 : user.availableCurDays;
      user.daysoff.forEach( item => {
        user.spendDaysOff += this.calcDays( item.startdate, item.enddate);
      });
      user.availableDaysOff = 5 - user.spendDaysOff;
  }

  calcAvailablePrevDays (vacationStartDate, user) {
    return (
    (user.totalPrevDays - user.spendPrevVacation > this.calcDays(vacationStartDate, moment(user.formatedEmploymentDate).add(user.year, 'year').add(1, 'month')) - 1) 
    ? this.calcDays( vacationStartDate, moment(user.formatedEmploymentDate).add(user.year, 'year').add(1, 'month') ) - 1 
    : user.totalPrevDays - user.spendPrevVacation);
  }

  initUserData(vacationStartDate, user) {
    let days = moment().isoWeekdayCalc(user.employmentdate, vacationStartDate,[1,2,3,4,5,6,7]) - 1;
    user.formatedEmploymentDate = new Date(user.employmentdate);
    user.year = Math.floor(days / 365.25);
    user.addedCur = user.added[user.year] || 0;
    user.addedPrev = user.added[user.year - 1] || 0;
    user.totalDays = Math.round((days % 365.25)*20/365.25) + user.addedCur;
    user.totalPrevDays = 20 + user.addedPrev;
    user.availableDays = 0;
    user.availableCurDays = 0;
    user.availablePrevDays = 0;
    user.spendVacation = 0;
    user.spendPrevVacation = 0;
    user.availableDaysOff = 0;
    user.spendDaysOff = 0;
    return user;
  }

  submitHandler(startDate, endDate) {
    let vm = this;
    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let toastrOptions = {progressBar: false};
    /*let vacation;*/
    
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

    let total = this.vacationState === 'vacations' ? this.filtredUser.availableDays : this.filtredUser.availableDaysOff;
    if (this.filtredUser.vacationDays > total) {
      this.toastr.error('You have exceeded the number of available days!', toastrOptions);
      return;
    }

    let vacation = {
      startdate: new Date(sDate),
      enddate: new Date(eDate),
      status: 'inprogress',
      commentary: null,
      status: "new"
    };
    const {create} = this.sailsService[this.vacationState + 'Resource'];
    const {id: uid, year} = this.filtredUser;
    const {startdate, enddate, status} = vacation;
    const createError = ({data: data}) => this.toastr.error(data.raw.message, 'Error creating vacation', toastrOptions);
    const createSuccess = res => {
      this.toastr.success('Vacation request was sent successfully!', toastrOptions);
      this.calcEnableDays(this.$scope.startdate);
    }


    if(this.vacationState == "daysoff") {
      create({uid, startdate, enddate, status, year })
       .$promise.then(createSuccess, createError);
      return;
    }

    if(this.filtredUser.availablePrevDays <= 0) {
      create({uid, startdate, enddate, status, year })
       .$promise.then(createSuccess, createError);
      return;
    }

    if(this.filtredUser.vacationDays > this.filtredUser.availablePrevDays){
      let mDate = moment(sDate).isoAddWeekdaysFromSet(this.filtredUser.availablePrevDays - 1, [1,2,3,4,5]);
      create({uid, startdate, enddate: new Date(mDate), status, year: year - 1 })
       .$promise.then(createSuccess, createError);
      create({uid, startdate: moment(new Date(mDate)).add(1, 'day'), enddate, status, year })
       .$promise.then(createSuccess, createError);
    } else {
      create({uid, startdate, enddate, status, year: year - 1 })
       .$promise.then(createSuccess, createError);
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


