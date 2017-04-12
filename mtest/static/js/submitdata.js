var mTestApp = angular.module('mTestApp');
mTestApp.factory('SubmitData', function ($window, $http, $location) {
  var urlData = '';
    return {
        saveDataToDB: function (mdata, token) {
            var url = $location.absUrl();
            var data = $.param({ author: 'Admin', content: mdata, csrfmiddlewaretoken: token });
            $http.post(url, data)
              .success(function (data, status, headers) {
                console.log(headers('Redirect-URL'))
              })
        },
        getDataUrl: function () {
          var currentUrl = $location.absUrl() 
          if (currentUrl == 'http://192.168.96.1:8000/') {
            return 'http://192.168.96.1:8000'+urlData
          } else {
            return currentUrl
          }
            
        },
        getModelsData: function () {
            var lel = $location.absUrl();
            return $http.get(lel+'/get/')
        },
        EmailDataToDB: function (mdata, token) {
            var url = $location.absUrl();
            var data = $.param({ author: 'Admin', content: mdata, csrfmiddlewaretoken: token });
            $http.post(url, data)
              .success(function (data, status, headers) {
                console.log(headers('Redirect-URL'))
                urlData = headers('Redirect-URL')
                return urlData
            })
        },
        sendEmail: function (author, email, emailfor, token, message) {
        var data2 = $.param({ 
          csrfmiddlewaretoken: token,
          author: author, 
          emailfrom: email, 
          emailfor: emailfor,  
          message: message
           });
        $http.post("/email/send/", data2)
          .success(function (data, status, headers) {
            console.log(headers(data))
            $window.location.href = message
          })
      },
      sendEmailCorr: function (author, email, emailfor, token, message) {
        var data2 = $.param({ 
          csrfmiddlewaretoken: token,
          author: author, 
          emailfrom: email, 
          emailfor: emailfor,  
          message: message
           });
        $http.post("/email/send/", data2)
          .success(function (data, status, headers) {
            console.log(headers(data))
          })
      }
    };
});