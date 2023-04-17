/**
 * the backend service
 *
 * @module services
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {Subject, Observable, BehaviorSubject, Subscription} from 'rxjs';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {modelutilities} from './modelutilities.service';
import {modal} from './modal.service';
import {broadcast} from "./broadcast.service";
import {map, tap} from "rxjs/operators";

/**
 * a generic interface for Route Parameters to be sent with a request
 */
interface backendRequestParams {
    route: string;
    method?: 'GET' | 'POST';
    params?: any;
    body?: any;
    headers?: any;
}

/**
 * The backend service prodivdes a set of methods to communicate with the backend
 *
 */
@Injectable()
export class backend {

    /**
     * holds the pending requests count
     */
    public pendingRequestsCount = 0;
    /**
     * subject to emit the pending requests count
     */
    public pendingCountChange$ = new Subject<number>();
    /**
     *
     */
    public autoLogout: any = {};

    /**
     * indicates that hthe user needs to relogin again
     *
     * @private
     */
    public reLogin: boolean = false;

    /**
     * indicates that we have been disconnected and are trying to reconnect
     *
     * @private
     */
    public reConnecting: boolean = false;

    /**
     * indicates that any further request should be staged
     *
     * @private
     */
    public stageRequests: boolean = false;

    /**
     * holds staged requests that had an error and shoudlbe later on reprocessed
     *
     * @private
     */
    public stagedRequests: any[] = [];

    public httpErrorsToReport = [];
    public httpErrorReporting = false;
    public httpErrorReportingRetryTime = 10000; // 10 seconds

    /**
     * @ignore
     */
    constructor(
        public http: HttpClient,
        public broadcast: broadcast,
        public configurationService: configurationService,
        public session: session,
        public modelutilities: modelutilities,
        public modalservice: modal,
    ) {
    }

    /**
     * @return HttpHeaders from session
     */
    public getHeaders(): HttpHeaders {
        let headers = this.session.getSessionHeader();
        headers = headers.set('Accept', 'application/json');
        return headers;
    }

    /**
     * prepare request params
     * @param params
     */
    public prepareParams(params: object): HttpParams {
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
     * @param params an object with additional params to be sent to the backend with the get request
     * @param refID
     * @return an Observable that is resolved with the JSON decoded response from the request. If an error occurs the error is returns as error from the Observable
     */
    public getRequest(route: string = "", params: any = {}, refID?: string): Observable<any> {

        const responseSubject = new Subject<any>();

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('GET', route, {getParams: params}, responseSubject);
        } else {

            this.increasePendingCount();

            const subscription = this.http.get(
                this.configurationService.getBackendUrl() + "/" + encodeURI(route),
                {headers: this.getHeaders(), observe: "response", params: this.prepareParams(params)}
            ).subscribe({
                next: (res) => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    responseSubject.next(res.body);
                    responseSubject.complete();
                },
                error: err => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    if (this.handleError(err, route, 'GET', {getParams: params}, responseSubject) == false) {
                        responseSubject.error(err);
                    }
                }

            });

            if (refID) {
                this.pendingRequests[refID] = subscription;
            }
        }
        return responseSubject.asObservable();
    }

    /**
     * cancel pending requests
     * @param refIds
     */
    public cancelPendingRequests(refIds: string[]) {

        refIds.forEach(id => {
            if (!this.pendingRequests[id]) return;
            this.decreasePendingCount();
            this.pendingRequests[id].unsubscribe();
            delete this.pendingRequests[id];
        });
    }

    public pendingRequests: {[key: string]: Subscription} = {};

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

        this.increasePendingCount();

        return this.http.get(
            this.configurationService.getBackendUrl() + "/" + route,
            {
                headers: headers2,
                params: this.prepareParams(params),
                responseType: 'blob',
            }
        ).pipe(tap({
            next: () => this.decreasePendingCount(),
            error: () => this.decreasePendingCount()
        }));
    }

    /**
     * generic request function for a POST request to the backend
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additonal params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     * @param refID
     * @return an Observable that is resolved with the JSON decoded response from the request. If an error occurs the error is returns as error from the Observable
     */
    public postRequest(route: string = "", params: any = {}, body: any = {}, refID?: string): Observable<any> {

        const responseSubject = new Subject<any>();

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('GET', route, {getParams: params, body: body}, responseSubject);
        } else {

            this.increasePendingCount();

            let headers = this.getHeaders();
            if (body) {
                headers = headers.set("Content-Type", "application/json");
            } else {
                headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
            }

            const subscription = this.http.post(
                this.configurationService.getBackendUrl() + "/" + encodeURI(route),
                body,
                {headers: headers, observe: "response", params: this.prepareParams(params)}
            ).subscribe({
                next: (res) => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    responseSubject.next(res.body);
                    responseSubject.complete();
                },
                error: err => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    if (!this.handleError(err, route, 'POST', {getParams: params, body: body}, responseSubject)) {
                        responseSubject.error(err);
                    }
                }
            });

            if (refID) {
                this.pendingRequests[refID] = subscription;
            }
        }
        return responseSubject.asObservable();
    }

    /**
     * generic request function for a PATCH request to the backend
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additional params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     *
     * @param refID
     * @return an Observable that is resolved with the JSON decoded response from the request. If an error occurs the error is returns as error from the Observable
     */
    public patchRequest(route: string = "", params: any = {}, body: any = {}, refID?: string): Observable<any> {

        const responseSubject = new Subject<any>();

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('PATCH', route, {getParams: params, body: body}, responseSubject);
        } else {

            let headers = this.getHeaders();
            if (body) {
                headers = headers.set("Content-Type", "application/json");
            } else {
                headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
            }

            this.increasePendingCount();

            const subscription = this.http.patch(
                this.configurationService.getBackendUrl() + "/" + encodeURI(route),
                body,
                {headers: headers, observe: "response", params: this.prepareParams(params)}
            ).subscribe({
                next: (res) => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    responseSubject.next(res.body);
                    responseSubject.complete();
                },
                error: err => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    if (!this.handleError(err, route, 'POST', {getParams: params, body: body}, responseSubject)) {
                        responseSubject.error(err);
                    }
                }

            });

            if (refID) {
                this.pendingRequests[refID] = subscription;
            }
        }
        return responseSubject.asObservable();
    }

    /**
     * generic request function for a POST request to the backend, with upload progress reporting
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additonal params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     * @param progress: A subject where the upload progress will be reported.
     * @param refID
     * @return an Observable that is resolved with the JSON decioded response from the request. If an error occurs the error is returnes as error from the Observable
     */
    public postRequestWithProgress(route: string = "", params: any = {}, body: any = {}, progress: BehaviorSubject<number> = null, refID?: string): Observable<any> {

        const responseSubject = new Subject<any>();

        // if requests should be staged do not even attempt to process currently
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

            this.increasePendingCount();

            const subscription = this.http.post(this.configurationService.getBackendUrl() + "/" + encodeURI(route), body, {
                headers: headers,
                observe: 'events',
                params: this.prepareParams(params),
                reportProgress: !!progress
            }).subscribe({
                next:
                    event => {
                        if (event.type === HttpEventType.UploadProgress) {
                            progress.next(100 * event.loaded / event.total);
                        } else if (event.type === HttpEventType.Response) {
                            this.decreasePendingCount();
                            delete this.pendingRequests[refID];

                            responseSubject.next(event.body);
                            responseSubject.complete();
                        }
                    },
                error: err => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    if (!this.handleError(err, route, 'POSTWITHPROGRESS', {getParams: params, body: body, progress: progress}, responseSubject)) {
                        responseSubject.error(err);
                    }
                }

            });

            if (refID) {
                this.pendingRequests[refID] = subscription;
            }
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
     * @param refID
     * @return an Observable for the request. If the response is successful the observable will return an objecturl to the dowlnoaded file in the browser
     */
    public getDownloadPostRequestFile(route: string = "", params: any = {}, body: any = {}, refID?: string): Observable<any> {
        let responseSubject = new Subject<any>();

        let headers = this.getHeaders();
        headers = headers.set("Accept", "*/*");

        const subscription = this.http.post(
            this.configurationService.getBackendUrl() + "/" + route,
            body,
            {headers: headers, observe: "response", params: this.prepareParams(params), responseType: "blob"}
        ).subscribe({
            next: (response: any) => {
                delete this.pendingRequests[refID];
                let objectUrl = window.URL.createObjectURL(response.body);
                responseSubject.next(objectUrl);
                responseSubject.complete();
            },
            error: err => {
                delete this.pendingRequests[refID];
            this.handleError(err, route, 'POST', {getParams: params, body: body});
            let blobReader = new FileReader();
            blobReader.readAsText(err.error);
            blobReader.onloadend = (e) => {
                responseSubject.error(JSON.parse(blobReader.result.toString()));
            };
        }
        });

        if (refID) {
            this.pendingRequests[refID] = subscription;
        }

        return responseSubject.asObservable();
    }

    // todo test it
    /**
     *
     * a generic post request function that expects a binary response from a download.
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param method the method to be used GET or POST
     * @param params an object with additional params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     * @param headers an object with additional headers that will be parsed as headers object and sent with the
     * @param refID
     * @return an Observable for the request. If the response is successful the observable will return an object to the downloaded file in the browser
     */
    public getLinkToDownload(route: string, method: 'GET' | 'POST' = 'GET', params = null, body = null, headers = null, refID?: string): Observable<any> {
        let sub = new Subject<any>();

        let _headers = this.getHeaders();
        _headers = _headers.set("Accept", "*/*");
        // todo: add given headers here...

        this.increasePendingCount();

        const subscription = this.http.request(
            method,
            this.configurationService.getBackendUrl() + "/" + route,
            {
                body: body,
                headers: _headers,
                observe: "response",
                params: this.prepareParams(params),
                responseType: "blob",
            }).subscribe({
            next: (response: any) => {

                this.decreasePendingCount();
                delete this.pendingRequests[refID];


                if (response.status == 200) {
                    // let objectUrl = URL.createObjectURL(response.blob());
                    let objectUrl = window.URL.createObjectURL(response.body);
                    sub.next(objectUrl);
                    sub.complete();
                } else {
                    sub.error(response.statusText);
                }
            },
            error: (err) => {
                this.decreasePendingCount();
                delete this.pendingRequests[refID];

                this.handleError(err, route, method, {getParams: params, body: body});
                sub.error(err);
            }
        });

        if (refID) {
            this.pendingRequests[refID] = subscription;
        }

        return sub.asObservable();
    }


    /**
     * a generic wrapper function for [[getLinkToDownload]] that will wrap the request and automatically trigger the download in the browser
     *
     * @param request_params an object of type [[backendRequestParams]]
     * @param file_name
     *
     * @param file_type
     * @return an Observable that is resolved when the file has been transferred and the download is triggered
     */
    public downloadFile(request_params: backendRequestParams, file_name: string = null, file_type: string = null): Observable<void> {
        let sub = new Subject<void>();

        this.getLinkToDownload(
            request_params.route,
            request_params.method,
            request_params.params,
            request_params.body,
            request_params.headers
        ).subscribe({
            next: (res) => {
                let downloadUrl = res;
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
            error: error => sub.error(error)
        });

        return sub.asObservable();
    }

    /**
     * generic request function for a PUT request to the backend
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additonal params to be sent to the backend with the get request
     * @param body an object being sent as body/payload with the request
     * @param refID
     * @return an Observable that is resolved with the JSON decioded response from the request. If an error occurs the error is returnes as error from the Observable
     */
    public putRequest(route: string = "", params: any = {}, body: any = {}, refID?: string): Observable<any> {

        const responseSubject = new Subject<any>();

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('PUT', route, {getParams: params, body: body}, responseSubject);
        } else {
            this.increasePendingCount();

            const subscription = this.http.put(
                this.configurationService.getBackendUrl() + "/" + route,
                body,
                {headers: this.getHeaders(), observe: "response", params: this.prepareParams(params)}
            ).subscribe({
                next: (res) => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    responseSubject.next(res.body);
                    responseSubject.complete();
                },
                error: (err) => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    if (!this.handleError(err, route, 'PUT', {getParams: params, body: body}, responseSubject)) {
                        responseSubject.error(err);
                    }
                }
            });

            if (refID) {
                this.pendingRequests[refID] = subscription;
            }
        }
        return responseSubject.asObservable();
    }

    /**
     * generic request function for a DELETE request to the backend
     *
     * @param route  the route to be called on the backend e.g. 'modules/Account/<guid>'
     * @param params an object with additional params to be sent to the backend with the get request
     * @param refID
     * @return an Observable that is resolved with the JSON decoded response from the request. If an error occurs the error is returns as error from the Observable
     */
    public deleteRequest(route: string = "", params: any = {}, refID?: string): Observable<any> {

        const responseSubject = new Subject<any>();

        // if requests shoud be staged do not even attempt to process currently
        if (this.stageRequests) {
            this.stageRequest('DELETE', route, {getParams: params}, responseSubject);
        } else {
            this.increasePendingCount();
            const subscription = this.http.delete(
                this.configurationService.getBackendUrl() + "/" + route,
                {headers: this.getHeaders(), params: this.prepareParams(params)}
            ).subscribe({
                next: (res) => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    responseSubject.next(res ? res : true);
                    responseSubject.complete();
                },
                error: (err) => {
                    this.decreasePendingCount();
                    delete this.pendingRequests[refID];

                    this.handleError(err, route, 'DELETE', {getParams: params}, responseSubject);
                    responseSubject.error(err);
                }
            });

            if (refID) {
                this.pendingRequests[refID] = subscription;
            }
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
     * @param responseSubject
     */
    public handleError(err, route, method: string, data = null, responseSubject?: Subject<any>): boolean {
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
            case 403:
                if (err.error?.error?.errorCode !== 'noLegalNoticeAccepted') return false;

                this.broadcast.broadcastMessage('backend.response.error', 'noLegalNoticeAccepted');

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
     * @param refID
     * @private
     */
    public stageRequest(method, route, data, responseSubject, refID?: string) {
        this.stagedRequests.push({
            method, route, data, responseSubject, refID
        });
    }

    /**
     * processes all staged requests that have not been processed
     * @private
     */
    public processStagedRequests() {
        // loop through staged requests and resubmit them
        for (let stagedRequest of this.stagedRequests) {
            switch (stagedRequest.method) {
                case 'GET':
                    this.getRequest(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.refID).subscribe({
                        next: res => stagedRequest.responseSubject.next(res),
                        error: err => stagedRequest.responseSubject.error(err),
                    });
                    break;
                case 'POST':
                    this.postRequest(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.data.body, stagedRequest.refID).subscribe({
                        next: res => stagedRequest.responseSubject.next(res),
                        error: err => stagedRequest.responseSubject.error(err),
                    });
                    break;
                case 'PATCH':
                    this.patchRequest(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.data.body, stagedRequest.refID).subscribe({
                        next: res => stagedRequest.responseSubject.next(res),
                        error: err => stagedRequest.responseSubject.error(err),
                    });
                    break;
                case 'POSTWITHPROGRESS':
                    this.postRequestWithProgress(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.data.body, stagedRequest.data.progress, stagedRequest.refID).subscribe({
                        next: res => stagedRequest.responseSubject.next(res),
                        error: err => stagedRequest.responseSubject.error(err),
                    });
                    break;
                case 'PUT':
                    this.putRequest(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.data.body, stagedRequest.refID).subscribe({
                        next: res => stagedRequest.responseSubject.next(res),
                        error: err => stagedRequest.responseSubject.error(err),
                    });
                    break;
                case 'DELETE':
                    this.deleteRequest(stagedRequest.route, stagedRequest.data.getParams, stagedRequest.refID).subscribe({
                        next: res => stagedRequest.responseSubject.next(res),
                        error: err => stagedRequest.responseSubject.error(err),
                    });
                    break;
            }
        }

        // clear the staged request queue
        this.stagedRequests = [];
    }

    /**
     * a helper method that will log failed requests to the backend and then allows deeper analysis of errors that occurred based on server side logs
     *
     * @param err the error that occured
     * @param route the route that has been called
     * @param method the method of the all (e.g. POST, GET, ...
     * @param data the data passed in
     */
    public reportError(err: string, route: string, method: string, data: any): void {
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
    public errorsToBackend() {
        if (this.httpErrorsToReport.length) {
            this.postRequest('system/httperrors', null, {errors: this.httpErrorsToReport}).subscribe({
                next:
                    () => {
                        this.httpErrorsToReport.length = 0;
                        this.httpErrorReporting = false;
                    },
                error: (e) => {
                    this.httpErrorReporting = true;
                    window.setTimeout(() => this.errorsToBackend(), this.httpErrorReportingRetryTime);
                }

            });
        }
    }

    /**
     * increase pending requests count and set total
     * @private
     */
    private increasePendingCount() {
        this.pendingRequestsCount++;
        this.pendingCountChange$.next(this.pendingRequestsCount);
    }

    /**
     * decrease pending requests count and rest total
     * @private
     */
    private decreasePendingCount() {
        this.pendingRequestsCount--;
        this.pendingCountChange$.next(this.pendingRequestsCount);
    }

    /**
     * get request for the module api which process the backend data before passing them in the response
     * @param module
     * @param id
     * @param trackAction
     * @param refID
     */
    public get(module: string, id: string, trackAction: string = '', refID?: string): Observable<any> {

        let params: any = {};
        if (trackAction) {
            params.trackaction = trackAction;
        }

        return this.getRequest("module/" + module + "/" + id, params)
            .pipe(
                map(response => {
                    for (let fieldName in response) {
                        response[fieldName] = this.backend2spice(module, fieldName, response[fieldName]);
                    }
                    return response;
                }));
    }

    /**
     * checks the backend for potential duplicates for the record with the given module and id. This requires that the record exists on teh database and is properly indexed
     *
     * @param module the modul the record should be checked for, e.g. 'Contacts'
     * @param id the id of the record to be checked for
     * @param refID
     */
    public getDuplicates(module: string, id: string, refID?: string): Observable<any[]> {

        return this.getRequest("module/" + module + "/" + id + "/duplicates", null,refID);
    }

    /**
     * checks with the backend if for the given module and model data instance any duplicates exist. This is used when new records are created or changed and during the process a record duplicate check should be triggered, the data is yet not stored ont eh backend
     *
     * @param module the module of the record e.g. 'Accounts'
     * @param modelData a json object with the values of the model. this is the typical model.data instance
     * @param refID
     */
    public checkDuplicates(module: string, modelData: any, refID?: string): Observable<any[]> {

        return this.postRequest("module/" + module + "/duplicates", {}, modelData, refID);
    }

    /**
     * get a list of items for the given module from the backend
     * @param {string} module
     * @param sortFields
     * @param params
     * @param refID
     * @returns {<Array<any>>}
     */
    public getList(module: string, sortFields: any[] = [], params: any = {}, refID?: string): Observable<{aggregations, buckets, source, totalcount, list: any[]}> {

        let start: number = params.start ? params.start : 0;
        let limit: number = params.limit ? params.limit : 25;

        let reqparams: any = params;
        reqparams.searchfields = params.searchfields;
        reqparams.offset = params.start ? params.start : 0;
        reqparams.limit = params.limit ? params.limit : 25;
        if (params.listid) {
            reqparams.listid = params.listid;
        }

        if (sortFields.length > 0) {
            reqparams.sortfields = sortFields;
        }

        return this.getRequest("module/" + module, reqparams, refID).pipe(
            map((response: {aggregations, buckets, source, totalcount, list: any[]}) => {
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
                    return response;
                } catch (e) {
                    return {
                        aggregations: [], buckets: [], source: [], totalcount: [], list: []};
                }
            })
        );
    }

    /**
     * post request for the module api which prepare the frontend data before sending them to the backend
     * @param module
     * @param id
     * @param cdata
     * @param progress
     * @param templateId
     * @param refID
     */
    public save(module: string, id: string, cdata: any, progress: BehaviorSubject<number> = null, templateId: string = null, refID?: string): Observable<any[]> {
        return this.postRequestWithProgress("module/" + module + "/" + id, {templateId: templateId}, this.modelutilities.spiceModel2backend(module, cdata), progress, refID)
            .pipe(
                map(response => this.modelutilities.backendModel2spice(module, response))
            );
    }

    /*
     internal helper functions
     */
    public backend2spice(module: string, field: string, value: any) {
        return this.modelutilities.backend2spice(module, field, value);
    }

    public spice2backend(module: string, field: string, value: any) {
        return this.modelutilities.spice2backend(module, field, value);
    }

}
