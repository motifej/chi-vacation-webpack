export default function restrictPattern($timeout) {
    'ngInject';

    return {
        restrict: 'A',
        require: 'ngModel',
        link: linkFn
    };

    function linkFn (scope, element, attrs, ngModelCtrl) {
        let regexp = null;

        if (attrs.restrictPattern) {
            regexp = new RegExp(attrs.restrictPattern, 'g');
        }

        ngModelCtrl.$parsers.push(function(val) {
            if (regexp) {
                var clean = val.replace(regexp, '');

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            }
            else {
                return val;
            }

        });

        element.bind('keypress', function(event) {
            if(event.keyCode === 32) {
                event.preventDefault();
            }
        });
    }
}