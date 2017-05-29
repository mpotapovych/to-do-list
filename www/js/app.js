angular.module('todo', ['ionic'])

.run(function($http) {
  $http.defaults.headers.common.Token = '1BD0C289EAF920A5E6B369844A746830';
})

.constant('ApiEndpoint', {
    url: 'http://localhost:8100/api/'
})

.factory('API', function($http, ApiEndpoint) {

    var urlBase = ApiEndpoint.url + "Task/";

    return {
        all: function() {
           return $http.get(urlBase);
        },
        get: function(id) {
            return $http.get(urlBase + id);
        },
        save: function(data) {
            return $http.post(urlBase, data);
        },
        update: function(data) {
            return $http.put(urlBase + data.Id, data);
        },
        delete: function(id) {
            return $http.delete(urlBase + id);
        }
    }
})

.controller('apiCtrl', function($scope, API, $ionicModal, $window, $ionicPopup ) {

    $scope.online = $window.navigator.onLine;

    if(!$scope.online) {
        $ionicPopup.alert({
            title: "There is no Internet!"
        });
    }


    $scope.data = {};
    $scope.currentItem = null;

    $scope.loadData = function() {
        API.all()
            .success(function(data) {
                $scope.data = data;
            });
    }

    $scope.deleteItem = function(id) {

        var flag = confirm("Are you sure?");
        if(flag === false) {
            return;
        }

        API.delete(id)
            .success(function() {
                $scope.loadData();
            });
    }

    $scope.updateItem = function(item) {
        API.update(item)
            .success(function() {
                $scope.loadData();
            });
    }

    $scope.newItem = function() {
        var item = {};
        item.Value = prompt('Value');
        if(item.Value) {
            $scope.createItem(item);
        }
    }

    $scope.createItem = function(item) {
        item.State = true;
        API.save(item).
            success(function() {                
                $scope.loadData();
            });
    }
})