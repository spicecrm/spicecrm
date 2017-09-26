SpiceCRM.controller('FavoritesCtrl', ['$scope','FavoritesService','UserConfigService', function (_scope, _service, _userConfig) {
    angular.extend(_scope, {
        favoritesWidget:{
            name:'Favorites',
            label:'Favorites',
            closed:false,
            class:function(){
                if(_userConfig.objects.Favorites_collapsed !== "true"){
                    return 'open';
                }else{
                    return 'close';
                }
            },
            isFavorite: function () {
                _service.checkIsFavorite().then(function(response){
                    return _service.isFavorite;
                }, function () {
                    $('#Favorites').hide();
                });
            },
            toggleFavorite: function(){
                if(_service.isFavorite){
                    _service.delete_favorite();
                }else{
                    _service.set_favorite();
                }
            }
        },
        userConfigService: _userConfig,
        favoritesService: _service
    });
}]);

SpiceCRM.directive('favoritesWidget', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/Favorites/template.html',
            controller: 'FavoritesCtrl',
            replace: true,
            scope:false
        };
    }
]);

SpiceCRM.directive('favoritesItem', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/Favorites/entry.html',
            replace: true,
            scope:{
                itemData:'='
            }
        };
    }
]);