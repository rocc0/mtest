
var mTestApp = angular.module("mTestApp", ["ngCookies","ngRoute","dndLists","ui.bootstrap","ngAnimate","ngSanitize"]);
mTestApp.config(function($interpolateProvider,$compileProvider,$routeProvider,$locationProvider){
    $locationProvider.html5Mode(true);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $routeProvider
    .when('/', {
      templateUrl : 'static/tmpl/nested1.html',
      controller  : 'mTestController'
    })
    .when('/i/:id', {
      templateUrl : 'static/tmpl/nested2.html',
      controller  : 'mTestController_DB'
    });
});


//----------------------------------------------------------------------------------------------------------
//---------------------------------------------COTROLLER WITH LOCAL ----------------------------------------
//----------------------------------------------------------------------------------------------------------

mTestApp.controller("mTestController",function($scope, $uibModal, $log, $http, LS) {
this.value = LS.getData();
  this.latestData = function() {
    return LS.getData();
};
  $scope.update = function() {
    return LS.setData(angular.toJson($scope.models.dropzones));
};

//----------------------------------------------------------------------------------------------------------
//---------------------------------------------DATA---------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

var data = angular.fromJson(this.value);
              $scope.models = {
              selected: null,
              templates: [
                  {type: "item", id: 3, name: "Додати дію"},
                  {type: "itemplus",id: 3, columns: [[],], name: "Додати розширену дію"},
                  {type: "container",id: 3, columns: [[],], name: "Додати зобов’язання"},
              ],
              dropzones: data
            };

setInterval(function(){
  $scope.update();
  }, 3000);

$http({ method: 'GET',url: '/json/posady/prof_name'}).then(function successCallback(response) {
                      $scope.posady = response.data;
                    });
$http({ method: 'GET',url: '/json/dii/dia_name'}).then(function successCallback(response) {
                      $scope.dii = response.data;
                    });
$http({ method: 'GET',url: '/json/zob/zob_name'}).then(function successCallback(response) {
                      $scope.zobovyazannya = response.data;
                    });

//----------------------------------------------------------------------------------------------------------
//---------------------------------------------SUM----------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

$scope.Sum = function() {
        var total = [];
        var subtotal = 0;
        var rowArr = eval( $scope.models.dropzones['1']);
        for(var i = 0; i < rowArr.length; i++) { 
          var col = rowArr[i]['columns'][0];
            for(var j = 0; j < col.length; j++) {
              if (col[j]['type'] == 'itemplus'){
                var itemplus = col[j]['columns'][0];
                for(var k = 0; k < itemplus.length; k++){
                  if (itemplus[k]['subsum'] > 0){
                    subtotal += itemplus[k]['subsum']
                  } else {
                  subtotal += 0
                  }
                }
              } else {
                if (col[j]['subsum'] > 0){
                subtotal += col[j]['subsum']
              } else {
                subtotal += 0
              }
              }


              
              
            }
            total.splice(i,1,subtotal);
            subtotal *= 0;
          }
        return total
      };

// ----------------------------------------------- SUM TOTAL-----------------------------------------------

$scope.totalSum = function(){
  function add(a, b) {
    return a + b;
  };
  var ki = $scope.models.dropzones['1'][0]['ki'];
  var sum = $scope.Sum().reduce(add,0);
  if (ki > 0){
    return sum * ki;
  }
  else {
    return sum;
  }
};

//----------------------------------------------------------------------------------------------------------
//---------------------------------------------MODAL--------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

var m = this;
m.items = ['item1', 'item2', 'item3'];

  m.animationsEnabled = true;

  m.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: m.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: 'm',
      size: size,
      resolve: {
        items: function () {
          return m.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      m.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  m.openComponentModal = function () {
    var modalInstance = $uibModal.open({
      animation: m.animationsEnabled,
      component: 'modalComponent',
      resolve: {
        items: function () {
          return m.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      m.selected = selectedItem;
    }, function () {
      $log.info('modal-component dismissed at: ' + new Date());
    });
  };

  m.toggleAnimation = function () {
    m.animationsEnabled = !m.animationsEnabled;
  };
});

//----------------------------------------------------------------------------------------------------------
//---------------------------------------------COTROLLER WITH DB -------------------------------------------
//----------------------------------------------------------------------------------------------------------

mTestApp.controller("mTestController_DB", function($scope, $uibModal, $log, $http, $cookies, $location, DB_data) {
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;





$scope.localURL = $location.url().slice(3);


//----------------------------------------------------------------------------------------------------------
//---------------------------------------------DATA---------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

DB_data.getData(function(data) {
                $scope.models = {
              selected: null,
              templates: [
                  {type: "item", id: 3, name: "Додати дію"},
                  {type: "itemplus",id: 3, columns: [[],], name: "Додати розширену дію"},
                  {type: "container",id: 3, columns: [[],], name: "Додати зобов’язання"},
              ],
              dropzones: angular.fromJson(data)};          
});

//-------------------------------------------- FOR TYPEHEAD ------------------------------------------------

$http({ method: 'GET',url: '/json/posady/prof_name'}).then(function successCallback(response) {
                      $scope.posady = response.data;
                    });

$http({ method: 'GET',url: '/json/dii/dia_name'}).then(function successCallback(response) {
                      $scope.dii = response.data;
                      });

$http({ method: 'GET',url: '/json/zob/zob_name'}).then(function successCallback(response) {
                      $scope.zobovyazannya = response.data;
                      });

//----------------------------------------------------------------------------------------------------------
//---------------------------------------------SAVE TO DB --------------------------------------------------
//----------------------------------------------------------------------------------------------------------
// var url = $location.absUrl();
// $scope.submit = function ($event) {
//         $event.preventDefault();

//         var in_data = jQuery.param({'mid': $location.url().slice(3), 'content': $scope.models.dropzones,'csrfmiddlewaretoken': $cookies.csrftoken});
//         $http.post(url, in_data)
//           .success(function(out_data) {
//           }) 
//         };


//----------------------------------------------------------------------------------------------------------
//---------------------------------------------SUM----------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

$scope.Sum = function() {
        var total = [];
        var subtotal = 0;
        var rowArr = eval( $scope.models.dropzones['1']);
        for(var i = 0; i < rowArr.length; i++) { 
          var col = rowArr[i]['columns'][0];
            for(var j = 0; j < col.length; j++) {
              if (col[j]['chi'] > 0 && col[j]['vchi'] > 0 && col[j]['kri'] > 0 && col[j]['pvri'] > 0) {
                subtotal += (col[j]['chi'] * col[j]['vchi'] * col[j]['kri'] + parseInt(col[j]['pvri']));
              };
            };
            total.splice(i,1,subtotal);
            subtotal *= 0;
          }
         return total
      };

// ----------------------------------------------- SUM TOTAL-----------------------------------------------

$scope.totalSum = function(){
  function add(a, b) {
    return a + b;
  };
  var ki = $scope.models.dropzones['1'][0]['ki'];
  var sum = $scope.Sum().reduce(add,0);
  if (ki > 0){
    return sum * ki;
  }
  else {
    return sum;
  }
};

//----------------------------------------------------------------------------------------------------------
//---------------------------------------------MODAL--------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

var m = this;
m.items = ['item1', 'item2', 'item3'];

  m.animationsEnabled = true;

  m.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: m.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: 'm',
      size: size,
      resolve: {
        items: function () {
          return m.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      m.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  m.openComponentModal = function () {
    var modalInstance = $uibModal.open({
      animation: m.animationsEnabled,
      component: 'modalComponent',
      resolve: {
        items: function () {
          return m.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      m.selected = selectedItem;
    }, function () {
      $log.info('modal-component dismissed at: ' + new Date());
    });
  };

  m.toggleAnimation = function () {
    m.animationsEnabled = !m.animationsEnabled;
  };
});

//----------------------------------------------------------------------------------------------------------
//--------------------------------------------- DB FACTORY -------------------------------------------
//----------------------------------------------------------------------------------------------------------

mTestApp.factory('DB_data', function ($http, $location) {
    var data;
    return {
        getData: function (callback) {
            if(data) {
                callback(data);
            } else {
                $http.get($location.absUrl() + '/get').success(function(d) {
                    callback(data = d);
                });
            }
        }
    };
});

//----------------------------------------------------------------------------------------------------------
//--------------------------------------------- LS DATA -------------------------------------------
//----------------------------------------------------------------------------------------------------------

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

//----------------------------------------------------------------------------------------------------------
//--------------------------------------------- MODAL WINDOW -------------------------------------------
//----------------------------------------------------------------------------------------------------------

  angular.module('ui.bootstrap').controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
  var m = this;
  m.items = items;
  m.selected = {
    item: m.items[0]
  };

  m.ok = function () {
    $uibModalInstance.close(m.selected.item);
  };
});

angular.module('ui.bootstrap').component('modalComponent', {
  templateUrl: 'myModalContent.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var m = this;

    m.$onInit = function () {
      m.items = m.resolve.items;
      m.selected = {
        item: m.items[0]
      };
    };

    m.ok = function () {
      m.close({$value: m.selected.item});
    };
  }
});