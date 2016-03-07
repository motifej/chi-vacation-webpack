export default class VvController {
  constructor (firebaseService, userList) {
    'ngInject';
    let today = new Date();
    today = today.setHours(0,0,0,0);
    this.oneThing = userList[0];
    this.awesomeThings = userList;
    this.userName = [];
    this.events = [];
    this.newEvent = {};
    this.selected = "sds";
    this.calendarView = 'month';
    this.calendarDay = new Date(today);
    this.newEvent.startsAt = new Date(today); 
    this.newEvent.endsAt = new Date(today);
  }

  setDateInfo() {
    var events = this.events = [];
    var {startsAt, endsAt} = this.newEvent;
    angular.forEach(this.awesomeThings, function (value) {
      if ( ('list' in value.vacations) ) {
        let { list } = value.vacations;
        var {firstName, lastName} = value;
        angular.forEach(list, function (value) {
          var {startDate, endDate, status} = value;
          if((startDate <= endsAt && endDate >= startsAt) ||
           (endDate >= startsAt && startDate <= endsAt))  {
            if (value.status == "confirmed") {
              let typeEvent = {rejected:'important',confirmed:'info', inprogress:'warning'};
              var event = 
              {
                title: firstName + ' '+ lastName,
                type: typeEvent[status],
                startsAt: new Date(startDate),
                endsAt: new Date(endDate),
                editable: false,
                deletable: false,
                incrementsBadgeTotal: true,
                recursOn: 'year'
              };
              events.push(event);
            }
          }
        });
      }
    });
  }

}
