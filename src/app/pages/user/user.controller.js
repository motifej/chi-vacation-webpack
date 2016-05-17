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

    this.user = user;
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

    this.calcEnableDays(this.$scope.startdate);
    this.calcDaysCalc();
  }

  activate(scope) {

    scope.$watch('startdate', function() {
      if (scope.enddate <= scope.startdate) scope.enddate = new Date(scope.startdate);
      scope.minEndDate = new Date(scope.startdate);
    });

  }

  calcEnableDays(vacationStartDate) {

      let user = this.initUserData(vacationStartDate, this.user);

      

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

        user.availableDays += user.availablePrevDays;
      }
      user.vacations
      .filter( item => item.year == user.year && item.status != "rejected" )
      .forEach( item => user.spendVacation += this.calcDays(item.startdate, item.enddate));

      console.log(user.totalDays)
      user.availableCurDays += user.totalDays - user.spendVacation;
      user.availableDays += user.availableCurDays < 0 ? 0 : user.availableCurDays;
      user.daysoff
      .filter( item => item.year == user.year && item.status != "rejected" )
      .forEach( item => {
        user.spendDaysOff += this.calcDays( item.startdate, item.enddate);
      });
      user.availableDaysOff = 5 - user.spendDaysOff;
      console.log(user);
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

    let total = this.vacationState === this.VACATIONS ? this.user.availableDays : this.user.availableDaysOff;
    if (this.user.vacationDays > total) {
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
    const {id: uid, year} = this.user;
    const {startdate, enddate, status} = vacation;
    const createError = ({data: data}) => this.toastr.error(data.raw.message, 'Error creating vacation', toastrOptions);
    const createSuccess = res => {
      this.toastr.success('Vacation request was sent successfully!', toastrOptions);
      if (!_.find(this.user[this.vacationState], {id:res.data.id}))
                  this.user[this.vacationState].push(res.data);
      this.calcEnableDays(this.$scope.startdate);
    }


    if(this.vacationState == "daysoff") {
      create({uid, startdate, enddate, status, year })
       .$promise.then(createSuccess, createError);
      return;
    }

    if(this.user.availablePrevDays <= 0) {
      create({uid, startdate, enddate, status, year })
       .$promise.then(createSuccess, createError);
      return;
    }

    if(this.user.vacationDays > this.user.availablePrevDays){
      let mDate = moment(sDate).isoAddWeekdaysFromSet(this.user.availablePrevDays - 1, [1,2,3,4,5]);
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
    this.sailsService[this.vacationState + 'Resource'].delete( { id: item.id} ).$promise
    .then(
      r => this.toastr.success('Vacation was deleted successfully!'),
      e => this.toastr.error(e.data.data.raw.message, 'Error deleting vacation')
    );
  }
}
