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

  submitHandler(startdate, enddate) {

    let vm = this;
    let sDate = new Date(startdate);
    let eDate = new Date(enddate);
    let toastrOptions = {progressBar: false};
    let vacation;

/*    let listArray = [];
    vm.vacations = [];

    listArray.push(this.user['vacations']);
    listArray.push(this.user['daysoff']);

    listArray.forEach( list => {
      if (list) {
        for (let item in list) {
          if (list[item].status === 'rejected') continue;
          vm.vacations.push({startdate: list[item].startdate, enddate: list[item].enddate, status: list[item].status, commentary: list[item].commentary});
        }
      }
    });

    if (vm.vacations && isCrossingIntervals(vm.vacations)) {
      this.toastr.error('Vacation intervals are crossing! Please, choose correct date.', toastrOptions);
      return;
    }

    let total = this.vacationState === 'vacations' ? this.user.vacations.total : this.user.vacations.dayOff;
    if (this.vacationDays > total) {
      this.toastr.error('You have exceeded the number of available days!', toastrOptions);
      return;
    }
*/
    vacation = {
      startdate: sDate,
      enddate: eDate,
      status: 'new',
      uid: this.user.id
    };

      this.sailsService[this.vacationState + 'Resource'].create(vacation).$promise.then(
        r => {
          this.toastr.success('Vacation request was sent successfully!', toastrOptions)
        },
        e => {
          this.toastr.success('Error creating vacation', e, toastrOptions)
        });

    

/*    function isCrossingIntervals(dateIntervals) {
      if(dateIntervals.length === 0) return false;

      let result = dateIntervals.filter(function(item) {
        if  (sDate <= item.enddate && eDate >= item.startdate) {
          return true;
        }
      });

      return !!result.length;

    }*/
  }

  calcDays() {
    this.$timeout(()=> this.vacationDays = this.moment().isoWeekdayCalc(this.$scope.startdate, this.$scope.enddate, [1, 2, 3, 4, 5]));
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
