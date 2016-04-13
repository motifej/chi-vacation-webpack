export default class VvController {
  constructor (firebaseService, userList, moment) {
    'ngInject';
    //let today = new Date();
    //today = today.setHours(0,0,0,0);
    //this.toda = today;
    this.oneThing = userList[0];
    this.awesomeThings = userList;
    this.userName = [];
    this.events = [];
    this.newEvent = {};
    this.calendarView = 'month';
    this.startDate = new Date();
    this.calendarDay = new Date();
    this.newEvent.startsAt = new Date(this.startDate);
    this.newEvent.endsAt = new Date(this.startDate);
    this.search = "";
  }

  _fillEvents(vacation) {
    let {startsAt, endsAt} = this.newEvent;
    startsAt = startsAt.setHours(0,0,0,0);
    endsAt = endsAt.setHours(23,59,59,0);
    angular.forEach(this.awesomeThings, (value) => {

      if ( (vacation in value.vacations) ) {
        let list = value.vacations[vacation];
        var {firstName, lastName} = value;
        angular.forEach(list, (value) => {
          var {startDate, endDate, status} = value;
          if(startDate <= endsAt && endDate >= startsAt) {
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
              };
              this.events.push(event);
            }
          }
        });
      }
    });
  }


  dateChange() {
    if(this.newEvent.endsAt < this.newEvent.startsAt) 
      this.newEvent.endsAt = this.newEvent.startsAt;
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
