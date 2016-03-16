import vvDropdownTpl from './vv.dropdown.html';

export default function dropdownListDirective() {
  'ngInject';
  let directive = {
      restrict: 'E',
      scope: {
        itemsList: '=',
        placeholder: '@',
        obj: '=',
        showEvents: '=',
        search: '=' 
      },
      templateUrl: vvDropdownTpl,
      link: fnLink
  };

  return directive;

  function fnLink(scope){

    scope.chooseItem = function( item ){
      
      scope.obj = item;
      var {firstName, lastName} = item;
      var fullName = scope.search = firstName + ' ' + lastName; 
      scope.showEvents = [];
      angular.forEach(item.vacations.list, function (value) {
        let {startDate, endDate, status} = value;
        let typeEvent = {rejected:'important',confirmed:'info', inprogress:'warning'};
        var event = 
        {
          title: fullName, // The title of the event 
          type: typeEvent[status], // The type of the event (determines its color). Can be important, warning, info, inverse, success or special 
          startsAt: new Date(startDate), // A javascript date object for when the event starts 
          endsAt: new Date(endDate), // Optional - a javascript date object for when the event ends 
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped. 
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable 
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view 
          recursOn: 'year' // If set the event will recur on the given period. Valid values are year or month 
        };
        scope.showEvents.push(event);
      });
    }
  }

}
