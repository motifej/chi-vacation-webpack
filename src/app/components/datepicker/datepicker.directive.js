import datepickerTpl from './datepicker.html';

export default function DatepickerDirective() {
    'ngInject';

    let directive = {
        scope: {
            curDate: '=ngModel',
            minDate: '=',
            maxDate2: '=',
            calcDays: '&',
            isShowAllDays: '=',
            isDisableDate: '=',
            holidays: '@',
            changeMonth: '&'
        },
        restrict: 'E',
        link: link,
        templateUrl: datepickerTpl
    };

    return directive;

    function link(scope, element, attrs) {
        scope.name = attrs.name;
        scope.placeholder = attrs.placeholder;
        //scope.maxDate = moment().add(1, 'year').add(1, 'month');
        scope.maxDate = scope.maxDate2;

        scope.open= function() {
            scope.popup.opened = true;
        };

        scope.setDate = function(year, month, day) {
            scope.curDate = new Date(year, month, day);
        };

        scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        scope.format = scope.formats[1];
        scope.altInputFormats = ['M!/d!/yyyy'];

        scope.popup = {
            opened: false
        };

        scope.disabled = function({date, mode}) {
            let iDate = moment(date).format('YYYY-MM-DD');
            return mode === 'day' && 
                (date.getDay() === 0 || date.getDay() === 6 || 
                    (scope.holidays && ~scope.holidays.indexOf(iDate)));
        }

        scope.getDayClass = function({date, mode}) {
            if (mode === 'day') {
                let iDate = moment(date).format('YYYY-MM-DD');
                let today = new Date();
                if (date.toDateString() === today.toDateString()) 
                    return 'datepicker-today';
                if ((scope.holidays && ~scope.holidays.indexOf(iDate)) || date.getDay() === 0 || date.getDay() === 6) 
                    return 'datepicker-holidays';
            }
            return '';
        };
    }
}
