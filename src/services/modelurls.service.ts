/**
 * @module services
 */
import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";

import {configurationService} from "./configuration.service";
import {session} from "./session.service";
import {backend} from "./backend.service";
import {toast} from "./toast.service";
import {language} from "./language.service";
import {broadcast} from "./broadcast.service";
import {modal} from "./modal.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * handles the model urls. Can be instantiated in the contect of a model with an id and allows the dsplay as well as manipulation of urls
 */
@Injectable()
export class modelurls implements OnDestroy {
    /**
     * reference id will be sent with each backend request to enable canceling the pending requests
     */
    public httpRequestsRefID: string = window._.uniqueId('model_urls_http_ref_');
    /**
     * the module of the parent object this is linked to
     */
    public module: string;

    /**
     * the id of the parent bean
     */
    public id: string;

    /**
     * the toal url count
     */
    public count: number = 0;

    /**
     * the urls loaded
     */
    public urls: any[] = [];

    /**
     * indicates that the list of urls is being loaded
     */
    public loading: boolean = false;

    /**
     * an emitter that emits when the urls are loaded
     */
    public loaded: boolean = false;

    /**
     * an emitter that emits when the urls are loaded
     */
    public loaded$: BehaviorSubject<boolean>;

    constructor(
        public backend: backend,
        public configurationService: configurationService,
        public session: session,
        public toast: toast,
        public broadcast: broadcast,
        public language: language,
        public modal: modal
    ) {
        this.loaded$ = new BehaviorSubject<boolean>(false);
    }

    /**
     * returns the count of the urls
     */
    public getCount(): Observable<any> {
        let retSubject = new Subject();
        this.backend.getRequest(`common/spiceurls/module/${this.module}/${this.id}/count`, null, this.httpRequestsRefID).subscribe({
            next: response => {
                // set the count
                this.count = response.count;

                retSubject.next(this.count);
                retSubject.complete();
            },
            error: () => {
                retSubject.complete();
            }
        });
        return retSubject.asObservable();
    }

    /**
     * broadcasts the total number of urls found
     * sends a reload information
     */
    public broadcastUrlCount() {
        this.broadcast.broadcastMessage('urls.loaded', {
            module: this.module,
            id: this.id,
            urlcount: this.count,
            reload: true
        });
    }

    /**
     * loads the urls
     */
    public getUrls(): Observable<any> {
        let retSubject = new Subject();

        this.urls = [];
        this.loading = true;
        this.backend.getRequest(`common/spiceurls/module/${this.module}/${this.id}`, null, this.httpRequestsRefID).subscribe({
            next: response => {
                for (let attId in response) {
                    if (!this.urls.find(a => a.id == attId)) {
                        response[attId].date = new moment(response[attId].date);
                        this.urls.push(response[attId]);
                    }
                }

                // set the count
                this.count = this.urls.length;

                // broadcast the count
                this.broadcastUrlCount();

                this.loading = false;

                // close the subject
                retSubject.next(this.urls);
                retSubject.complete();

                this.loaded = true;

                // emit on the service
                this.loaded$.next(true);
            },
            error: error => {
                this.loading = false;

                // close the subject
                retSubject.error(error);
                retSubject.complete();
            }

        });

        return retSubject.asObservable();
    }

    /**
     * delete an url
     * @param id
     */
    public deleteUrl(id) {
        this.backend.deleteRequest(`common/spiceurls/module/${this.module}/${this.id}/${id}`, null, this.httpRequestsRefID).subscribe({
            next: (res) => {
                let index = this.urls.findIndex(f => f.id == id);
                this.urls.splice(index, 1);

                // broadcast the count
                this.count--;
                this.broadcastUrlCount();
            }, error: (error) => {
                //  Cannot delete url.
                this.toast.sendToast('ERR_URL_DELETE', 'error', error.error.error.message, false);
            }
        });
    }


    /**
     * retrieves an url with a given id for a model
     * @param id
     */
    public getUrl(id): Observable<any> {
        let retSubject = new Subject();

        this.backend.getRequest(`common/spiceurls/module/${this.module}/${this.id}/${id}`, null, this.httpRequestsRefID).subscribe({
            next:
                urlData => {
                    retSubject.next(urlData.urlData);
                    retSubject.complete();
                },
            error: err => {
                retSubject.error(err);
                retSubject.complete();
            }
        });

        return retSubject.asObservable();
    }


    /**
     * prepares url file passed back from a drop
     *
     * @param urlString
     */
    public prepareUrlForSave(urlString: string): Observable<any> {
        if (!urlString) {
            return;
        }

        let retSub = new Subject<any>();

            let newUrl = {
                date: new moment(),
                url: urlString,
                id: '',
                url_name: '',
                user_id: '1',
                user_name: 'admin',
                uploadprogress: 0
            };

            this.saveUrl(newUrl, retSub);

        return retSub.asObservable();

    }

    /**
     * saves the url in the db
     * @param newUrl
     * @param retSub
     */
    public saveUrl(newUrl, retSub) {

        this.urls.unshift(newUrl);

        // broadcast the count
        this.count = this.urls.length;
        this.broadcastUrlCount();

        let progressSubscription = new BehaviorSubject<number>(0);
        progressSubscription.subscribe(value => {
            newUrl.uploadprogress = Math.floor(value);
        });

        let data = {data: newUrl};

        this.backend.postRequestWithProgress(`common/spiceurls/module/${this.module}/${this.id}`, null, data, progressSubscription, this.httpRequestsRefID).subscribe(val => {
            newUrl.id = val.id;
            newUrl.user_id = val.user_id;
            newUrl.user_name = val.user_name;
            newUrl.url = val.url;
            newUrl.url_name = val.url_name;

            delete (newUrl.uploadprogress);

            retSub.next({urls: val});
            retSub.complete();
        });

    }

    public ngOnDestroy() {
        this.backend.cancelPendingRequests([this.httpRequestsRefID]);
    }
}
