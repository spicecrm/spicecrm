/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        private http: HttpClient,
        private configurationService: configurationService,
        private session: session,
        private metadata: metadata,
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
