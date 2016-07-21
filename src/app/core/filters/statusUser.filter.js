import { some } from 'lodash';

export default function (app) {
    app.filter('statusUserFilter', statusUserFilter);

    function statusUserFilter() {
        return function(input, filterKey, filterVal, list, date = 0) {
            var filteredInput = {};
            angular.forEach(input, function(value, key) {
                var vacationsList = (list == 'vacations' || list == 'daysoff' || list == 'workfromhome') ? value[list] : [];
                if (vacationsList.length > 0) {
                    switch (filterVal) {
                        case 'new':
                            if(some(vacationsList,(item)=>item.status=='new' && filterDate(date, item))){
                                filteredInput[key] = value
                            };
                            break;
                        case 'rejected':
                            if(some(vacationsList,(item)=>item.status == 'rejected' && filterDate(date, item))){
                                filteredInput[key] = value
                            };
                            break;
                        case 'confirmed':
                            if(some(vacationsList,(item)=>new Date(item.startdate) > new Date() && item.status == 'confirmed' && filterDate(date, item))){
                                filteredInput[key] = value
                            };
                            break;
                        case 'inprogress':
                            if(some(vacationsList,(item)=>new Date(item.startdate) < new Date() && new Date(new Date(item.enddate).setDate(new Date(item.enddate).getDate() + 1)) > new Date() && item.status == 'confirmed' && filterDate(date, item))){
                                filteredInput[key] = value
                            };
                            break;
                        case 'spent':
                            if(some(vacationsList,(item)=>new Date(new Date(item.enddate).setDate(new Date(item.enddate).getDate() + 1)) < new Date() && item.status == 'confirmed' && filterDate(date, item))){
                                filteredInput[key] = value
                            };
                            break;
                        default:
                            if(some(vacationsList,(item)=>filterDate(date, item))){
                                filteredInput[key] = value;
                            };
                    }
                }
            });
            return filteredInput;
        }
        function filterDate(date, item) {
            if(date.startdate){
                if(date.enddate ? new Date(item.startdate) <= date.enddate && new Date(item.enddate) >= date.startdate : new Date(item.enddate) >= date.startdate){
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;                    
            }
        };
    }    
}