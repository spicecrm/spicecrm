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
