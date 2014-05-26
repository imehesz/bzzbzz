angular.module('webApp')
.controller('tweetsController', function ($scope, data) {
  $scope.tweets = data.tweets;
});
