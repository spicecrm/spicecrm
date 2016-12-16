SpiceCRM.controller('GlobalFTSController', ['$scope', 'GlobalFTSService', function (_scope, _globalFTSService) {
    angular.extend(_scope, {
        globalFTSService: _globalFTSService
    });

    _scope.$watch('globalFTSService.gloablSearchTerm', function (_newVal, _oldVal) {
        if (!(!_newVal && !_oldVal) && _newVal !== _oldVal) {
            _globalFTSService.getGlobalFTSSearchResults();
        }
    });
}]);

SpiceCRM.controller('GlobalFTSModuleItemController', ['$scope', 'GlobalFTSService', function (_scope, _globalFTSService) {
    angular.extend(_scope, {
        globalFTSService: _globalFTSService,
        setSearchModule: function () {
            this.globalFTSService.searchFiltermodule = this.menuItem;
            this.globalFTSService.getGlobalFTSModuleSearchResults();
        }
    });
}]);

SpiceCRM.directive('globalFtsModuleItem', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'include/SpiceFTSManager/tpls/globalFTSModuleItem.html',
            controller: 'GlobalFTSModuleItemController',
            replace: true,
            scope: {
                menuItem: '='
            }
        };
    }
]);

SpiceCRM.controller('GlobalFTSModulePanelController', ['$scope', 'GlobalFTSService', function (_scope, _globalFTSService) {
    angular.extend(_scope, {
        globalFTSService: _globalFTSService,
        loadMore: function (module) {
            this.globalFTSService.getGlobalFTSMoreSearchResults(module);
        }
    });
}]);

SpiceCRM.directive('globalFtsModulePanel', [function () {
    return {
        restrict: 'E',
        templateUrl: 'include/SpiceFTSManager/tpls/globalFTSModulePanel.html',
        controller: 'GlobalFTSModulePanelController',
        replace: true,
        scope: {
            searchModule: '='
        }
    };
}
]);


SpiceCRM.controller('GlobalFTSModulePanelHeaderController', ['$scope', 'GlobalFTSService', function (_scope, _globalFTSService) {
    angular.extend(_scope, {
        globalFTSService: _globalFTSService,
        getFieldStyle: function (_field) {
            return {'width': _field.width + '%'};
        }
    });
}]);

SpiceCRM.directive('globalFtsModulePanelHeader', [function () {
    return {
        restrict: 'E',
        templateUrl: 'include/SpiceFTSManager/tpls/globalFTSModuleHeader.html',
        controller: 'GlobalFTSModulePanelHeaderController',
        replace: true,
        scope: {
            searchModule: '='
        }
    };
}
]);


SpiceCRM.controller('GlobalFTSModuleSearchItemController', ['$scope', 'GlobalFTSService', function (_scope, _globalFTSService) {
    angular.extend(_scope, {
        globalFTSService: _globalFTSService,
        getFieldStyle: function (_field) {
            return {'width': _field.width + '%'};
        },
        hasLink: function (_field, _record) {
            var hasLink = false;
            angular.forEach(this.globalFTSService.viewdefs[_record._type], function (_fieldMeta) {
                if (_field.name.toUpperCase() == _fieldMeta.name.toUpperCase() && _fieldMeta.link)
                    hasLink = true;
            });
            return hasLink;
        },
        getLinkModule: function (_field, _record) {
            if (_record) {
                var linkModule = _record._type;
                angular.forEach(this.globalFTSService.viewdefs[_record._type], function (_fieldMeta) {
                    if (_field.name.toUpperCase() == _fieldMeta.name.toUpperCase() && _fieldMeta.link && _fieldMeta.linkmodule)
                        linkModule = _fieldMeta.linkmodule;
                });
                return linkModule;
            }
        },
        getLinkId: function (_field, _record) {
            if (_record) {
                var linkId = _record._id;
                angular.forEach(this.globalFTSService.viewdefs[_record._type], function (_fieldMeta) {
                    if (_field.name.toUpperCase() == _fieldMeta.name.toUpperCase() && _fieldMeta.link && _fieldMeta.linkid)
                        linkId = _record._source[_fieldMeta.linkid.toLowerCase()];
                });
                return linkId;
            }
        },
        getRecordValue: function (_field, _record) {
            if (_record && _record._source) {
                return _record._source[_field.name.toLowerCase()];
            }
        }
    });
}]);

SpiceCRM.directive('globalFtsModuleSearchItem', [function () {
    return {
        restrict: 'E',
        templateUrl: 'include/SpiceFTSManager/tpls/globalFTSModuleSearchItem.html',
        controller: 'GlobalFTSModuleSearchItemController',
        replace: true,
        scope: {
            searchModule: '=',
            searchRecord: '='
        }
    };
}
]);


SpiceCRM.factory('GlobalFTSService', ['$rootScope', '$http', '$q', function (_scope, _http, _q) {
    var _globalFTSService = {
        globalFTSSearchModules: [], // ['Accounts', 'Contacts', 'Opportunities'],
        viewdefs: {},
        gloablSearchTerm: '',
        globalSearchModules: [],
        globalSearchModuleLabels: [],
        globalSearchResults: {},
        searchFiltermodule: 'all',
        getGlobalFTSSearchModules: function () {
            _http({
                method: 'GET',
                url: 'KREST/fts/searchmodules'
            }).success(function (_response) {
                var modObject = _response;
                _globalFTSService.globalFTSSearchModules.push('all');

                angular.forEach(_response.modules, function (_module) {
                    _globalFTSService.globalFTSSearchModules.push(_module);
                    _globalFTSService.globalSearchModules.push(_module);
                    _globalFTSService.viewdefs = _response.viewdefs;
                });

                _globalFTSService.globalSearchModuleLabels = _response.moduleLabels;
                _globalFTSService.globalSearchModuleLabels.all = 'All Modules';

                // do an initilal load of results
                _globalFTSService.getGlobalFTSSearchResults();
            });
        },
        getGlobalFTSSearchResults: function () {
            if (this.searchFiltermodule !== 'all') {
                this.getGlobalFTSModuleSearchResults();
            } else {
                _http({
                    method: 'GET',
                    url: 'KREST/fts/globalsearch/' + _globalFTSService.globalSearchModules.join() + (_globalFTSService.gloablSearchTerm ? '/' : '') + _globalFTSService.gloablSearchTerm
                }).success(function (_response) {
                    _globalFTSService.globalSearchResults = _response;
                    if (!_scope.$$phase) {
                        _scope.$apply();
                    }
                });
            }
        },
        getGlobalFTSMoreSearchResults: function (module) {
            _http({
                method: 'GET',
                url: 'KREST/fts/globalsearch/' + module + (_globalFTSService.gloablSearchTerm ? '/' : '') + _globalFTSService.gloablSearchTerm + '?records=25&start=' + _globalFTSService.globalSearchResults[module].hits.length
            }).success(function (_response) {
                _globalFTSService.globalSearchResults[module].hits = _globalFTSService.globalSearchResults[module].hits.concat(_response[module].hits);
            });
        },
        getGlobalFTSModuleSearchResults: function () {
            if (this.searchFiltermodule === 'all') {
                this.getGlobalFTSSearchResults();
            } else {
                _http({
                    method: 'GET',
                    url: 'KREST/fts/globalsearch/' + this.searchFiltermodule + (_globalFTSService.gloablSearchTerm ? '/' : '') + _globalFTSService.gloablSearchTerm + '?records=50&start=0'
                }).success(function (_response) {
                    _globalFTSService.globalSearchResults = _response;
                    if (!_scope.$$phase) {
                        _scope.$apply();
                    }
                });
            }
        }
    };

    _globalFTSService.gloablSearchTerm = document.getElementById('query_string').value;
    _globalFTSService.getGlobalFTSSearchModules();

    return _globalFTSService;
}]);
