SpiceCRM.factory('SessionStorageService', ['$window', function (_window) {
    var _sessionStorageService = {
        getParam:function(param){
            var sess;
            if(_window.sessionStorage[_sessionStorageService.readCookie('PHPSESSID')] !== undefined){
                sess = angular.fromJson(_window.sessionStorage[_sessionStorageService.readCookie('PHPSESSID')]);
            }
            if(sess !== undefined && sess[param] !== undefined){
                return sess[param];
            }else{
                return false;
            }
        },
        setParam: function(param,value){
            var saved = angular.fromJson(_window.sessionStorage[_sessionStorageService.readCookie('PHPSESSID')]);
            if(saved === undefined) saved = {};
            saved[param] = value;
            _window.sessionStorage[_sessionStorageService.readCookie('PHPSESSID')] = angular.toJson(saved);
        },
        readCookie: function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    };
    return _sessionStorageService;
}]);
