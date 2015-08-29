/*jshint multistr: true */
'use strict';

angular.module('observatory3App')
  .controller('ProfileCtrl', function ($scope, $stateParams, $http, Auth) {

      var loggedInUser = Auth.getCurrentUser();
      $scope.isuser = loggedInUser._id === $stateParams.id;

      $http.get('/api/users/' + $stateParams.id).success(function(user){
          $scope.user = user;
          $http.get('/api/commits/user/' + user.githubProfile).success(function(commits){
              $scope.user.commits = commits;
          });
          // get all users projects information
          $scope.projects = [];
          user.projects.forEach(function(projectId){
            $http.get("/api/projects/" + projectId).success(function(project){
              $scope.projects.push(project);
            });
          });
      });

      $scope.edittingBio = false;

      $scope.editBio = function(){
          $scope.edittingBio = !$scope.edittingBio;
      };

      $scope.saveBio = function(){
          $scope.edittingBio = false;
          $http.put('/api/users/' + $stateParams.id + '/bio', {
              'bio': $scope.user.bio
          }).success(function(){
              window.alert('Bio updated!');
          }).error(function(){
              window.alert('Could not update bio!');
          });
      };

      $scope.addTech = function(){
        if($scope.insertTechContent){
          $http.put('/api/users/' + $stateParams.id + '/addTech', {
              'tech': $scope.insertTechContent
          }).success(function(){
              $scope.user.tech.push($scope.insertTechContent);
              $scope.insertTechContent = '';
          }).error(function(){
              window.alert('Could not add tech!');
          });
        }
      };

      $scope.removeTech = function(tech){
          $http.put('/api/users/' + $stateParams.id + '/removeTech', {
              'tech': tech
          }).success(function(){
              $scope.user.tech.splice($scope.user.tech.indexOf(tech),1);
          }).error(function(){
              window.alert('Could not add tech!');
          });
      };
  })
  .directive('bio', function(){

      return {
          restrict:'E',
          template: '<div style=\'white-space:pre;\' btf-markdown=\'user.bio\'></div> \
                     <textarea ng-show=\'edittingBio\' ng-model=\'user.bio\' ></textarea>'
      };
  });
