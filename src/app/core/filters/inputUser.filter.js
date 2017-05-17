export default function (app) {
    app.filter('inputUserFilter', inputUserFilter);

    function inputUserFilter() {
        return function(usersArray, input = "") {
            var splitedInput = input.toLowerCase().split(" ").filter(item => item.length >= 3);
            var fiteredUsers = [];
            splitedInput.forEach((item, index) => {
                if(usersArray.length) {
                    usersArray = usersArray.filter(user => user.firstname.toLowerCase().indexOf(item) + 1 || user.lastname.toLowerCase().indexOf(item) + 1)
                }
            })
            return splitedInput.length ? usersArray : [];
        }
    }    

}