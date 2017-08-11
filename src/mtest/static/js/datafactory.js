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
        return {"1":[{"type":"container","id":3,"columns":[[{"type":"itemplus","id":3,"columns":[[{"type":"item","id":3,"name":"Add action","subsum":0},{"type":"item","id":6,"name":"Add action","subsum":0}]],"name":"Add a component of the inf. obligation"}]],"name":"Add inf. obligation","contsub":0},{"type":"container","id":null,"columns":[[{"type":"itemplus","id":4,"columns":[[{"type":"item","id":3,"name":"Add action","subsum":0},{"type":"item","id":4,"name":"Add action","subsum":0}]],"name":"Add a component of the inf. obligation"}]],"name":"Add inf. obligation","contsub":0}]};
      }
      else {
        return $window.localStorage && $window.localStorage.getItem('my-storage');
      }
    }
  };
});

