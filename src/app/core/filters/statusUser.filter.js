import { some } from 'lodash';

export default function (app) {
    app.filter('statusUserFilter', statusUserFilter);

    function statusUserFilter() {
        return function(input, filterKey, filterVal, list) {
            var filteredInput = {};
            angular.forEach(input, function(value, key) {
                var vacationsList = value[list];
                if (vacationsList.length > 0) {
                    switch (filterVal) {
                        case 'new':
                            if(some(vacationsList,function(item){return item.status=='new'})){
                                filteredInput[key] = value
                            };
                        case 'rejected':
                            if(some(vacationsList,function(item){return item.status == 'rejected'})){
                                filteredInput[key] = value
                            };
                        case 'confirmed':
                            if(some(vacationsList,function(item){new Date(item.startdate) > new Date() && item.status == 'confirmed'})){
                                filteredInput[key] = value
                            };
                        case 'inprogress':
                            if(some(vacationsList,function(item){new Date(item.startdate) < new Date() && new Date(item.enddate) > new Date() && item.status == 'confirmed'})){
                                filteredInput[key] = value
                            };
                        case 'spent':
                            if(some(vacationsList,function(item){new Date(item.enddate) < new Date() && item.status == 'confirmed'})){
                                filteredInput[key] = value
                            };
                        default:
                            return filteredInput[key] = value;
                    }
                }
            });
            return filteredInput;
        }
    }    
}