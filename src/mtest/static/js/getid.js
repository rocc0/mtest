//----------------------------------------------------------------------------------------------------------
//--------------------------------------------- ID FACTORY -------------------------------------------
//----------------------------------------------------------------------------------------------------------
var mTestApp = angular.module('mTestApp');
mTestApp.factory('getIDs', function () {
    return {
        getItemId: function (data, enteredValue) {
                var results = [];
                angular.forEach(data, function(key, value) {
                if (key === enteredValue) {
                    results.push({serial: key, owner: 'heh'});
                }
            })
                return results;
        }
    };
});