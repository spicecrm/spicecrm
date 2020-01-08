/**
 * the backend service
 *
 * @module services
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {DomSanitizer} from '@angular/platform-browser';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {metadata} from './metadata.service';
import {toast} from './toast.service';
import {modelutilities} from './modelutilities.service';
import {modal} from './modal.service';
import {language} from './language.service';


/**
 * @ignore
 */
declare var moment: any;

/**
 * a generic interface for Route Paramaters to be sent with a request
 */
interface backendRequestParams {
    route: string;
    method?: 'GET' | 'POST';
    params?: any;
    body?: any;
    headers?: any;
}

/**
 * The backend serviceprodivdes a set of methoids to communicate with the spicecrm backend
 *
 */
@Injectable()
export class backend {
    /**
     *
     */
    private autoLogout: any = {};

    private httpErrorsToReport = [];
    private httpErrorReporting = false;
    private httpErrorReportingRetryTime = 10000; // 10 seconds

    /**
     * @ignore
     */
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
    ) {
    }

    /**
     * @ignore
     */
    private getHeaders(): HttpHeaders {
        let headers = this.session.getSessionHeader();
        headers = headers.set('Accept', 'application/json');
        return headers;
    }

    /**
     * @ignore
     */
    private prepareParams(params: object): HttpParams {
        let output = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key: string) => {
                let value = params[key];
                if (typeof value !== 'undefined' && value !== null) {
                    if (typeof value === 'object') {
                        output = output.append(key, JSON.stringify(value));
                    } else if (typeof value === 'boolean') {
                        output = output.append(key, value === true ? '1' : '0');
                    } else if (typeof value === 'number') {
                        output = output.append(key, value + '');
                    } else {
                        output = output.append(key, value.toString());
                    }
                }
            });
        }
        return output;
    }

    /**
     * generic request function for a GET request to the backend
     *
     * @param route  the route to be called on the backend e.g. 'modules/Accounts'
     * @param params an object with additonal params to be sent to the backend with the get request
     *
     * @return an Observable that is resolved with the JSON decioded response from the request. If an error occurs the error is returnes as error from the Observable
     */
    public getRequest(route: string = "", params: any = {}): Observable<any> {
        let responseSubject = new Subject<any>();
        this.resetTimeOut();
        this.http.get(
            this.configurationService.getBackendUrl() + "/" + encodeURI(route),

            {headers: this.getHeaders(), observe: "response", params: this.prepareParams(params)}
        ).subscribe(
            (res) => {
                responseSubject.next(res.body);
                responseSubject.complete();
            },
            err => {
                this.handleError(err, route, 'GET', {getParams: params});
                responseSubject.error(err);
            }
        );
        return responseSubject.asObservable();
    }

    /**
     * generic request function for a GET request that is sent and retruens the raw not parsed response. Add headers for the authentication etc.
     *
     * @param route  the route to be called on the backend e.g. 'modules/Accounts'
     * @param params an object with additonal params to be sent to the backend with the get request
     * @param responseType a response type the default is 'blob' (paramater is currently not used
     * @param headers an object with additonal heders that will be parsed as headers obejt and sent with the
     *
     * @return the http object as an observable that will response with its own response
     */
    public getRawRequest(route: string = "", params: any = {}, responseType: string = "blob", headers: any = {}): Observable<any> {

        this.resetTimeOut();

        let headers2 = this.session.getSessionHeader();
        for (let prop in headers) {
            headers2 = headers2.set(prop, headers[prop]);
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

    /**
     * generic request function for a POST request to the backend
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additonal params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     * @param httpErrorReport a boolen indicator to specify if the erro is one occurs shoudl be logged, defaults to true
     *
     * @return an Observable that is resolved with the JSON decioded response from the request. If an error occurs the error is returnes as error from the Observable
     */
    public postRequest(route: string = "", params: any = {}, body: any = {}, httpErrorReport = true): Observable<any> {
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
                this.handleError(err, route, 'POST', {getParams: params, body: body}, httpErrorReport);
                responseSubject.error(err);
            }
        );
        return responseSubject.asObservable();
    }

    /**
     * generic request function for a POST request to the backend, with upload progress reporting
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additonal params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     * @param httpErrorReport a boolen indicator to specify if the erro is one occurs shoudl be logged, defaults to true
     * @param progress: A subject where the upload progress will be reported.
     *
     * @return an Observable that is resolved with the JSON decioded response from the request. If an error occurs the error is returnes as error from the Observable
     */
    public postRequestWithProgress(route: string = "", params: any = {}, body: any = {}, httpErrorReport = true, progress: BehaviorSubject<number> = null): Observable<any> {
        let responseSubject = new Subject<any>();

        this.resetTimeOut();

        let headers = this.getHeaders();
        if (body) {
            headers = headers.set("Content-Type", "application/json");
        } else {
            headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
        }

        let reportProgress = progress !== null;
        if (reportProgress) progress.next(0);
        this.http.post(this.configurationService.getBackendUrl() + "/" + encodeURI(route), body, {
            headers: headers,
            observe: 'events',
            params: this.prepareParams(params),
            reportProgress: !!progress
        }).subscribe(
            event => {
                if (event.type === HttpEventType.UploadProgress) {
                    progress.next(100 * event.loaded / event.total);
                } else if (event.type === HttpEventType.Response) {
                    responseSubject.next(event.body);
                    responseSubject.complete();
                }
            },
            err => {
                this.handleError(err, route, 'POST', {getParams: params, body: body}, httpErrorReport);
                responseSubject.error(err);
            }
        );
        return responseSubject.asObservable();
    }


    /**
     * @ignore
     *
     * a generic post request function that expects a binary resonse from a download.
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additonal params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     *
     * @return an Observable for the request. If the response is successful the observable will return an objecturl to the dowlnoaded file in the browser
     */
    public getDownloadPostRequestFile(route: string = "", params: any = {}, body: any = {}): Observable<any> {
        let responseSubject = new Subject<any>();

        this.resetTimeOut();

        let headers = this.getHeaders();
        headers = headers.set("Accept", "*/*");

        this.http.post(
            this.configurationService.getBackendUrl() + "/" + route,
            body,
            {headers: headers, observe: "response", params: this.prepareParams(params), responseType: "blob"}
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
                this.handleError(err, route, 'POST', {getParams: params, body: body});
                let blobReader = new FileReader();
                blobReader.readAsText(err.error);
                blobReader.onloadend = (e) => {
                    responseSubject.error(JSON.parse(blobReader.result.toString()));
                };
            }
        );

        return responseSubject.asObservable();
    }

    // todo test it
    /**
     *
     * a generic post request function that expects a binary resonse from a download.
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param method the method to be used GET or POST
     * @param params an object with additonal params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     * @param headers an object with additonal heders that will be parsed as headers obejt and sent with the
     *
     * @return an Observable for the request. If the response is successful the observable will return an objecturl to the dowlnoaded file in the browser
     */
    public getLinkToDownload(
        route: string,
        method: 'GET' | 'POST' = 'GET',
        params = null,
        body = null,
        headers = null,
    ): Observable<any> {
        let sub = new Subject<any>();

        let _headers = this.getHeaders();
        _headers = _headers.set("Accept", "*/*");
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
                if (response.status == 200) {
                    // let objectUrl = URL.createObjectURL(response.blob());
                    let objectUrl = window.URL.createObjectURL(response.body);
                    sub.next(objectUrl);
                    sub.complete();
                } else {
                    sub.error(response.statusText);
                }
            },
            (err) => {
                this.handleError(err, route, method, {getParams: params, body: body});
                sub.error(err);
            }
        );

        return sub.asObservable();
    }

    /**
     * Determines the charset of a http response.
     *
     * @param response
     *
     * @return The string defining the character set.
     */
    private getCharsetOfResponse(response: any): string {
        if (!response.headers) return null;
        response.headers.lazyInit();
        let dummy = response.headers.headers.get('content-type');
        if (!dummy) return null;
        dummy = dummy[0];
        dummy = dummy.split(';');
        if (!dummy[1]) return null;
        dummy = dummy[1].split('=');
        if (!dummy[1]) return null;
        return dummy[1];
    }

    /**
     * a generic wrapper function for [[getLinkToDownload]] that will wrap the request and automatically trigger the download in the browser
     *
     * @param request_params an object of type [[backendRequestParams]]
     * @param file_name
     *
     * @return an Observable that is reolved when the file has been tranferred and the download is triggered
     */
    public downloadFile(
        request_params: backendRequestParams,
        file_name: string = null,
        file_type: string = null
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
                document.body.appendChild(a);
                a.href = downloadUrl;
                if (file_type) a.type = file_type;
                a.download = file_name;
                // start download
                a.click();
                a.remove();
                sub.next();
                sub.complete();
            },
            error => sub.error(error)
        );

        return sub.asObservable();
    }

    /**
     * generic request function for a PUT request to the backend
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additonal params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     * @param httpErrorReport a boolen indicator to specify if the erro is one occurs shoudl be logged, defaults to true
     *
     * @return an Observable that is resolved with the JSON decioded response from the request. If an error occurs the error is returnes as error from the Observable
     */
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
                this.handleError(err, route, 'PUT', {getParams: params, body: body});
                responseSubject.error(err);
            }
        );
        return responseSubject.asObservable();
    }

    /**
     * generic request function for a DELETE request to the backend
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additonal params to be sent to the backend with the get request
     *
     * @return an Observable that is resolved with the JSON decioded response from the request. If an error occurs the error is returnes as error from the Observable
     */
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
                this.handleError(err, route, 'DELETE', {getParams: params});
                responseSubject.error(err);
            }
        );
        return responseSubject.asObservable();
    }

    /**
     * a method to handle http errors
     *
     * @param err the error that occured
     * @param route the route that has been called
     * @param method the method of the all (e.g. POST, GET, ...
     * @param data the data passed in
     * @param httpErrorReport a boolean flag that specifies if the error shoudl be logged on teh backend. Defaults to true.
     */
    private handleError(err, route, method: string, data = null, httpErrorReport = true) {
        switch (err.status) {
            case 401:
                this.toast.sendAlert(
                    this.language.getLabel("ERR_LOGGED_OUT_SESSION_EXPIRED"),
                    "error",
                    null,
                    false,
                    'sessionexpired'
                );
                this.modalservice.closeAllModals();
                this.session.endSession();
                this.router.navigate(["/login"]);
                break;
            case 0:
                if (httpErrorReport) {
                    this.reportError(err, route, method, data);
                }
        }
    }

    /**
     * a helper method that will log failed requests to the backend and then allows deeperr analysis of errors that occured based on server side logs
     *
     * @param err the error that occured
     * @param route the route that has been called
     * @param method the method of the all (e.g. POST, GET, ...
     * @param data the data passed in
     */
    private reportError(err: string, route: string, method: string, data: any): void {
        this.httpErrorsToReport.push({
            clientTime: (new Date()).toISOString(),
            clientInfo: {
                sessionId: this.session.authData.sessionId,
                userId: this.session.authData.userId,
                userName: this.session.authData.userName
            },
            route: route,
            method: method,
            getParams: data.getParams ? data.getParams : null,
            error: err,
            body: data.body ? data.body : null
        });
        if (!this.httpErrorReporting) {
            this.httpErrorReporting = true;
            window.setTimeout(() => this.errorsToBackend(), this.httpErrorReportingRetryTime);
        }
    }

    /**
     * a helper method to post the error to the backend
     * @ignore
     */
    private errorsToBackend() {
        if (this.httpErrorsToReport.length) {
            this.postRequest('httperrors', null, {errors: this.httpErrorsToReport}, false).subscribe(
                () => {
                    this.httpErrorsToReport.length = 0;
                    this.httpErrorReporting = false;
                },
                (e) => {
                    this.httpErrorReporting = true;
                    window.setTimeout(() => this.errorsToBackend(), this.httpErrorReportingRetryTime);
                }
            );
        }
    }

    /**
     * @ignore
     */
    private resetTimeOut() {
        if (this.configurationService.data.autoLogout > 0) {
            window.clearTimeout(this.autoLogout);
            this.autoLogout = window.setTimeout(
                () => this.logout(),
                parseInt(this.configurationService.data.autoLogout, 10) * 60000
            );
        }
    }

    /**
     * handles the reset of the session data, informs the user and send the user back to the login route
     */
    private logout() {
        if (this.session.authData.sessionId) {
            this.toast.sendAlert("you have been logged out", "error", "", false);
            this.session.endSession();
        }
        this.router.navigate(["/login"]);
    }

    /*
     * Model functions
     */
    public get(module: string, id: string, trackAction: string = ''): Observable<any[]> {
        let responseSubject = new Subject<any[]>();

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
    public all(module: string, params: any = {}): Observable<any[]> {
        let responseSubject = new Subject<any[]>();
        // defaults...
        if (!params.limit) {
            params.limit = -99;
        }

        if (!params.fields) {
            params.fields = "*";
        }

        this.getRequest("module/" + module, params).subscribe(
            (response: any) => {
                let list = response.list;
                for (let r of list) {
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

    /**
     * checks the backend for potential duplicates for the record with the given module and id. This requires that the reccord exists on teh database and is properly indexed
     *
     * @param module the modul the reocrd shodul be checked for, e.g. 'Contacts'
     * @param id the id of the record to be checked for
     */
    public getDuplicates(module: string, id: string): Observable<any[]> {
        let responseSubject = new Subject<any[]>();

        this.getRequest("module/" + module + "/" + id + "/duplicates")
            .subscribe((response: any) => {
                responseSubject.next(response);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    /**
     * checks with the backend if for the given module and mopdeldata instance any duplicates exist. This is used when new records are created or changed and during the process a record duplicate check shoudl be triggered, the data is yet not stored ont eh backend
     *
     * @param module the module of the record e.g. 'Accounts'
     * @param modeldata a json object with the values of the model. this is the typical model.data instance
     */
    public checkDuplicates(module: string, modeldata: any): Observable<any[]> {
        let responseSubject = new Subject<any[]>();

        this.postRequest("module/" + module + "/duplicates", {}, modeldata)
            .subscribe((response: any) => {
                responseSubject.next(response);
                responseSubject.complete();
            });
        return responseSubject.asObservable();
    }

    public getAudit(module: string, id: string, filters: any = {}): Observable<any> {
        let responseSubject = new Subject<any[]>();
        this.getRequest("module/" + module + "/" + id + "/auditlog", filters)
            .subscribe(response => {
                    responseSubject.next(response);
                    responseSubject.complete();
                },
                response => {
                    if (response.error.error && response.error.error.errorCode && response.error.error.errorCode === 'moduleNotAudited') {
                        responseSubject.error(response.error.error.errorCode);
                        responseSubject.complete();
                        // console.warn(`Audit not enabled for module "${module}".`);
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
        sortfields: any[] = [],
        fields: any[] = [],
        params: any = {},
    ): Observable<any[]> {
        let responseSubject = new Subject<any[]>();

        let start: number = params.start ? params.start : 0;
        let limit: number = params.limit ? params.limit : 25;

        let reqparams: any = params;
        reqparams.searchfields = params.searchfields;
        reqparams.offset = params.start ? params.start : 0;
        reqparams.limit = params.limit ? params.limit : 25;
        if (params.listid) {
            reqparams.listid = params.listid;
        }

        if (sortfields.length > 0) {
            reqparams.sortfields = sortfields;
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

    public save(module: string, id: string, cdata: any, progress: BehaviorSubject<number> = null): Observable<any[]> {
        let responseSubject = new Subject<any[]>();
        this.postRequestWithProgress("module/" + module + "/" + id, {}, this.modelutilities.spiceModel2backend(module, cdata), null, progress)
            .subscribe(
                (response: any) => {
                    responseSubject.next(this.modelutilities.backendModel2spice(module, response));
                    responseSubject.complete();
                },
                (error: any) => {
                    responseSubject.error(error);
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

    public getRecent(module: string = "", limit: number = 0): Observable<any[]> {
        let responseSubject = new Subject<any[]>();

        let params: any = {};
        if (module) {
            params.module = module;
        }

        if (limit > 0) {
            params.limit = limit;
        }

        this.getRequest("modules/Trackers/recent", params)
            .subscribe((response) => {
                responseSubject.next(response);
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
