import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';

@Injectable()
export class currency {

    private currencies: Array<any> = [];

    constructor(
        private backend: backend,
        private http: HttpClient,
        private configurationService: configurationService,
        private session: session,
    ) {}

    loadCurrencies(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('currencies'+this.session.authData.sessionId)] && sessionStorage[window.btoa('currencies'+this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            this.currencies = this.session.getSessionData('currencies');
            loadhandler.next('loadCurrencies');
        }else {
            this.backend.getRequest('currencies').subscribe(currencies => {
                this.session.setSessionData('currencies',currencies);
                this.currencies = currencies;
                loadhandler.next('loadCurrencies');
            });
        }
    }


    getCurrencies(){
        let curArray = [];

        for(let currency of this.currencies){
            curArray.push({
                id: currency.id,
                name: currency.name,
                iso: currency.iso,
                symbol: currency.symbol
            });
        }

        return curArray;
    }
}