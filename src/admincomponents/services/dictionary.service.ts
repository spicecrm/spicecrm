/**
 * @module AdminComponentsModule
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {CanActivate}    from '@angular/router';

import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {metadata} from '../../services/metadata.service';

@Injectable()
export class dictionary {
    data: Array<any> = [];
    dictionaryitem: string = "";
    dictionaryfields: Array<any> = [];

    constructor(
        public http: HttpClient,
        public configurationService: configurationService,
        public session: session,
        public metadata: metadata,
    ) {}

    load(dictionaryitem: string): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();
        this.dictionaryitem = dictionaryitem;
        this.http.get(
            this.configurationService.getBackendUrl() + '/dictionary/list/' +  dictionaryitem + '?sessionid='
            + this.session.authData.sessionId
        ).subscribe((res : any) => {
                this.data = res.items;
                this.dictionaryfields = res.fields;

                responseSubject.next(res);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    getFields(){
        let out:Array<string> = [];
        for(let field of this.dictionaryfields){
            if(field !== 'id') out.push(field);
        }
        return out;
    }
}
