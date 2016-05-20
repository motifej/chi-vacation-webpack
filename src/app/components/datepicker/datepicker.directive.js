import datepickerTpl from './datepicker.html';

export default function DatepickerDirective() {
    'ngInject';

    let directive = {
        scope: {
            curDate: '=ngModel',
            minDate: '=',
            calcDays: '&',
            isShowAllDays: '=',
            isDisableDate: '='
        },
        restrict: 'E',
        link: link,
        templateUrl: datepickerTpl
    };

    return directive;

    function link(scope, element, attrs) {
        //scope.test = function () {alert('test')};
        scope.name = attrs.name;

        scope.maxDate = new Date(2030, 5, 22);

        // scope.disabled = function() {
        //     var data = new Date();
        //     var date = data.date,
        //       mode = data.mode;
        //     return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        // }

        scope.open= function() {
            scope.popup.opened = true;
        };

        scope.setDate = function(year, month, day) {
            scope.curDate = new Date(year, month, day);
        };

        scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        scope.format = scope.formats[0];
        scope.altInputFormats = ['M!/d!/yyyy'];

        scope.popup = {
            opened: false
        };

        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        let afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        scope.events =
        [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
        ];

        scope.disabled = function(data) {
            let date = data.date,
            mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < scope.events.length; i++) {
                    var currentDay = new Date(scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return scope.events[i].status;
                    }
                }
            }

            return '';
        };
    }
}
