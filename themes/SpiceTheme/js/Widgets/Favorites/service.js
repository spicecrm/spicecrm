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
