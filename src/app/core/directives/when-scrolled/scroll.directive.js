'use strict';

export default function (app) {

    app.directive('scroll', scroll);

    function scroll ($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
              console.log(10);
                 if (this.pageYOffset >= 100) {
                     scope.boolChangeClass = true;
                 } else {
                     scope.boolChangeClass = false;
                 }
                scope.$apply();
            });
        };
    }
}