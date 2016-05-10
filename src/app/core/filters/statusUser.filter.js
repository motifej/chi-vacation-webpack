import { some } from 'lodash';

export default function (app) {
    app.filter('statusUserFilter', statusUserFilter);

    function statusUserFilter() {
        return function(input, filterKey, filterVal, list, date = 0) {
            var filteredInput = {};
            angular.forEach(input, function(value, key) {
                var vacationsList = (list == 'vacations' || list == 'daysoff') ? value[list] : [];
                if (vacationsList.length > 0) {
                    if(date.startdate){
                        if(!some(vacationsList, item => item.status == filterVal && ((date.enddate) ? !(new Date(item.startdate) > date.enddate) && new Date(item.enddate) > date.startdate : new Date(item.enddate) > date.startdate))){
                            return filteredInput;
                        }
                    }
                    switch (filterVal) {
                        case 'new':
                            if(some(vacationsList,(item)=>item.status=='new')){
                                filteredInput[key] = value
                            };
                            break;
                        case 'rejected':
                            if(some(vacationsList,(item)=>item.status == 'rejected')){
                                filteredInput[key] = value
                            };
                            break;
                        case 'confirmed':
                            if(some(vacationsList,(item)=>new Date(item.startdate) > new Date() && item.status == 'confirmed')){
                                filteredInput[key] = value
                            };
                            break;
                        case 'inprogress':
                            if(some(vacationsList,(item)=>new Date(item.startdate) < new Date() && new Date(item.enddate) > new Date() && item.status == 'confirmed')){
                                filteredInput[key] = value
                            };
                            break;
                        case 'spent':
                            if(some(vacationsList,(item)=>new Date(item.enddate) < new Date() && item.status == 'confirmed')){
                                filteredInput[key] = value
                            };
                            break;
                        default:
                            return filteredInput[key] = value;
                    }
                }
            });
            return filteredInput;
        }
    }    
}