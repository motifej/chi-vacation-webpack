export default class UserController {

  constructor ($scope, $log, $timeout, firebaseService, moment, toastr, user, $uibModal) {
    'ngInject';

    $scope.startDate = new Date();
    $scope.minStartDate = new Date($scope.startDate);
    $scope.endDate = new Date($scope.startDate);
    $scope.minEndDate = new Date($scope.startDate);

    this.user = user;
    this.today = new Date();
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.user = user;
    this.vacationDays = this.calcDays();
    this.toastr = toastr;
    this.moment = moment;
    this.modal = $uibModal;
    this.$log = $log;
    this.firebaseService = firebaseService;
    this.activate($scope);
    this.vacationState = 'list';

  }

  activate(scope) {

    scope.$watch('startDate', function() {
      if (scope.endDate <= scope.startDate) scope.endDate = new Date(scope.startDate);
      scope.minEndDate = new Date(scope.startDate);
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
  submitHandler(startDate, endDate) {

    let vm = this;
    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let toastrOptions = {progressBar: false};
    let vacation;
    let list = this.user.vacations.list;
    vm.vacations = [];

    if (list) {
      for (let item in list) {
        if (list[item].status === 'rejected') continue;
        vm.vacations.push({startDate: list[item].startDate, endDate: list[item].endDate, status: list[item].status, commentary: list[item].commentary});
      }
    }

    if (this.vacationDays > this.user.vacations.total/* + this.user.vacations.dayOff*/) {
      this.toastr.error('You have exceeded the number of available days!', toastrOptions);
      return;
    }

    if (list && isCrossingIntervals(vm.vacations)) {
      this.toastr.error('Vacation intervals are crossing! Please, choose correct date.', toastrOptions);
      return;
    }

    vacation = {
      startDate: sDate,
      endDate: eDate,
      status: 'inprogress',
      commentary: null
    };

    this.firebaseService.createNewVacation(vacation, this.vacationState);

    this.toastr.success('Vacation request was sent successfully!', toastrOptions);

    function isCrossingIntervals(dateIntervals) {
      if(dateIntervals.length === 0) return false;

      let result = dateIntervals.filter(function(item) {
        if  (sDate <= item.endDate && eDate >= item.startDate) {
          return true;
        }
      });

      return !!result.length;

    }
  }

  calcDays() {
    this.$timeout(()=> this.vacationDays = this.moment().isoWeekdayCalc(this.$scope.startDate, this.$scope.endDate, [1, 2, 3, 4, 5]));
  }

  changeVacationState(state) {
    this.vacationState = state;
  }

  isVacationState(state) {
    return this.vacationState === state;
  }

  deleteVacation(item) {
    this.firebaseService.removeVacation(item.id, this.vacationState);
  }
}
