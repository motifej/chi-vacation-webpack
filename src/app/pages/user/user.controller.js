import {DAYSOFF, VACATIONS} from '../../core/constants/vacations.consts';

export default class UserController {



  constructor ($scope, $log, $timeout, sailsService, moment, toastr, user, $uibModal) {
    'ngInject';
    if (moment().weekday() === 6) $scope.startdate = new Date(moment().add(2, 'days')); else
    if (moment().weekday() === 0) $scope.startdate = new Date(moment().add(1, 'days')); else
    $scope.startdate = new Date();

    $scope.minStartDate = new Date($scope.startdate);
    $scope.enddate = new Date($scope.startdate);
    $scope.minEndDate = new Date($scope.startdate);

    this.user = user.data;
    this.DAYSOFF = DAYSOFF;
    this.VACATIONS = VACATIONS;
    this.today = new Date();
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.vacationDays = this.calcDays();
    this.toastr = toastr;
    this.moment = moment;
    this.modal = $uibModal;
    this.$log = $log;
    this.sailsService = sailsService;
    this.activate($scope);
    this.vacationState = VACATIONS;

  }

  activate(scope) {

    scope.$watch('startdate', function() {
      if (scope.enddate <= scope.startdate) scope.enddate = new Date(scope.startdate);
      scope.minEndDate = new Date(scope.startdate);
    });

  }

  calcEnableDays(vacationStartDate) {

      let days = moment().isoWeekdayCalc(this.user.employmentdate, vacationStartDate,[1,2,3,4,5,6,7]) - 1;
      let employmentdate = new Date(this.user.employmentdate);

      this.user.totalDays = 0;
      this.user.enableDays = 0;
      this.user.enableCurDays = 0;
      this.user.enablePrevDays = 0;
      this.user.spendVacation = 0;
      this.user.spendPrevVacation = 0;
      this.user.enableDaysOff = 0;
      this.user.spendDaysOff = 0;
      this.user.year = Math.floor(days / 365.25);
      if(this.user.year != 0 
        && ((employmentdate.getMonth() == vacationStartDate.getMonth() && employmentdate.getDate() <= vacationStartDate.getDate()) 
          || (new Date(moment(employmentdate).add(1, 'month')).getMonth() == vacationStartDate.getMonth() && employmentdate.getDate() > vacationStartDate.getDate()))) 
      {
        console.log(
          this.calcDays(moment(employmentdate)
            .add(this.user.year, 'year')
            .add(1, 'month'), vacationStartDate), 
          this.calcDays(vacationStartDate, moment(employmentdate)
            .add(this.user.year, 'year')
            .add(1, 'month')))

        this.user.vacations
          .filter( item => item.year == (this.user.year - 1) && item.status != "rejected" )
          .forEach( item => this.user.spendPrevVacation += this.calcDays(item.startdate, item.enddate));

        this.user.enablePrevDays += 
          (20 - this.user.spendPrevVacation > this.calcDays(vacationStartDate, moment(employmentdate).add(this.user.year, 'year').add(1, 'month')) - 1) 
          ? this.calcDays( vacationStartDate, moment(employmentdate).add(this.user.year, 'year').add(1, 'month') ) - 1 
          : 20 - this.user.spendPrevVacation;

        this.user.enableDays += this.user.enablePrevDays;
      }
      this.user.vacations
      .filter( item => item.year == this.user.year && item.status != "rejected" )
      .forEach( item => this.user.spendVacation += this.calcDays(item.startdate, item.enddate));

      this.user.totalDays += Math.round((days % 365.25)*20/365.25);
      console.log(this.user.totalDays)
      this.user.enableCurDays += this.user.totalDays - this.user.spendVacation;
      this.user.enableDays += this.user.enableCurDays < 0 ? 0 : this.user.enableCurDays;
      this.user.daysoff.forEach( item => {
        this.user.spendDaysOff += this.calcDays( item.startdate, item.enddate);
      });
      this.user.enableDaysOff = 5 - this.user.spendDaysOff;
  }

  submitHandler(startDate, endDate) {
    let vm = this;
    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let toastrOptions = {progressBar: false};
    let vacation;
    
    let listArray = [];
    vm.vacations = [];
    listArray.push(this.user['vacations']);
    listArray.push(this.user['daysoff']);



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

    let total = this.vacationState === 'vacations' ? this.user.enableDays : this.user.enableDaysOff;
    if (this.user.vacationDays > total) {
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
    const {id: uid} = this.user;

    // this.firebaseService.createNewVacation(vacation, this.vacationState, this.user.uid);
    if(this.vacationState == "vacations") {
      if(this.user.enablePrevDays) {
        if(this.user.vacationDays > this.user.enablePrevDays){
          let mDate = moment(sDate).isoAddWeekdaysFromSet(this.user.enablePrevDays - 1, [1,2,3,4,5]);
          create({uid, startdate: new Date(sDate), enddate: new Date(mDate), status: "new", year: this.user.year - 1 }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions);
        this.calcEnableDays(this.$scope.startdate);
      },
      e => {
        this.toastr.error(e.data.data.raw.message, 'Error creating vacation', toastrOptions)
    });
          create({uid, startdate: moment(new Date(mDate)).add(1, 'day'), enddate: new Date(eDate), status: "new", year: this.user.year }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions);
        this.calcEnableDays(this.$scope.startdate);
      },
      e => {
        this.toastr.error(e.data.data.raw.message, 'Error creating vacation', toastrOptions)
    });
        } else {
          create({uid, startdate: new Date(sDate), enddate: new Date(eDate), status: "new", year: this.user.year - 1 }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions);
        this.calcEnableDays(this.$scope.startdate);
      },
      e => {
        this.toastr.error(e.data.data.raw.message, 'Error creating vacation', toastrOptions)
    });
        }
      } else {
        create({uid, startdate: new Date(sDate), enddate: new Date(eDate), status: "new", year: this.user.year }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions);
        this.calcEnableDays(this.$scope.startdate);
      },
      e => {
        this.toastr.error(e.data.data.raw.message, 'Error creating vacation', toastrOptions)
    });
      }
    } else {
      create({uid, startdate: new Date(sDate), enddate: new Date(eDate), status: "new", year: this.user.year }).$promise.then(
      r => {
        this.toastr.success('Vacation request was sent successfully!', toastrOptions);
        this.calcEnableDays(this.$scope.startdate);
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

  calcDaysCalc() {
    this.$timeout(()=> {this.user.vacationDays = this.moment().isoWeekdayCalc(this.$scope.startdate, this.$scope.enddate, [1, 2, 3, 4, 5]);this.calcEnableDays(this.$scope.startdate)});

  }

  calcDays(startDate, endDate) {
    return moment().isoWeekdayCalc(startDate, endDate, [1, 2, 3, 4, 5])
  }

  changeVacationState(state) {
    this.vacationState = state;
  }

  isVacationState(state) {
    return this.vacationState === state;
  }

  deleteVacation(item) {
    this.sailsService[this.vacationState + 'Resource'].delete( {uid: item.uid, id: item.id} );
  }
}
