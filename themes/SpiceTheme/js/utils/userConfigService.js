SpiceCRM.factory('UserConfigService', ['$http', '$window', 'SessionStorageService', function (_http, _window, _storage) {
    var _userConfigService = {
        objects:[],
        load:function(){
            var saved;
            saved = _storage.getParam('userConfig');
            if(saved === false) {
                _http({
                    method: 'GET',
                    url: 'KREST/theme/getConfig'
                }).success(function (_response) {
                    _userConfigService.objects = _response;
                    _storage.setParam('userConfig',_response);
                });
            }else{
                _userConfigService.objects = saved;
            }
        },
        toggle: function(item, save){
            if (_window.spicetheme.collapsedStatic[item] || !save) {
                _window.spicetheme.collapsed[item] = false;
                if (save) {
                    _window.spicetheme.collapsedStatic[item] = false;
                    _window.spicetheme.setToggle(false, item);
                    _userConfigService.setParam(item, false);
                }
            }else{
                _window.spicetheme.collapsed[item] = true;
                if (save) {
                    _window.spicetheme.collapsedStatic[item] = true;
                    _window.spicetheme.setToggle(true, item);
                    _userConfigService.setParam(item, true);
                }
            }
        },
        setParam: function(item,value){
            _userConfigService.objects[item+'_collapsed'] = value.toString();
            _storage.setParam('userConfig',_userConfigService.objects);
        }
    };
    return _userConfigService;
}]);
