export default function (app) {
    app.filter('strictFilter', strictFilter);

    function strictFilter() {
        return (input, data, key) => 
            data[key] ? input.filter( item => item[key] === data[key]) : input
    } 

}