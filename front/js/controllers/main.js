angular.module('webApp')
.controller('mainController', function ($scope) {
  console.log("If we can make it here, we can make it anywhere ..."); // New York
  
  var pm = PageManager.getInstance();
  
  // Math.random() is used to overcome WebKit caching issues ...?
  pm.setPage("http://i.imgur.com/kBz1lVi.jpg?v=" + Math.random(),[
      "17,24,117,121", 
      "202,25,301,120", 
      "376,27,470,121", 
      "16,164,167,458",
      "181,163,475,286",
      "175,336,472,456"
    ]);
    
  pm.renderPage();
  
  $scope.prevPanel = function() {
    pm.prevPanel();
  }
  
  $scope.nextPanel = function() {
    pm.nextPanel();
  }
});