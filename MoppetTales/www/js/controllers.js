angular.module('starter.controllers', ['ngOpenFB'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, ngFB, $ionicLoading, $http) {

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
  
  
  $scope.autoPlay = function() {
    //$scope.quantityResult = calculateService.calculate($scope.quantity, 10);
    
  };
  
  $scope.doRefresh = function() {
    $scope.show($ionicLoading);
    $http.get('/browse')
     .success(function(newItems) {
       $scope.items = newItems;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
       $scope.hide($ionicLoading);  
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
.controller('StoryCtrl', function($scope, $stateParams, $sce, $http, $ionicLoading, $ionicSlideBoxDelegate, $ImageCacheFactory) {
    
    //$scope.trustSrc = function(src) {
    //    return $sce.trustAsResourceUrl(src);
    //};
    
    // ionic Loading spinner show
    $scope.show($ionicLoading);
    
    // Retrieve JSON Data from specific id
    $http.get('http://moppettales.com/api/get_post/?post_id='+$stateParams.playlistId)
       .success(function(data){
          $scope.StoryPost  = data;
          
          $scope.show($ionicLoading);
          // Cycle thru JSON and retrieve URLs and captions separetly 
          $scope.StoryPostURL = [];
          $scope.StoryPostCaption = [];
            angular.forEach(data.post.attachments, function(attachment, key) {
                angular.forEach(attachment, function(content, key) {
                        if(key=="url") {
                            
                            $scope.StoryPostURL.push(content);
                            //console.log(key + ': ' + content);
                        }     
                        if (key=="caption") {
                            // Push captions(text) content to array
                            $scope.StoryPostCaption.push(content);
                            //console.log(key + ': ' + content);
                        }
                        
                });
            });
         
         // Image Caching big images
         $scope.show($ionicLoading);
         $ImageCacheFactory.Cache($scope.StoryPostURL).then(function(){
            console.log("Images done loading!");
            $scope.hide($ionicLoading);  
         },function(failed){
            console.log("An image filed: "+failed);
         });
          
          // Update the GUI ionic Slidebox
          $ionicSlideBoxDelegate.update();
        })    
    .finally(function($ionicLoading) { 
       // On both cases hide the loading
          $scope.hide($ionicLoading);  
    }); 
});
