'use strict';

export default angular.module('scroll', []).directive('scroll', scroll); 

function scroll ($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
                let body = document.getElementsByTagName('body');
                 if (this.pageYOffset >= 100) {
                     body[0].classList.add('scroll');
                 } else {
                     body[0].classList.remove('scroll');
                 }
                scope.$apply();
            });
        };
    }