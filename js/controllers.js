var app = angular.module('myApp', []);
var  queryParam ={};

app.controller('customersCtrl', function($scope, $http, $q) {

  Parse.$ = jQuery;
   Parse.initialize("mvLeLP1wbRJW24ESjaUEgPueWHpMLNZNvwLnTTJW",  //"applicationId":
                   "NqwHrO9MjC9uLgqu4zNIi6u9TC19GVRbMmNxXTag");  //JavaScript Key

//keyWord for the first button
    $scope.showList = function() {
             document.getElementById('keywordList').style.position="absolute";
       document.getElementById('keywordList').style.display="inline";
       document.getElementById('keywordList').style.zIndex=999;
    }
    $scope.selectKeyword = function(x) {
        document.getElementById('myFilter').value=x;
        document.getElementById('keywordList').style.display="none";
    }
    // end of keyWord

   var Article = Parse.Object.extend('coursesParse');
      var myLat = -37.875773;
      var myLng = 145.087829;


 //Refine query by selected options
     $scope.master = {};
      $scope.update = function(user) {
        //$scope.master = angular.copy(user);
         //alert($scope.names[0].name);
         //$scope.names[0].name = "test";

          var queryRefine = new Parse.Query(Article);
          if (user.keyWord){
             queryRefine.equalTo('keyword', document.getElementById('myFilter').value);
          }
          if (user.degName){
            queryRefine.equalTo('name', user.degName);
          }
          if (user.degreeType){
            queryRefine.equalTo('degreeType', user.degreeType);
          }
          var geoPoint = ({latitude: myLat, longitude: myLng});
          queryRefine.near("coords", geoPoint);
          queryRefine.limit(2);

        queryRefine.find().then(function (data) {
           var courseRefineParsed = [];
           for (var i = 0; i < data.length; i++) {
               courseRefineParsed[i] = {
                 "name": data[i].get('name'), 
                 "description": data[i].get('description'), 
                 "length": data[i].get('length'), 
                 "place": data[i].get('place'), 
                 "comment": data[i].get('comments'), 
                 "image": data[i].get('images'),
                 "webLink": data[i].get('weblink'),
                 "xCor": data[i].get('coords').latitude,
                 "yCor": data[i].get('coords').longitude
                };
            }
                      for(var i=0;i<courseRefineParsed.length;i++){
                       var marker = new google.maps.Marker({
                         position: new google.maps.LatLng(courseRefineParsed[i]['xCor'], courseRefineParsed[i]['yCor']),
                         //icon: "img/icon.png",
                         map: map,
                         title: 'Hello World!'
                       });
                      }
              ArticleDfd.resolve(data);
              $http.get("").success(function (response) {$scope.names = courseRefineParsed;});

        });


      };


      if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(getPosition);
           } else {
                    alert("Please allow using your location to see the courses around you!");
      }
      function getPosition(position) {
                      myLat = position.coords.latitude;
                      myLng = position.coords.longitude; 
                    var mapOptions = {
                     center: new google.maps.LatLng(myLat, myLng),
                     zoom: 12,
                     mapTypeId: google.maps.MapTypeId.ROADMAP
                     }
                       map = new google.maps.Map(document.getElementById('map'), mapOptions);
      }


//start page query
         var ArticleDfd = $q.defer();
         var queryInitial = new Parse.Query(Article);
         //queryInitial.equalTo('name', 'Electrical Supply');
          var geoPoint = ({latitude: myLat, longitude: myLng});
          queryInitial.near("coords", geoPoint);
          queryInitial.limit(1);

        queryInitial.find().then(function (data) {
           var courseParsed = [];
           for (var i = 0; i < data.length; i++) {
               courseParsed[i] = {
                 "name": data[i].get('name'), 
                 "description": data[i].get('description'), 
                 "length": data[i].get('length'), 
                 "place": data[i].get('place'), 
                 "comment": data[i].get('comments'), 
                 "image": data[i].get('images'),
                 "webLink": data[i].get('weblink'),
                 "xCor": data[i].get('coords').latitude,
                 "yCor": data[i].get('coords').longitude
                };
              //for (var prop in courseParsed[i]) {alert(prop + " = "+ courseParsed[i][prop])};
            }
                      for(var i=0;i<courseParsed.length;i++){
                        //alert(courseParsed[i]['xCor'], courseParsed[i]['yCor']);
                        //alert(courseParsed[i]['xCor']);
                       var marker = new google.maps.Marker({
                         position: new google.maps.LatLng(courseParsed[i]['xCor'], courseParsed[i]['yCor']),
                         //icon: "img/icon.png",
                         map: map,
                         title: 'Hello World!'
                       });
                      }
              ArticleDfd.resolve(data);
              $http.get("").success(function (response) {$scope.names = courseParsed;});

           }, function (error) {
            ArticleDfd.reject(data);
        });
        ArticleDfd.promise
        .then(function (article) {
         $scope.currentArticle = article;
        })
       .catch(function (error) {
            //do something with the error
       });

});
