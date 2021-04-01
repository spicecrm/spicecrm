/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    /**
     * indicates that hthe user needs to relogin again
     *
     * @private
     */
    private reLogin: boolean = false;

    /**
     * indicates that we have been disconnected and are trying to reconnect
     *
     * @private
     */
    private reConnecting: boolean = false;

    /**
     * indicates that any further request should be staged
     *
     * @private
     */
    private stageRequests: boolean = false;

    /**
     * holds staged requests that had an error and shoudlbe later on reprocessed
     *
     * @private
     */
    private stagedRequests: any[] = [];

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
    public getRequest(route: string = "", params: any = {}, responseSubject?: Subject<any>): Observable<any> {
        // if we do not have a responsesubject passed in create a new one
        if (!responseSubject) {
            responseSubject = new Subject<any>();
        }

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('GET', route, {getParams: params}, responseSubject);
        } else {
            this.http.get(
                this.configurationService.getBackendUrl() + "/" + encodeURI(route),

                {headers: this.getHeaders(), observe: "response", params: this.prepareParams(params)}
            ).subscribe(
                (res) => {
                    responseSubject.next(res.body);
                    responseSubject.complete();
                },
                err => {
                    if (this.handleError(err, route, 'GET', {getParams: params}, responseSubject) == false) {
                        responseSubject.error(err);
                    }
                }
            );
        }
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
    public postRequest(route: string = "", params: any = {}, body: any = {}, responseSubject?: Subject<any>): Observable<any> {
        if (!responseSubject) {
            responseSubject = new Subject<any>();
        }

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('GET', route, {getParams: params, body: body}, responseSubject);
        } else {

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
                    if (!this.handleError(err, route, 'POST', {getParams: params, body: body}, responseSubject)) {
                        responseSubject.error(err);
                    }
                }
            );
        }
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
    public postRequestWithProgress(route: string = "", params: any = {}, body: any = {}, progress: BehaviorSubject<number> = null, responseSubject?: Subject<any>): Observable<any> {
        if (!responseSubject) {
            responseSubject = new Subject<any>();
        }

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('POSTWITHPROGRESS', route, {
                getParams: params,
                body: body,
                progress: progress
            }, responseSubject);
        } else {

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
                    if (!this.handleError(err, route, 'POSTWITHPROGRESS', {
                        getParams: params,
                        body: body,
                        progress: progress
                    }, responseSubject)) {
                        responseSubject.error(err);
                    }
                }
            );
        }
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
    public putRequest(route: string = "", params: any = {}, body: any = {}, responseSubject?: Subject<any>): Observable<any> {
        if (!responseSubject) {
            responseSubject = new Subject<any>();
        }

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('PUT', route, {getParams: params, body: body}, responseSubject);
        } else {
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
                    if(!this.handleError(err, route, 'PUT', {getParams: params, body: body},responseSubject)) {
                        responseSubject.error(err);
                    }
                }
            );
        }
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
    public deleteRequest(route: string = "", params: any = {}, responseSubject?: Subject<any>): Observable<any> {
        if (!responseSubject) {
            responseSubject = new Subject<any>();
        }

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('DELETE', route, {getParams: params}, responseSubject);
        } else {
            this.http.delete(
                this.configurationService.getBackendUrl() + "/" + route,
                {headers: this.getHeaders(), params: this.prepareParams(params)}
            ).subscribe(
                (res) => {
                    responseSubject.next(res ? res : true);
                    responseSubject.complete();
                },
                (err) => {
                    this.handleError(err, route, 'DELETE', {getParams: params}, responseSubject);
                    responseSubject.error(err);
                }
            );
        }
        return responseSubject.asObservable();
    }

    /**
     * a method to handle http errors
     *
     * @param err the error that occured
     * @param route the route that has been called
     * @param method the method of the all (e.g. POST, GET, ...
     * @param data the data passed in
     * @param httpErrorReport a boolean flag that specifies if the error shoudl be logged on the backend. Defaults to true.
     */
    private handleError(err, route, method: string, data = null, responseSubject?: Subject<any>): boolean {
        switch (err.status) {
            case 401:
                // push the current request to the staged queue
                this.stageRequest(method, route, data, responseSubject);
                this.stageRequests = true;

                // if we are not ina  relogin already set the service to relogin and
                if (!this.reLogin) {
                    this.reLogin = true;
                    this.modalservice.openModal('GlobalReLogin', false, null, true).subscribe(modalref => {
                        modalref.instance.loggedin.subscribe(loggedin => {
                            if (loggedin) {
                                // set relogin to false so requests get processed again
                                this.reLogin = false;

                                // set the stageRequests flag back to false so new requests can be processed
                                this.stageRequests = false;

                                // process staged requests
                                this.processStagedRequests();
                            }
                        });
                    });
                }
                return true;
            case 0:
                // push the current request to the staged queue
                this.stageRequest(method, route, data, responseSubject);
                this.stageRequests = true;
                if(!this.reConnecting) {
                    this.reConnecting = true;
                    this.modalservice.openModal('GlobalReConnect', false, null, true).subscribe(modalref => {
                        modalref.instance.connected.subscribe(connected => {
                            if (connected) {
                                // set reConnecting to false so requests get processed again
                                this.reConnecting = false;

                                // set the stageRequests flag back to false so new requests can be processed
                                this.stageRequests = false;

                                // process staged requests
                                this.processStagedRequests();
                            }
                        });
                    });
                }
                // this.reportError(err, route, method, data);
                return true;
        }
        return false;
    }

    /**
     * stage a request
     *
     * @param method
     * @param route
     * @param data
     * @param responseSubject
     * @private
     */
    private stageRequest(method, route, data, responseSubject) {
        this.stagedRequests.push({
            method, route, data, responseSubject
        });
    }

    /**
     * processes all staged requests that have not been processed
     * @private
     */
    private processStagedRequests() {
        // loop through staged requests and resubmit them
        for (let stagedRequest of this.stagedRequests) {
            switch (stagedRequest.method) {
                case 'GET':
                    this.getRequest(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.responseSubject);
                    break;
                case 'POST':
                    this.postRequest(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.data.body, stagedRequest.responseSubject);
                    break;
                case 'POSTWITHPROGRESS':
                    this.postRequestWithProgress(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.data.body, stagedRequest.data.progress, stagedRequest.responseSubject);
                    break;
                case 'PUT':
                    this.putRequest(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.data.body, stagedRequest.responseSubject);
                    break;
                case 'DELETE':
                    this.deleteRequest(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.responseSubject);
                    break;
            }
        }

        // clear the staged request queue
        this.stagedRequests = [];
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
            this.postRequest('httperrors', null, {errors: this.httpErrorsToReport}).subscribe(
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

    /*
     * Model functions
     */
    public get(module: string, id: string, trackAction: string = ''): Observable<any[]> {
        let responseSubject = new Subject<any[]>();

        let params: any = {};
        if (trackAction) {
            params.trackaction = trackAction;
        }
        this.getRequest("module/" + module + "/" + id, params).subscribe(
            (response: any) => {
                for (let fieldName in response) {
                    response[fieldName] = this.backend2spice(module, fieldName, response[fieldName]);
                }

                responseSubject.next(response);
                responseSubject.complete();
            }, error => {
                responseSubject.error(error);
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

    public save(module: string, id: string, cdata: any, progress: BehaviorSubject<number> = null, templateId: string = null): Observable<any[]> {
        let responseSubject = new Subject<any[]>();
        this.postRequestWithProgress("module/" + module + "/" + id, {templateId: templateId}, this.modelutilities.spiceModel2backend(module, cdata), progress)
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
