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
    sailsService.setUser(user.data);
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
    this.vacationState = 'vacations';

  }

  activate(scope) {

    scope.$watch('startdate', function() {
      if (scope.enddate <= scope.startdate) scope.enddate = new Date(scope.startdate);
      scope.minEndDate = new Date(scope.startdate);
    });

  }

/*  openChangePasswordForm() {
    this.modal.open({
      templateUrl: require('!!file!./modal/changePassword/changePassword.html'),
      controller: require('./modal/changePassword/changePassword.controller'),
      controllerAs: 'user',
      resolve: {user: this.user}
    });
  }
*/
  submitHandler(startdate, enddate) {

    let vm = this;
    let sDate = new Date(startdate).getTime();
    let eDate = new Date(enddate).getTime();
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

    vacation = {
      startdate: sDate,
      enddate: eDate,
      status: 'new',
      commentary: null
    };

    //this.sailsService.vacationResource.createVacation(vacation, this.vacationState);

    this.toastr.success('Vacation request was sent successfully!', toastrOptions);

    function isCrossingIntervals(dateIntervals) {
      if(dateIntervals.length === 0) return false;

      let result = dateIntervals.filter(function(item) {
        if  (sDate <= item.enddate && eDate >= item.startdate) {
          return true;
        }
      });

      return !!result.length;

    }
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
    this.vacationState === 'vacations' ? 
    this.sailsService.vacationResource.deleteVacation( {uid: item.uid, id: item.id} ) :
    this.sailsService.daysoffResource.deleteDaysOff( {uid: item.uid, id: item.id} );
  }
}
