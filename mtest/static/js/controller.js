var mTestApp = angular.module("mTestApp", ["ngAnimate", "ngSanitize", "ngCookies", "ngRoute",
    "dndLists", "ui.bootstrap", "ngAnimate", "sticky", "ui.toggle"]);
var cookiesProvider_ref = null;
mTestApp.config(function($compileProvider, $interpolateProvider, $routeProvider, $locationProvider, $cookiesProvider, $httpProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $locationProvider.html5Mode(true);
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $routeProvider
        .when('/', {
            templateUrl: 'static/tmpl/nested1.html',
            controller: 'mTestController',
            controllerAs: 'm'
        })
        .when('/i/:id', {
            templateUrl: 'static/tmpl/nested2.html',
            controller: 'mTestController_DB',
            controllerAs: 'm',
        })
});

//----------------------------------------------------------------------------------------------------------
//---------------------------------------------COTROLLER WITH LOCAL ----------------------------------------
//----------------------------------------------------------------------------------------------------------

mTestApp.controller("mTestController", function($scope, $sce, $http, $cookies, $window,
    $location, LS, SubmitData, MathData, ModalWin, toPdf, $interval ) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //----------------------------------------------------------------------------------------------------------
    //---------------------------------------------DATA---------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------

    var m = this;
    this.value = LS.getData();
    this.data = angular.fromJson(this.value);
    $scope.disableSticking = false;
    this.num = MathData.getNum(this.data)
    $scope.allowed = { dropzone: ['container'], container: ['itemplus', 'item'], itemplus: ['item'], }
    $scope.models = {
        selected: null,
        templates: [{
            type: "container",
            id: this.num + 1,
            columns: [
                [],
            ],
            name: "Додати інф. вимогу",
        }, {
            type: "itemplus",
            id: 3,
            columns: [
                [],
            ],
            name: "Додати складову інф. вимоги",
        }, {
            type: "item",
            id: 3,
            name: "Додати дію"
        }],
        dropzones: this.data
    };
    setInterval(function() {
        var lsData = angular.toJson($scope.models.dropzones)
        LS.setData(lsData);
    }, 5000);


    $http({
        method: 'GET',
        url: '/json/posady/prof_name'
    }).then(function successCallback(response) {
        $scope.posady = response.data;
    });
    $http({
        method: 'GET',
        url: '/json/dii/dia_name'
    }).then(function successCallback(response) {
        $scope.dii = response.data;
    });
    $http({
        method: 'GET',
        url: '/json/zob/zob_name'
    }).then(function successCallback(response) {
        $scope.zobovyazannya = response.data;
    });
    $http({
        method: 'GET',
        url: '/static/1.json'
    }).then(function successCallback(response) {
         $scope.questions = response.data;
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
        return SubmitData.sendEmail($scope.eauthor, $scope.eemail, $scope.eemailfor, $cookies.csrftoken, $scope.getUrlData())
    };

    $scope.sendEmailCorrupt = function($event) {
        $event.preventDefault
        return SubmitData.sendEmailCorr('M-TEST Corruption', 'mtest@clc.com.ua', 'vk@clc.com.ua', $cookies.csrftoken, toPdf.corruptEmail($scope.formData))
    };
    $scope.effectPopover = $sce.trustAsHtml('Критично – реалізація корупційного ризику призведе до зупинки діяльності <br> Суттєво - реалізація корупційного ризику призведе до суттєвих витрат грошей та/або часу співставних з розміром щомісячного прибутку');

    var trusted = {};
    $scope.getPopoverContent = function(content) {
        return trusted[content] || (trusted[content] = $sce.trustAsHtml(content));
    }

 //--------------------------------------------- ADD-REMOVE ROW ---------------------------------------------
   $scope.addRow = function(item,text){
    var quest = {
        text: text,
        "yesno": [{"name": "Так", "value": "yes"}, {"name": "Ні", "value": "no"}],
        "remove": "block"
    }

    item.push(quest);
    };

    $scope.removeRow = function(item, index){
        item.splice(index, 1);
   };
    $scope.deleteTrash = function(where, stndrt, real) {

        return where.slice(stndrt, real)
    }
    //---------------------------------------------SUM----------------------------------------------------------

    this.Sum = function(id) {
        return MathData.mathSum($scope.models.dropzones['1'], id)
    };
    this.totalSum = function() {
        return MathData.totalSum($scope.models.dropzones['1'][0]['ki'], this.Sum)
    };

    $scope.corr_sum = function(data){
        var total = 0;
        for (var k in data){
            total += Number(data[k])
        }
        return total;
    }
    $scope.addToSlider = function(res, eft){
        if (res == 1 && eft == 1) {
            return 1
        } else if (res == 1 && eft > 2){
            return 100
        } else {
            return 0
        }

    }
    $scope.getLength = function(obj) {
        if (obj != null) {
            return obj.length
        } else {
            setTimeout($scope.getLength, 300);
        }

    }
    //---------------------------------------------MODAL--------------------------------------------------------

    $scope.openModal = function(size, template, controller, scope) {
        return ModalWin.openModal(size, template, controller, $scope)
    };

    $interval(function() {
        var a = document.getElementById('report').innerHTML;
        var blob = new Blob(["\ufeff", a], {
            type: 'text/html'
        });
        $scope.saveToPdf = (window.URL || window.webkitURL).createObjectURL(blob);
    }, 1000);


    $scope.hideCritical = function(val) {
        if (val >= 100) {
            return "block"
        } else {
            return "none"
        }
    }

    $scope.hideQuestion = function(dep, val) {
        if (dep == 1 && val == 0) {
            return "none"
        } else if (dep == 1 && val == 1) {
            return "block"
        } else {
            return "block"
        }
    }
    $scope.payContent = $sce.trustAsHtml('Оплата – зазвичай середня  вартість людино-години роботи персоналу, який\
     виконує дії необхідні для  виконання ІВ.<br>\
  За бажанням можна використовувати  заробітну плату однієї години відповідного Спеціаліста або Керівника. <br>\
  Для ФОПів  це може бути  розрахунок вартості  людино-години на основі річного обсягу реалізації сектору (детальніше див.  Посібник з М-Тесту).<br>\
  В віконце  оплата вводиться  за місяць і перераховується автоматично в оплату за годину.');


    //---------------------------------------------CORR_BAR--------------------------------------------------------
    $scope.corr_bar = function(total, length) {
    var a = ''
    if ( total > length/2){
        a = 'danger'
        $scope.barText = "Критична корупційна складова!";
    } else {
        $scope.barText = "Кількість корупційних ризиків:" + total;
        a = 'success'
    }
    return a
  };

    $scope.valueToText = function (val, type) {
        if (type == "yn") {
            if (val == 1 || val == "Yes"){
                return "Так"
            } else if (val == 0 || val == "No"){
                return "Ні"
            } else if (val == "idk"){
                return "Незнаю"
            } else {
                return "Не заповнено!"
            }
        } else {
            if (val == 1){
                return "Суттєво"
            } else if (val == 0){
                return "Несуттєво"
            } else if (val == 100){
                return "Критично"
            } else {
                return "Не заповнено!"
            }
        }
    }

    //---------------------------------------------RESET--------------------------------------------------------
    $scope.reset = function() {
        $scope.models.dropzones = angular.copy({
   "1":[
      {
         "type":"container",
         "id":3,
         "columns":[
            [
               {
                  "type":"itemplus",
                  "id":3,
                  "columns":[
                     [
                        {
                           "type":"item",
                           "id":3,
                           "name":"Додати дію",
                           "subsum":null,
                           "vchi":null
                        },
                        {
                           "type":"item",
                           "id":6,
                           "name":"Додати дію",
                           "subsum":null
                        }
                     ]
                  ],
                  "name":"Додати розширену дію"
               }
            ]
         ],
         "name":"Додати зобов’язання"
      },
      {
         "type":"container",
         "id":null,
         "columns":[
            [
               {
                  "type":"itemplus",
                  "id":4,
                  "columns":[
                     [
                        {
                           "type":"item",
                           "id":3,
                           "name":"Додати дію",
                           "subsum":null
                        },
                        {
                           "type":"item",
                           "id":4,
                           "name":"Додати дію",
                           "subsum":null
                        }
                     ]
                  ],
                  "name":"Додати складову інф. вимоги"
               }
            ]
         ],
         "name":"Додати інф. вимогу"
      }
   ]
});
    }
    
});

//----------------------------------------------------------------------------------------------------------
//---------------------------------------------COTROLLER WITH DB -------------------------------------------
//----------------------------------------------------------------------------------------------------------

mTestApp.controller("mTestController_DB", function($scope, $timeout, $sce, $http, $cookies, $location, DB_data,
    $window, LS, SubmitData, MathData, ModalWin, toPdf) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    //----------------------------------------------------------------------------------------------------------
    //---------------------------------------------DATA---------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------

    SubmitData.getModelsData().then(function(response) {
        var val = angular.fromJson(response.data)
        this.num = MathData.getNum(val)
        $scope.modelsdb = {
            selected: null,
            templates: [{
                type: "container",
                id: this.num + 1,
                columns: [
                    [],
                ],
                name: "Додати інф. вимогу"
            }, {
                type: "itemplus",
                id: 3,
                columns: [
                    [],
                ],
                name: "Додати складову інф. вимоги"
            }, {
                type: "item",
                id: 3,
                name: "Додати дію"
            }],
            dropzones: val
        };
    });

    //-------------------------------------------- FOR TYPEHEAD ------------------------------------------------

    $http({
        method: 'GET',
        url: '/json/posady/prof_name'
    }).then(function successCallback(response) {
        $scope.posady = response.data;
    });

    $http({
        method: 'GET',
        url: '/json/dii/dia_name'
    }).then(function successCallback(response) {
        $scope.dii = response.data;
    });

    $http({
        method: 'GET',
        url: '/json/zob/zob_name'
    }).then(function successCallback(response) {
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
        return MathData.mathSum($scope.modelsdb.dropzones['1'], id)
    };
    $scope.totalSumDb = function() {
        return MathData.totalSum($scope.modelsdb.dropzones['1'][0]['ki'], $scope.SumDb)
    };

    //---------------------------------------------MODAL--------------------------------------------------------
    this.openModal = function(size, template, controller) {
        return ModalWin.openModal(size, template, controller)
    };



    //---------------------------------------------alert------------------------------------------------------


    $scope.getClass = 'not_disabled'
    $scope.getClassTwo = 'disabled'

    this.setClasses = function() {
        $scope.getClass = 'disabled'
        $scope.getClassTwo = 'not_disabled'
        $timeout(function() {
            $scope.getClass = 'not_disabled', $scope.getClassTwo = 'disabled'
        }, 1000)
    }


    //---------------------------------------------PDF--------------------------------------------------------
    //$scope.$watch('modelsdb.dropzones', function(dropzones) {
    //    if (dropzones) {
    //        var data = toPdf.saveAsHtml($scope.modelsdb.dropzones['1'], $scope.SumDb(), $scope.totalSumDb())
    //        var blob = new Blob(["\ufeff", data], {
    //            type: 'text/html'
    //        });
    //        $scope.saveToPdf = (window.URL || window.webkitURL).createObjectURL(blob);
    //    }
    //});


});