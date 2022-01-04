/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {language} from './language.service';
import {broadcast} from './broadcast.service';

@Injectable()
export class loader {
    public module: string = '';
    public id: string = '';
    public data: any = {};
    public loaderHandler: Subject<string> = new Subject<string>();
    public loadComplete: Subject<boolean>;
    public start: any = '';
    public counterCompleted = 0;
    public progress = 0;
    public activeLoader: string = '';
    public loadPhase: string = 'system';

    public loadElements: any = {
        system: [
            {
                name: 'getLanguage',
                display: 'Language',
                status: 'initial',
                sequence: 35,
                action: (loader) => {
                    loader.language.getLanguage(loader.loaderHandler);
                }
            }
        ],
        primary: [],
        secondary: []
    };

    constructor(
        public http: HttpClient,
        public broadcast: broadcast,
        public configuration: configurationService,
        public session: session,
        public language: language
    ) {
        this.loaderHandler.subscribe(val => this.handleLoaderHandler());
    }

    /**
     * gets the set tasks from teh backend
     */
    public getLoadTasks(): Observable<boolean> {
        let retSubject = new Subject<boolean>();
        this.http.get(
            this.configuration.getBackendUrl() + "/system/spiceui/core/loadtasks", {headers: this.session.getSessionHeader()}).subscribe(
            (loadtasks: any) => {

                // reset the primary tasks
                this.loadElements.primary = [];
                this.loadElements.secondary = [];

                // add the loadtasks to the elements defined as fixed
                for (let loadtask of loadtasks) {
                    loadtask.status = 'initial';
                    this.loadElements[loadtask.phase].push(loadtask);
                }

                // sort the loader arrays
                this.loadElements.primary.sort((a, b) => {
                    return parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? 1 : -1;
                });

                // sort the loader arrays
                this.loadElements.secondary.sort((a, b) => {
                    return parseInt(a.sequence, 10) > parseInt(b.sequence, 10) ? 1 : -1;
                });

                // resolve the subject to start the loader
                retSubject.next(true);
                retSubject.complete();
            }
        );
        return retSubject.asObservable();
    }


    public load(): Observable<boolean> {
        this.loadComplete = new Subject<boolean>();
        this.getLoadTasks().subscribe(loaded => {
            this.resetLoader();
            this.start = performance.now();
            this.handleLoaderHandler();
        });
        return this.loadComplete.asObservable();
    }

    public reloadPrimary() {
        this.loadComplete = new Subject<boolean>();

        // set the laodphase to primary
        this.loadPhase = 'primary';

        // reset the progress
        this.progress = 0;
        this.counterCompleted = 0;

        // reset the primary load elements
        for (let loaditem of this.loadElements.primary) {
            loaditem.status = 'initial';
        }

        // start the handler
        this.start = performance.now();
        this.handleLoaderHandler();

        // return the observable
        return this.loadComplete.asObservable();
    }

    public resetLoader() {
        // reset the progress
        this.counterCompleted = 0;
        this.progress = 0;

        this.loadPhase = 'system';

        for (let loaditem of this.loadElements.system) {
            loaditem.status = 'initial';
        }

        for (let loaditem of this.loadElements.primary) {
            loaditem.status = 'initial';
        }

        for (let loaditem of this.loadElements.secondary) {
            loaditem.status = 'initial';
        }
    }

    public reset() {
        this.counterCompleted = 0;
        this.progress = 0;

        for (let loaditem of this.loadElements.system) {
            loaditem.status = 'initial';
        }

        for (let loaditem of this.loadElements.primary) {
            loaditem.status = 'initial';
        }

        for (let loaditem of this.loadElements.secondary) {
            loaditem.status = 'initial';
        }
    }


    public setComplete() {
        let t1 = performance.now();
        if (t1 - this.start > 500) {
            this.complete();
        } else {
            setTimeout(() => this.complete(), 500);
        }
    }

    public complete() {
        // emit true
        this.loadComplete.next(true);
        this.loadComplete.complete();
    }

    public handleLoaderHandler() {
        let loadActive = false;

        for (let loadElement of this.loadElements[this.loadPhase]) {
            if (loadElement.status === 'active') {
                loadElement.status = 'completed';
                this.progress = ++this.counterCompleted / (this.loadElements.primary.length + this.loadElements.system.length) * 100;
                if (this.progress > 100) {
                    this.progress == 100;
                }
            } else if (loadElement.status === 'initial') {
                loadElement.status = 'active';
                if (loadElement.action) {
                    loadElement.action(this);
                } else {
                    this.handleRouteElement(loadElement);
                }
                loadActive = true;
                this.activeLoader = loadElement.display;
                break;
            }
        }

        if (loadActive === false && this.loadPhase == 'system') {
            this.loadPhase = 'primary';
            this.handleLoaderHandler();
        } else if (loadActive === false && this.loadPhase == 'primary') {
            // set complete
            this.setComplete();
            // switch to secondary phase
            this.loadPhase = 'secondary';

            // emit that the primary loader completed
            // allowing basic UI initialization if required in any area of the app
            this.broadcast.broadcastMessage('loader.primarycompleted');

            this.handleLoaderHandler();
        }

    }

    public handleRouteElement(loadElement) {
        let loadroute = loadElement.route ? loadElement.route : '/system/spiceui/core/loadtasks/'+loadElement.id;
        this.http.get(
            this.configuration.getBackendUrl() + loadroute,
            {headers: this.session.getSessionHeader()}
        ).subscribe((loadElementResults: any) => {
                for (let loadElementResultKey in loadElementResults) {
                    this.configuration.setData(loadElementResultKey, loadElementResults[loadElementResultKey]);
                }

                this.broadcast.broadcastMessage('loader.completed', loadElement.name);

                this.loaderHandler.next(loadElement.name);
            }
        );
    }

}
