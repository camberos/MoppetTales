angular.module('starter.controllers', ['ngOpenFB'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, ngFB, $ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Show loading template
  $scope.show = function () {
    $ionicLoading.show({
       template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  
  // Hides loading template
  $scope.hide = function () {
    $ionicLoading.hide();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  //Facebook Authentication
  $scope.fbLogin = function () {
    ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $scope.closeLogin();
            } else {
                alert('Facebook login failed');
            }
        }); 
  };
})


// Initial Screen
.controller('PlaylistsCtrl', function($scope,$http, $sce, $ionicLoading) {
  
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };
  
  // Show loading
  $scope.show($ionicLoading);
  
  // Retrieves REST from CMS
  $http.get('http://moppettales.com/api/get_recent_posts/')
       .success(function(data){
          $scope.RecentPosts  = data; 
       })
       .finally(function($ionicLoading) { 
       // On both cases hide the loading
          $scope.hide($ionicLoading);  
       });
    
})

// Browse options
.controller('BrowseCtrl', function($scope,$http,$sce, $ionicLoading) {
  
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };
  
  // Show loading
  $scope.show($ionicLoading);
  
  // Retrieves REST from CMS
  $http.get('http://moppettales.com/api/get_recent_posts/')
        
       .success(function(data){
          $scope.BrowsePosts  = data;  
          $scope.hide($ionicLoading);
       })
       .finally(function($ionicLoading) { 
       // On both cases hide the loading
          $scope.hide($ionicLoading);  
       });
  })

// Show Profile from Facebook
.controller('ProfileCtrl', function ($scope, ngFB) {
    ngFB.api({
        path: '/me',
        params: {fields: 'id,name'}
    }).then(
        function (user) {
            $scope.user = user;
        },
        function (error) {
            alert('Facebook error: ' + error.error_description);
        });
})

// Retrieve single post from the CMS 
.controller('PlaylistCtrl', function($scope, $stateParams, $http, $ionicLoading) {
    
      // Show loading
    $scope.show($ionicLoading);
    $http.get('http://moppettales.com/api/get_post/?post_id='+$stateParams.playlistId)
       .success(function(data){
          $scope.SinglePost  = data;               
    })
    .finally(function($ionicLoading) { 
       // On both cases hide the loading
          $scope.hide($ionicLoading);  
    });
})

// Retrieves single story from CMS + executes page flip
.controller('StoryCtrl', function($scope, $stateParams, $http, $ionicLoading) {
    //alert("value = "+$stateParams.playlistId);
    $scope.show($ionicLoading);
    $http.get('http://moppettales.com/api/get_post/?post_id='+$stateParams.playlistId)
       .success(function(data){
          $scope.StoryPost  = data;               
    })    
    .finally(function($ionicLoading) { 
       // On both cases hide the loading
          $scope.hide($ionicLoading);  
    }); 
});
