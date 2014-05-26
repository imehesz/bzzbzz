angular.module('bzzbzz')
.controller('tweetsController', function ($scope, data) {
  $scope.tweets = data.tweets;
});
