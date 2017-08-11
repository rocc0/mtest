var mTestApp = angular.module("mTestApp", ["ngAnimate", "ngSanitize", "ngCookies", "ngRoute", "ngTagsInput",
    "dndLists", "ui.bootstrap", "ngAnimate", "sticky", "ui.toggle"]);
mTestApp.config(function($compileProvider, $interpolateProvider, $routeProvider, $locationProvider,$cookiesProvider, $httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    $locationProvider.html5Mode(true);
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    $routeProvider
        .when('/', {
            templateUrl: 'static/tmpl/nested1.html',
            controller: 'mTestController',
            controllerAs: 'm'
        })
        .when('/d/:id', {
            templateUrl: 'static/tmpl/nested2.html',
            controller: 'mTestController_DB',
            controllerAs: 'm',
        })
        .when('/e/:id', {
            templateUrl: 'static/tmpl/nested3.html',
            controller: 'mTestController_DB',
            controllerAs: 'm',
        });


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
            name: "Add inf. obligation",
        }, {
            type: "itemplus",
            id: 3,
            columns: [
                [],
            ],
            name: "Add a component of the inf. obligation",
        }, {
            type: "item",
            id: 3,
            name: "Add action"
        }],
        dropzones: this.data
    };
    setInterval(function() {
        var lsData = angular.toJson($scope.models.dropzones)
        LS.setData(lsData);
    }, 5000);

    $scope.emails = [];

    this.emails_arr = function() {
        var output = []
        for (var k =0; k < $scope.emails.length; k++){
            output.push($scope.emails[k]['text'])
        }
        return output
    }


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
    this.multiActsSave = function($event){
        $event.preventDefault
        SubmitData.multiActsSend($scope.eauthor, $scope.eemail, this.mdata(), $cookies.csrftoken, this.emails_arr())
    }
    $scope.sendEmail = function($event) {
        $event.preventDefault
        return SubmitData.sendEmail($scope.eauthor, $scope.eemail, $scope.emails_arr(), $cookies.csrftoken, $scope.getUrlData())
    };

    $scope.sendEmailCorrupt = function($event) {
        $event.preventDefault
        return SubmitData.sendEmailCorr('M-TEST Corruption', 'mtest@clc.com.ua', 'vk@clc.com.ua', $cookies.csrftoken, toPdf.corruptEmail($scope.formData))
    };
    $scope.effectPopover = $sce.trustAsHtml('Critical: the actualization of corruption risk will block of activity <br> Essential:  the actualization of corruption risk will lead to significant spending of money and / or time comparable to the size of the monthly profit');

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
     $scope.hideCritical = function(val, length) {
        if (val >= 100 || val > length/2) {
            return "block"
        } else {
            return "none"
        }
    }

    $scope.corr_bar = function(total, length) {
    var a = ''
    if ( total > length/2){
        a = 'danger'
        $scope.barText = "Corruptional impact is critical!";
    } else {
        $scope.barText = "Quantity of curruptional risks:" + total;
        a = 'success'
    }
    return a
  };

    $scope.valueToText = function (val, type) {
        if (type == "yn") {
            if (val == 1 || val == "Yes"){
                return "Yes"
            } else if (val == 0 || val == "No"){
                return "No"
            } else if (val == "idk"){
                return "Don't know"
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
        $scope.models.dropzones = angular.copy({"1":[{"type":"container","id":3,"columns":[[{"type":"itemplus","id":3,"columns":[[{"type":"item","id":3,"name":"Add action","subsum":0},{"type":"item","id":6,"name":"Add action","subsum":0}]],"name":"Add a component of the inf. obligation"}]],"name":"Add inf. obligation","contsub":0},{"type":"container","id":null,"columns":[[{"type":"itemplus","id":4,"columns":[[{"type":"item","id":3,"name":"Add action","subsum":0},{"type":"item","id":4,"name":"Add action","subsum":0}]],"name":"Add a component of the inf. obligation"}]],"name":"Add inf. obligation","contsub":0}]});
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
        this.val = angular.fromJson(response.data)
        this.num = MathData.getNum(val)
        $scope.modelsdb = {
            selected: null,
            templates: [{
                type: "container",
                id: this.num + 1,
                columns: [
                    [],
                ],
                name: "Add inf. obligation"
            }, {
                type: "itemplus",
                id: 3,
                columns: [
                    [],
                ],
                name: "Add a component of the inf. obligation"
            }, {
                type: "item",
                id: 3,
                name: "Add action"
            }],
            dropzones: this.val
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

    //-------------------------------------------- GROUP MATH ------------------------------------------------

    setTimeout(function() {
        $scope.devs_calc = function () {

        }
        var devs = $scope.modelsdb.dropzones['1'][0].executors
        var infs = $scope.modelsdb.dropzones['1']

        for(var devs_get = [];devs_get.length < infs.length; devs_get.push([]));

        for(var i = 0; i < devs.length; i++){
            let dev = devs[i]
            let dev_data;

            if(dev[2] === true) {
                $http({method: 'GET', url: dev[1]+'/get/'}).then(function successCallback(response) {
                dev_data = JSON.parse(response.data)
            })
            setTimeout(function() {
                for (var j = 0; j < dev_data['1'].length; j++) {
                    if (dev_data['1'][j]['contsub'] != 0){
                        devs_get[j].push(dev_data['1'][j]['contsub'])
                    }
                }
            }, 50)
            }

            }
        $scope.devs_get = devs_get

        }, 150);

    setTimeout(function() {
        $scope.sumDevsInfs = function(x) {
                var tmp_sum = 0;
                for (var i = 0; i < x.length; i++) {
                    tmp_sum += x[i]
                }
                return tmp_sum/x.length
            }
        }, 200);

        $scope.reloadRoute = function() {
   $window.location.reload();
}
    //-------------------------------------------- END GROUP MATH ------------------------------------------------


    //----------------------------------------------------------------------------------------------------------
    //---------------------------------------------SAVE TO DB --------------------------------------------------
    //----------------------------------------------------------------------------------------------------------

    this.mdata = function() {
        return angular.toJson($scope.modelsdb.dropzones);
    };
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

    $scope.awgSumDb = function() {
        return MathData.awgSum($scope.modelsdb.dropzones['1'], $scope.modelsdb.dropzones['1'][0]['ki'])
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
//---------------------------------------------reset------------------------------------------------------
    $scope.resetdb = function() {
        SubmitData.getModelsData().then(function(response) {
            val = angular.fromJson(response.data)
            $scope.modelsdb.dropzones = angular.copy(
                val
            )
        })
    };


});