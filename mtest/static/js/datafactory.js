//----------------------------------------------------------------------------------------------------------
//--------------------------------------------- LS DATA -------------------------------------------
//----------------------------------------------------------------------------------------------------------
var mTestApp = angular.module('mTestApp');
mTestApp.factory("LS", function($window, $rootScope, $location, $http) {
  angular.element($window).on('storage', function(event) {
    if (event.key === 'my-storage') {
      $rootScope.$apply();
    }
  });
  return {
    setData: function(val) {
      $window.localStorage && $window.localStorage.setItem('my-storage', val);
      return this;
    },
    getData: function() {
      if ($window.localStorage && $window.localStorage.getItem('my-storage') == null) {
        return {'1':[
        {"type":"container","id":1,"columns":[[{"type":"item","id":1,"name":"Процедура"},
        {"type":"item","id":2,"name":"Процедура"},
        {"type":"item","id":3,"name":"Процедура"},
        {"type":"item","id":4,"name":"Процедура"}]],"name":"Суб'єкт"},
        {"type":"container","id":2,"columns":[[{"type":"item","id":5,"name":"Процедура"},
        {"type":"item","id":6,"name":"Процедура"},
        {"type":"item","id":7,"name":"Процедура"},
        {"type":"item","id":8,"name":"Процедура"}]],"name":"Суб'єкт"}]};
      }
      else {
        return $window.localStorage && $window.localStorage.getItem('my-storage');
      }
    }
  };
});