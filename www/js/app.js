angular.module('todo', ['ionic'])

.constant('ApiEndpoint', {
    url: 'http://localhost:8100/api/'
})

.factory('API', function($http, ApiEndpoint) {

    var urlBase = ApiEndpoint.url;

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

.controller('apiCtrl', function($scope, API, $ionicModal) {

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