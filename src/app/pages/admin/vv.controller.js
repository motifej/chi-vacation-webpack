export default class VvController {
  constructor (firebaseService, userList) {
    'ngInject';
    let today = new Date();
    today = today.setHours(0,0,0,0);
    this.toda = today;
    this.oneThing = userList[0];
    this.awesomeThings = userList;
    this.userName = [];
    this.events = [];
    this.newEvent = {};
    this.calendarView = 'month';
    this.calendarDay = new Date(today);
    this.newEvent.startsAt = new Date(today); 
    this.newEvent.endsAt = new Date(today);
    this.search = "";
  }

  _fillEvents(vacation) {
    var {startsAt, endsAt} = this.newEvent;
    angular.forEach(this.awesomeThings, (value) => {

      if ( (vacation in value.vacations) ) {
        let list = value.vacations[vacation];
        var {firstName, lastName} = value;
        angular.forEach(list, (value) => {
          var {startDate, endDate, status} = value;
          if((startDate <= endsAt && endDate >= startsAt) ||
           (endDate >= startsAt && startDate <= endsAt))  {
            if (value.status == "confirmed") {
              var event = 
              {
                title: firstName + ' '+ lastName,
                type: vacation === 'Vacations' ? 'info' : 'vv-dayoff',
                startsAt: new Date(startDate),
                endsAt: new Date(endDate),
                editable: false,
                deletable: false,
                incrementsBadgeTotal: true,
                recursOn: 'year'
              };
              this.events.push(event);
            }
          }
        });
      }
    });
  }

  setDateInfo() {
    this.search = "";
    this.oneThing = null;

    this.events = [];
    this._fillEvents('DaysOff');
    this._fillEvents('Vacations');
    console.log(this.events);
  }
}
