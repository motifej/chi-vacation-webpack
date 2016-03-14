export default function (app) {
    app.filter('statusUserFilter', statusUserFilter);

    function statusUserFilter() {
        return function(input, filterKey, filterVal) {
            console.log(filterVal);
            var filteredInput = {};
            angular.forEach(input, function(value, key) {
                var vacationsList = value.vacations.list;
                angular.forEach(vacationsList, function(item) {
                   if ((item[filterKey] && item[filterKey] == filterVal)||!filterVal) {
                    filteredInput[key] = value;
                } 
                })
                
            });
            return filteredInput;
        }
    }    

}