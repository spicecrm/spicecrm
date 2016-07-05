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
SpiceCRM.factory('FavoritesService', ['$http', 'UserConfigService', 'SessionStorageService', '$q', function (_http, _userConf, _storage, _q) {
    var _favoritesDataService = {
        userConfigService: _userConf,
        objects:[],
        loading:false,
        isFavorite: false,
        load:function(){
            var q = _q.defer();
            _favoritesDataService.loading = true;
            var saved = _storage.getParam('favoritesWidgetData');
            if(saved === false || saved.length === 0) {
                _http({
                    method: 'GET',
                    url: 'KREST/theme/Favorites'
                }).success(function (_response) {
                    q.resolve(_response);
                });
            }else{
                _favoritesDataService.objects = _storage.getParam('favoritesWidgetData');
                q.resolve(_favoritesDataService.objects);
            }
            var is = _favoritesDataService.checkIsFavorite();
            is.then(function(){
                _favoritesDataService.loading = false;
            });
            return q.promise;
        },
        checkIsFavorite: function () {
            var q = _q.defer();
            var module = $('form[name$="View"] input[name="module"]').val();
            var bean_id = $('form[name$="View"] input[name="record"]').val();
            var found = false;
            _favoritesDataService.objects = _storage.getParam('favoritesWidgetData');
            if(module && bean_id) {
                if(_favoritesDataService.objects.length > 0){
                    for (index = 0; index < _favoritesDataService.objects.length; ++index) {
                        if(_favoritesDataService.objects[index].item_id == bean_id){
                            found = true;
                        }
                    }
                }
                if(found) {
                    _favoritesDataService.isFavorite = found;
                    q.resolve(found);
                }else {
                    _http({
                        method: 'GET',
                        url: 'KREST/theme/Favorites/' + module + '/' + bean_id
                    }).success(function (_response) {
                        _favoritesDataService.isFavorite = _response.isFavorite;
                        found = _response.isFavorite;
                        q.resolve(found);
                    });
                }
            }else{
                q.reject();
            }
            return q.promise;
        },
        set_favorite: function () {
            var module = $('form[name$="View"] input[name="module"]').val();
            var bean_id = $('form[name$="View"] input[name="record"]').val();
            if(module && bean_id) {
                _http({
                    method: 'POST',
                    url: 'KREST/theme/Favorites/' + module + '/' + bean_id
                }).success(function (_response) {
                    _favoritesDataService.isFavorite = true;
                });
                var temp_entry = {
                    item_id : bean_id,
                    module_name : module,
                    item_summary : $('#moduleTitleDummy h2').text(),
                    item_summary_short : $('#moduleTitleDummy h2').text().substr(0,15)
                };
                _favoritesDataService.objects.push(temp_entry);
                _storage.setParam('favoritesWidgetData',_favoritesDataService.objects);
            }
        },
        delete_favorite: function(){
            var module = $('form[name$="View"] input[name="module"]').val();
            var bean_id = $('form[name$="View"] input[name="record"]').val();
            if(module && bean_id) {
                _http({
                    method: 'DELETE',
                    url: 'KREST/theme/Favorites/' + module + '/' + bean_id
                }).success(function (_response) {
                    _favoritesDataService.isFavorite = false;
                });
                for (index = 0; index < _favoritesDataService.objects.length; ++index) {
                    if(_favoritesDataService.objects[index].item_id == bean_id){
                        _favoritesDataService.objects.splice(index,1);
                    }
                }
            }
        }
    };
    _favoritesDataService.userConfigService.load();
    var res = _favoritesDataService.load();
    res.then(function (_result) {
        _favoritesDataService.objects = _result;
        _storage.setParam('favoritesWidgetData',_result);
        _favoritesDataService.loading = false;
    });
    return _favoritesDataService;
}]);

SpiceCRM.controller('LastViewedCtrl', ['$scope','LastViewedService','UserConfigService', function (_scope, _service, _userConfig) {
    angular.extend(_scope, {
        lastViewedWidget:{
            name:'LastViewed',
            label:'Last Viewed',
            closed:false,
            class:function(){
                if(_userConfig.objects.LastViewed_collapsed !== "true"){
                    return 'open';
                }else{
                    return 'close';
                }
            }
        },
        userConfigService: _userConfig,
        lastViewedService: _service
    });
}]);

SpiceCRM.directive('lastViewedWidget', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/LastViewed/template.html',
            controller: 'LastViewedCtrl',
            replace: true
        };
    }
]);

SpiceCRM.directive('lastViewedItem', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/LastViewed/entry.html',
            replace: true,
            scope:{
                itemData:'='
            }
        };
    }
]);
SpiceCRM.factory('LastViewedService', ['$http', 'UserConfigService', 'SessionStorageService', function (_http, _userConf, _storage) {
    var _viewDataService = {
        userConfigService: _userConf,
        objects:[],
        loading:false,
        load:function(){
            _viewDataService.loading = true;
            var saved = _storage.getParam('lastViewedWidgetData');
            if(saved === false) {
                _http({
                    method: 'GET',
                    url: 'KREST/theme/getLastViewed'
                }).success(function (_response) {
                    _viewDataService.objects = _response;
                    _storage.setParam('lastViewedWidgetData',_response);
                });
            }else{
                _viewDataService.objects = _storage.getParam('lastViewedWidgetData');
                if($('form[name="DetailView"]').length > 0){
                    var found = false;
                    var temp_entry = {
                        id: 1,
                        item_id: $('form[name="DetailView"] input[name="record"]').val(),
                        item_summary: $('.moduleTitle h2').html(),
                        item_summary_short: $('.moduleTitle h2').html().substring(0,13)+"...",
                        module_name: $('form[name="DetailView"] input[name="module"]').val()
                    };
                    var index;
                    for (index = 0; index < _viewDataService.objects.length; ++index) {
                        if(_viewDataService.objects[index].item_id == temp_entry.item_id){
                            found = true;
                            var found_entry = _viewDataService.objects.splice(index,1);
                        }
                    }

                    _viewDataService.objects.unshift(temp_entry);
                    _viewDataService.objects = _viewDataService.objects.splice(0,10);
                    _storage.setParam('lastViewedWidgetData',_viewDataService.objects);
                }
            }
            _viewDataService.loading = false;
        }
    };
    _viewDataService.userConfigService.load();
    _viewDataService.load();
    return _viewDataService;
}]);

SpiceCRM.controller('shortcutsCtrl', ['$scope','shortcutsService','UserConfigService', function (_scope, _service, _userConfig) {
    angular.extend(_scope, {
        shortcutsWidget:{
            name:'Shortcuts',
            label:'Shortcuts',
            closed:false,
            class:function(){
                if(_userConfig.objects.Shortcuts_collapsed !== "true"){
                    return 'open';
                }else{
                    return 'close';
                }
            }
        },
        userConfigService: _userConfig,
        shortcutsService: _service
    });
}]);

SpiceCRM.directive('shortcutsWidget', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/Shortcuts/template.html',
            controller: 'shortcutsCtrl',
            replace: true
        };
    }
]);

SpiceCRM.directive('shortcutsItem', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'themes/SpiceTheme/js/Widgets/Shortcuts/entry.html',
            replace: true,
            scope:{
                itemData:'='
            }
        };
    }
]);
SpiceCRM.factory('shortcutsService', ['$http', '$window', 'UserConfigService', 'SessionStorageService', function (_http, _window, _userConf, _storage) {
    var _shortDataService = {
        userConfigService: _userConf,
        objects:[],
        loading:false,
        load:function(){
            _shortDataService.loading = true;
            var saved = _storage.getParam('shortcuts');
            if(saved === false || saved[_window.currentModule] === undefined) {
                _http({
                    method: 'GET',
                    url: 'KREST/theme/getShortcuts/'+_window.currentModule
                }).success(function (_response) {
                    _shortDataService.objects = _response;
                    if(saved === false){
                        saved = {};
                        saved[_window.currentModule] = _response;
                    }else{
                        saved[_window.currentModule] = _response;
                    }
                    _storage.setParam('shortcuts',saved);
                });
            }else{
                _shortDataService.objects = saved[_window.currentModule];
            }
            _shortDataService.loading = false;
        }
    };
    _shortDataService.userConfigService.load();
    _shortDataService.load();
    return _shortDataService;
}]);
