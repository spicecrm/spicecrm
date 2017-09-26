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
