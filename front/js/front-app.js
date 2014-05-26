var dataLoaderRunner = [
  'dataLoader',
  function (dataLoader) {
    return dataLoader();
  }
];

angular.module('webApp', ['ngRoute'])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl: "/html/main/home.html",
    controller: "mainController"
  })
  .when('/tweets', {
    templateUrl: '/html/tweets/getIndex.html',
    controller: 'tweetsController',
    resolve: {
      data: dataLoaderRunner
    }
  })
  .otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
})
.service('dataLoader', function ($location, $http) {
  return function () {
    if (preloadedData) {
      var data = preloadedData;
      preloadedData = null;
      return data;
    } else {
      return $http.get( '/api' + $location.path() ).then(function (res) {
        return res.data;
      });
    }
  };
});
