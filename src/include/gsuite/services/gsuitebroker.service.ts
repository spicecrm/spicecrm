/**
 * @module ModuleGSuite
 */
import {Injectable, OnDestroy} from "@angular/core";
import {Observable, Subject} from "rxjs";

declare var _: any;

/**
 * Handle the communication between the wrapper and the system
 */
@Injectable()
export class GSuiteBrokerService implements OnDestroy {
    /**
     * holds the message update event listener
     */
    private messageUpdateListener;

    /**
     * subject requests instance
     */
    private requests = {};

    /**
     * define an observable to exchange data between the system and the wrapper
     * @param messageType
     * @param data
     */
    public submitRequest(messageType: string, data?): Observable<any> {

        const response = new Subject();
        const id = _.uniqueId();
        let messageData = {source: 'SpiceCRM', messageType, id, ...data};
        if (!!data) {
            messageData = {...messageData, ...data};
        }

        this.requests[id] = response;

        const listener = e => {
            if (e.data.source != 'GSuite' || e.data.messageType != messageType || e.data.id != id) return;
            response.next(e.data.response);
            response.complete();
            window.removeEventListener('message', listener);
        };
        window.addEventListener('message', listener);
        window.top.postMessage(messageData, '*');

        return response.asObservable();
    }

    /**
     * add event listener on window to handle the incoming message changes from GSuite
     */
    public gSuiteUpdatesEmitter(): Observable<any> {
        const response = new Subject();

        this.messageUpdateListener = e => {
            if (e.data.source != 'GSuite' || e.data.messageType != 'messageUpdate') return;
            response.next(e.data.response);
        };
        window.addEventListener('message', this.messageUpdateListener);

        return response.asObservable();
    }

    /**
     * remove message update listener
     */
    public ngOnDestroy() {
        window.removeEventListener('message', this.messageUpdateListener);
    }
}
