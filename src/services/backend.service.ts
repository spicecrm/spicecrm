import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpParams} from "@angular/common/http";
import {DomSanitizer} from '@angular/platform-browser';
import {Subject, Observable} from 'rxjs';
import {Router}    from '@angular/router';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {metadata} from './metadata.service';
import {toast} from './toast.service';
import {modelutilities} from './modelutilities.service';
import { modal } from './modal.service';
import { language } from './language.service';

declare var moment: any;

@Injectable()
export class backend {
    private autoLogout: any = {};

    private httpErrorsToReport = [];
    private httpErrorReporting = false;
    private httpErrorReportingRetryTime = 10000; // 10 seconds

    constructor(
        private toast: toast,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private configurationService: configurationService,
        private session: session,
        private metadata: metadata,
        private router: Router,
        private modelutilities: modelutilities,
        private modalservice: modal,
        private language: language,
    ) {}

    private getHeaders(): HttpHeaders {
        let headers = this.session.getSessionHeader();
        headers = headers.set('Accept','application/json');
        return headers;
    }

    private prepareParams( params: object ): HttpParams {
        let output = new HttpParams();
        if(params) {
            Object.keys(params).forEach((key: string) => {
                let value = params[key];
                if (typeof value !== 'undefined' && value !== null) {
                    if (typeof value === 'object') {
                        output = output.append(key, JSON.stringify(value));
                    } else if (typeof value === 'boolean') {
                        output = output.append(key, value === true ? '1' : '0');
                     }else if (typeof value === 'number') {
                        output = output.append(key, value + '');
                    } else {
                        output = output.append(key, value.toString());
                    }
                }
            });
        }
        return output;
    }

    /*
     * generic request functions
     */
    public getRequest(route: string = "", params: any = {} ): Observable<any> {
        let responseSubject = new Subject<any>();
        this.resetTimeOut();
        this.http.get(
            this.configurationService.getBackendUrl() + "/" + encodeURI(route),

            {headers: this.getHeaders(), observe: "response", params: this.prepareParams(params) }
        ).subscribe(
            (res) => {
                responseSubject.next(res.body);
                responseSubject.complete();
            },
            err => {
                this.handleError( err, route, 'GET', { getParams: params } );
                responseSubject.error( err );
            }
        );
        return responseSubject.asObservable();
    }

    // todo test it
    public getRawRequest(route: string = "", params: any = {}, responseType: string = "Json", headers: any = {} ) {

        this.resetTimeOut();

        let headers2 = this.session.getSessionHeader();
        for ( let prop in headers ) {
            headers2 = headers2.set( prop, headers[prop] );
        }

        return this.http.get(
            this.configurationService.getBackendUrl() + "/" + route,
            {
                headers: headers2,
                params: this.prepareParams(params),
                responseType: 'blob',
            }
        );
    }

    public postRequest(route: string = "", params: any = {}, body: any = {},  httpErrorReport = true ): Observable<any> {
        let responseSubject = new Subject<any>();

        this.resetTimeOut();

        let headers = this.getHeaders();
        if (body) {
            headers = headers.set("Content-Type", "application/json");
        } else {
            headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
        }

        this.http.post(
            this.configurationService.getBackendUrl() + "/" + encodeURI(route),
            body,
            {headers: headers, observe: "response", params: this.prepareParams(params)}
        ).subscribe(
            (res) => {
                responseSubject.next(res.body);
                responseSubject.complete();
            },
            err => {
                this.handleError( err, route, 'POST', { getParams: params, body: body }, httpErrorReport );
                responseSubject.error( err );
            }
        );
        return responseSubject.asObservable();
    }

    // todo test it
    public postRawRequest(route: string = "", params: any = {}, responseType: string = "Json", headers: any = {} ) {

        this.resetTimeOut();

        let headers2 = this.session.getSessionHeader();
        for ( let prop in headers ) {
            headers2 = headers2.set( prop, headers[prop] );
        }

        return this.http.post(
            this.configurationService.getBackendUrl() + "/" + route,
            {
                headers: headers2,
                params: this.prepareParams(params),
                responseType: "blob",
            }
        );
    }

    // please use more meaningful function names, or at least use a description.
    // todo test it
    public getDownloadPostRequestFile(route: string = "", params: any= {}, body: any = {}): Observable<any> {
        let responseSubject = new Subject<any>();

        this.resetTimeOut();

        let headers = this.getHeaders();
        headers = headers.set("Accept","*/*");

        this.http.post(
            this.configurationService.getBackendUrl() + "/" + route,
            body,
            { headers: headers, observe: "response", params: this.prepareParams(params), responseType: "blob" }
        ).subscribe(
            (response: any) => {
                // let blob = new Blob([response], {type: "octet/stream"});
                // let objectUrl = URL.createObjectURL(new Blob([blob], {type: "octet/stream"}));
                // let objectUrl = URL.createObjectURL(response.blob());
                let objectUrl = window.URL.createObjectURL(response.body);
                // responseSubject.next(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
                responseSubject.next(objectUrl);
                responseSubject.complete();
            },
            err => {
                this.handleError( err, route, 'POST', { getParams: params, body: body } );
                responseSubject.error(err);
            }
        );

        return responseSubject.asObservable();
    }

    // todo test it
    private getLinkToDownload(
        route: string,
        method: string = 'GET',
        params = null,
        body = null,
        headers = null,
    ): Observable<any> {
        let sub = new Subject<any>();

        let _headers = this.getHeaders();
        _headers = _headers.set("Accept","*/*");
        // todo: add given headers here...

        this.http.request(
            method,
            this.configurationService.getBackendUrl() + "/" + route,
            {
                body: body,
                headers: _headers,
                observe: "response",
                params: this.prepareParams(params),
                responseType: "blob",
            }).subscribe(
            (response: any) => {
                if(response.status == 200) {
                    // let objectUrl = URL.createObjectURL(response.blob());
                    let objectUrl = window.URL.createObjectURL(response.body);
                    sub.next(objectUrl);
                    sub.complete();
                } else {
                    sub.error(response.statusText);
                }
            },
            (err) => {
                this.handleError( err, route, method, { getParams: params, body: body } );
                sub.error(err);
            }
        );

        return sub.asObservable();
    }

    // todo test it
    public downloadFile(
        request_params: {route: string, method?: string, params?: any, body?: any, headers?: any},
        file_name: string = null
    ): Observable<any> {
        let sub = new Subject<any>();

        this.getLinkToDownload(
            request_params.route,
            request_params.method,
            request_params.params,
            request_params.body,
            request_params.headers
        ).subscribe(
            (res) => {
                let downloadUrl = res;
                // window.open(downloadUrl);
                let a = document.createElement("a");
                a.href = downloadUrl;
                a.download = file_name;
                // start download
                a.click();
                a.remove();
                sub.next();
                sub.complete();
            }
        );

        return sub.asObservable();
    }

    // todo test it
    public putRequest(route: string = "", params: any = {}, body: any = {}): Observable<any> {
        let responseSubject = new Subject<any>();

        this.resetTimeOut();

        this.http.put(
            this.configurationService.getBackendUrl() + "/" + route,
            body,
            {headers: this.getHeaders(), observe: "response", params: this.prepareParams(params)}
        ).subscribe(
            (res) => {
                responseSubject.next(res.body);
                responseSubject.complete();
            },
            (err) => {
                this.handleError( err, route, 'PUT', { getParams: params, body: body } );
                responseSubject.error(err);
            }
        );
        return responseSubject.asObservable();
    }

    // todo test it
    public deleteRequest(route: string = "", params: any = {}): Observable<any> {
        let responseSubject = new Subject<any>();

        this.resetTimeOut();

        this.http.delete(
            this.configurationService.getBackendUrl() + "/" + route,
            {headers: this.getHeaders(), params: this.prepareParams(params)}
        ).subscribe(
            (res) => {
                responseSubject.next(true);
                responseSubject.complete();
            },
            (err) => {
                this.handleError( err, route, 'DELETE', { getParams: params } );
                responseSubject.error(err);
            }
        );
        return responseSubject.asObservable();
    }

    private handleError( err, route, method: string, data = null, httpErrorReport = true ) {
        switch (err.status) {
            case 401:
                this.toast.sendAlert(
                    this.language.getLabel("ERR_LOGGED_OUT_SESSION_EXPIRED" ),
                    "error",
                    null,
                    false,
                );
                this.modalservice.closeAllModals();
                this.session.endSession();
                this.router.navigate(["/login"]);
                break;
            case 0:
                if ( httpErrorReport ) {
                    this.reportError( err, route, method, data );
                }
        }
    }

    private reportError( err, route, method, data ) {
        this.httpErrorsToReport.push({
            clientTime: (new Date()).toISOString(),
            clientInfo: { sessionId: this.session.authData.sessionId, userId: this.session.authData.userId, userName: this.session.authData.userName },
            route: route,
            method: method,
            getParams: data.getParams ? data.getParams : null,
            error: err,
            body: data.body ? data.body : null
        });
        if ( !this.httpErrorReporting ) {
            this.httpErrorReporting = true;
            window.setTimeout( () => this.errorsToBackend(), this.httpErrorReportingRetryTime );
        }
    }

    private errorsToBackend() {
        if ( this.httpErrorsToReport.length ) {
            this.postRequest('httperrors', null, { 'errors' : this.httpErrorsToReport }, false ).subscribe(
                () => {
                    this.httpErrorsToReport.length = 0;
                    this.httpErrorReporting = false;
                },
                (e) => {
                    this.httpErrorReporting = true;
                    window.setTimeout( () => this.errorsToBackend(), this.httpErrorReportingRetryTime );
                }
            );
        }
    }

    private resetTimeOut() {
        if (this.configurationService.data.autoLogout > 0) {
            window.clearTimeout(this.autoLogout);
            this.autoLogout = window.setTimeout(
                () => this.logout(),
                parseInt(this.configurationService.data.autoLogout, 10) * 60000
            );
        }
    }

    private logout() {
        if(this.session.authData.sessionId) {
            this.toast.sendAlert("you have been logged out", "error", "", false);
            this.session.endSession();
        }
        this.router.navigate(["/login"]);
    }

    /*
     * Model functions
     */
    public get(module: string, id: string, trackAction: string = ''): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();

        let params: any = {};
        if (trackAction) {
            params.trackaction = trackAction;
        }
        this.getRequest("module/" + module + "/" + id, params)
            .subscribe(
                (response: any) => {
                    for (let fieldName in response) {
                        response[fieldName] = this.backend2spice(module, fieldName, response[fieldName]);
                    }

                    responseSubject.next(response);
                    responseSubject.complete();
                }, error => {
                    responseSubject.error(error);
                    responseSubject.complete();
                });
        return responseSubject.asObservable();
    }

    /**
     * returns a list of records/beans of the given module, sorted, limited and filtered by params
     * @param {string} module
     * @param {object} params aka searchParams in Backend...
     *  cheat sheet:
     *      offset {number} the number to start with...
     *      limit {number}
     *      fields {array} a list of fields of the bean...
     *      sortfield {string} the field to sort of
     *      sortdirection {string} 'asc','desc' the direction to sort
     *      listid {string} 'owner' returns only owned records...
     *      searchfields {json} like this
     *      {
     *          join: 'AND',
     *           conditions: [
     *               {
     *                   field: string '',
     *                   operator: '<>',
     *                   value: string
     *               },
     *               {
     *                   ...
     *               },
     *           ]
     *       }
     * @returns {Observable<Array<any>>}
     */
    public all(module: string, params: any = {}): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();
        // defaults...
        if( !params.limit ) {
            params.limit = -99;
        }

        if( !params.fields ) {
            params.fields = "*";
        }

        this.getRequest("module/" + module, params).subscribe(
            (response: any) => {
                let list = response.list;
                for(let r of list)
                {
                    for (let fieldName in r) {
                        r[fieldName] = this.backend2spice(module, fieldName, r[fieldName]);
                    }
                }

                responseSubject.next(list);
                responseSubject.complete();
            }
        );
        return responseSubject.asObservable();
    }

    public getDuplicates(module: string, id: string): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();

        this.getRequest("module/" + module + "/" + id + "/duplicates")
            .subscribe((response: any) => {
                responseSubject.next(response);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    public checkDuplicates(module: string, modeldata: any): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();

        this.postRequest("module/" + module + "/duplicates", {}, modeldata)
            .subscribe((response: any) => {
                responseSubject.next(response);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    public getAudit(module: string, id: string): Observable<any> {
        let responseSubject = new Subject<Array<any>>();
        this.getRequest("module/" + module + "/" + id + "/auditlog")
            .subscribe(response => {
                    responseSubject.next(response);
                    responseSubject.complete();
                },
                response => {
                    if ( response.error.error && response.error.error.errorCode && response.error.error.errorCode === 'moduleNotAudited' ) {
                        responseSubject.next( [] );
                        responseSubject.complete();
                        console.warn(`Audit not enabled for module "${module}".`);
                    }
                });
        return responseSubject.asObservable();
    }

    /**
     *
     * @param {string} module
     * @param {string} sortfield
     * @param {string} sortdirection
     * @param {Array<any>} fields
     * @param params
     * @returns {<Array<any>>}
     */
    public getList(
        module: string,
        sortfield: string,
        sortdirection: string,
        fields: Array<any> = [],
        params: any = {},
    ): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();

        let start: number = params.start ? params.start : 0;
        let limit: number = params.limit ? params.limit : 25;

        let reqparams: any = params;
        reqparams.searchfields = params.searchfields;
        reqparams.offset = params.start ? params.start : 0;
        reqparams.limit = params.limit ? params.limit : 25;
        if (params.listid) {
            reqparams.listid = params.listid;
        }

        if (sortfield && sortdirection) {
            reqparams.sortfield = sortfield;
            reqparams.sortdirection = sortdirection;
        }

        if (fields && fields.length > 0) {
            reqparams.fields = JSON.stringify(fields);
        }

        // todo: break out Options String
        this.getRequest("module/" + module, reqparams).subscribe(
            (response: any) => {
                try {
                    for (let itemIndex in response.list) {
                        for (let fieldName in response.list[itemIndex]) {
                            response.list[itemIndex][fieldName] = this.backend2spice(
                                module,
                                fieldName,
                                response.list[itemIndex][fieldName]
                            );
                        }
                    }
                } catch (e) {
                    responseSubject.next([]);
                    responseSubject.complete();
                }
                responseSubject.next(response);
                responseSubject.complete();
            }
        );
        return responseSubject.asObservable();
    }

    public save(module: string, id: string, data: any): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();

        let saveData = {};
        for (let fieldName in data) {
            saveData[fieldName] = this.spice2backend(module, fieldName, data[fieldName]);
        }

        this.postRequest("module/" + module + "/" + id, {}, JSON.stringify(saveData))
            .subscribe((response: any) => {
                for (let fieldName in response) {
                    response[fieldName] = this.backend2spice(module, fieldName, response[fieldName]);
                }
                responseSubject.next(response);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    public delete(module: string, id: string): Observable<boolean> {
        let responseSubject = new Subject<boolean>();

        this.deleteRequest("module/" + module + "/" + id)
            .subscribe((res) => {
                responseSubject.next(true);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    public getRecent(module: string = "", limit: number = 0): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();

        let params: any = {};
        if (module) {
            params.module = module;
        }

        if (limit > 0) {
            params.limit = limit;
        }

        this.getRequest("spiceui/core/recent", params)
            .subscribe((response) => {
                responseSubject.next(response);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    /*
     handling of listtypes
     */
    public addListType(module, listdata): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();

        this.postRequest(
            "spiceui/core/modules/" + module + "/listtypes",
            {},
            JSON.stringify(listdata)
        ).subscribe((response) => {
            responseSubject.next(response);
            responseSubject.complete();
        });
        return responseSubject.asObservable();
    }

    public setListType(id, module, listdata): Observable<Array<any>> {
        let responseSubject = new Subject<Array<any>>();

        this.postRequest(
            "spiceui/core/modules/" + module + "/listtypes/" + id,
            {},
            JSON.stringify(listdata)
        ).subscribe((response) => {
            responseSubject.next(response);
            responseSubject.complete();
        });
        return responseSubject.asObservable();
    }

    public deleteListType(id: string): Observable<any> {
        let responseSubject = new Subject<any>();

        this.deleteRequest("spiceui/core/modules/" + module + "/listtypes/" + id)
            .subscribe((res) => {
                responseSubject.next(res);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    /*
     internal helper functions
     */
    private backend2spice(module: string, field: string, value: any) {
        return this.modelutilities.backend2spice(module, field, value);
    }

    private spice2backend(module: string, field: string, value: any) {
        return this.modelutilities.spice2backend(module, field, value);
    }

}
