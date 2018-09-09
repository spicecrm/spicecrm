import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {configurationService} from '../../services/configuration.service';

@Injectable()
export class MenuService {

    constructor(private http: HttpClient, private configurationService: configurationService) {
    }

    menuitems = [];

    loadModules() {
        var headers = new HttpHeaders();
        var options = {
            headers: headers
        };
        /*
        this.http.get('http://127.0.0.1/spicecrm_dev/KREST/metadata/modules?user=admin&password=e8636ea013e682faf61f56ce1cb1ab5c', options)
            .subscribe(res => {
                this.menuitems = res.json();
                this.menuitems[0].active = true;
            });
            */
    }
}