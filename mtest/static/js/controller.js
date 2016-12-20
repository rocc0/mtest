
var mTestApp = angular.module("mTestApp", ["ngCookies","ngRoute","dndLists","ui.bootstrap","ngAnimate","sticky"]);
var cookiesProvider_ref = null; 
mTestApp.config(function($compileProvider,$interpolateProvider,$routeProvider,$locationProvider,$cookiesProvider, $httpProvider){
$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
$httpProvider.defaults.xsrfCookieName = 'csrftoken';
$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $locationProvider.html5Mode(true);
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $routeProvider
    .when('/', {
      templateUrl : 'static/tmpl/nested1.html',
      controller  : 'mTestController',
      controllerAs: 'm'
    })
    .when('/i/:id', {
      templateUrl : 'static/tmpl/nested2.html',
      controller  : 'mTestController_DB',
      controllerAs: 'm',

    })
});


//----------------------------------------------------------------------------------------------------------
//---------------------------------------------COTROLLER WITH LOCAL ----------------------------------------
//----------------------------------------------------------------------------------------------------------

mTestApp.controller("mTestController",function($scope, $http, $cookies, 
                                                $location, LS, SubmitData, MathData, ModalWin, toPdf) {
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//----------------------------------------------------------------------------------------------------------
//---------------------------------------------DATA---------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

var m = this;
this.value = LS.getData();
this.data = angular.fromJson(this.value);
$scope.disableSticking = false;
this.num = MathData.getNum(this.data)
$scope.models = {selected: null,
                  templates: [
                    {type: "item", id: 3, name: "Додати дію"},
                    {type: "itemplus",id: 3, columns: [[],], name: "Додати розширену дію"},
                    {type: "container",id: this.num+1, columns: [[],], name: "Додати зобов’язання"},
                  ],
                  dropzones: this.data
                };
setInterval(function(){
    var lsData = angular.toJson($scope.models.dropzones)
    LS.setData(lsData);
}, 1000);


$http({ method: 'GET',url: '/json/posady/prof_name'}).then(function successCallback(response) {
                      $scope.posady = response.data;
                    });
$http({ method: 'GET',url: '/json/dii/dia_name'}).then(function successCallback(response) {
                      $scope.dii = response.data;
                    });
$http({ method: 'GET',url: '/json/zob/zob_name'}).then(function successCallback(response) {
                      $scope.zobovyazannya = response.data;
                    });


this.mdata = function() {
    return angular.toJson($scope.models.dropzones);
};


$scope.getUrlData = SubmitData.getDataUrl;
this.saveForSend = function($event) {
  $event.preventDefault
  SubmitData.EmailDataToDB(this.mdata(), $cookies.csrftoken)
};

$scope.sendEmail = function($event) {
  $event.preventDefault
  return SubmitData.sendEmail($scope.eauthor, $scope.eemail, $scope.eemailfor, $cookies.csrftoken, 
    $scope.getUrlData())
};



//---------------------------------------------SUM----------------------------------------------------------

this.Sum = function(id) {
  return MathData.mathSum($scope.models.dropzones['1'],id)
};
this.totalSum = function(){
  return MathData.totalSum($scope.models.dropzones['1'][0]['ki'],this.Sum)
};


//---------------------------------------------MODAL--------------------------------------------------------
$scope.openModal = function(size, template, controller) {
  return ModalWin.openModal(size, template, controller)
};

var data = toPdf.saveAsHtml($scope.models.dropzones['1'],this.Sum(),this.totalSum())
var blob = new Blob([ "\ufeff", data ], { type : 'text/html' });
this.saveToPdf = (window.URL || window.webkitURL).createObjectURL( blob );

  
});
//----------------------------------------------------------------------------------------------------------
//---------------------------------------------COTROLLER WITH DB -------------------------------------------
//----------------------------------------------------------------------------------------------------------

mTestApp.controller("mTestController_DB", function($scope, $timeout,$sce, $http, $cookies, $location, DB_data,
                                                      LS, SubmitData, MathData, ModalWin, toPdf) {
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//----------------------------------------------------------------------------------------------------------
//---------------------------------------------DATA---------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

SubmitData.getModelsData().then(function(response){
              var val = angular.fromJson(response.data)
              this.num = MathData.getNum(val)
              $scope.modelsdb = {
              selected: null,
              templates: [
                  {type: "item", id: 3, name: "Додати дію"},
                  {type: "itemplus",id: 3, columns: [[],], name: "Додати розширену дію"},
                  {type: "container",id: this.num+1, columns: [[],], name: "Додати зобов’язання"},
              ],
              dropzones: val};          
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

this.mdata = function() {
    return angular.toJson($scope.modelsdb.dropzones);
}

this.submitData = function($event) {
  $event.preventDefault
  SubmitData.saveDataToDB(this.mdata(), $cookies.csrftoken)
};

//---------------------------------------------SUM----------------------------------------------------------

$scope.SumDb = function(id) {
  return MathData.mathSum($scope.modelsdb.dropzones['1'],id)
};
$scope.totalSumDb = function(){
  return MathData.totalSum($scope.modelsdb.dropzones['1'][0]['ki'],$scope.SumDb)
};

//---------------------------------------------MODAL--------------------------------------------------------
this.openModal = function(size, template, controller) {
  return ModalWin.openModal(size, template, controller)
  };



//---------------------------------------------alert------------------------------------------------------


$scope.getClass = 'not_disabled'
$scope.getClassTwo = 'disabled'

this.setClasses = function(){
  $scope.getClass = 'disabled'
  $scope.getClassTwo = 'not_disabled'
  $timeout(function(){$scope.getClass = 'not_disabled',$scope.getClassTwo = 'disabled'},1000)
}


//---------------------------------------------PDF--------------------------------------------------------
$scope.$watch('modelsdb.dropzones', function(dropzones) {
  if (dropzones) {
      var data = toPdf.saveAsHtml($scope.modelsdb.dropzones['1'],$scope.SumDb(),$scope.totalSumDb())
      var blob = new Blob([ "\ufeff", data ], { type : 'text/html' });
      $scope.saveToPdf = (window.URL || window.webkitURL).createObjectURL( blob );
  }
});

});