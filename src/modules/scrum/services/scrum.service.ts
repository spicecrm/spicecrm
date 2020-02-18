/**
 * @module ModuleScrum
 */
import {Injectable, OnDestroy, Output, EventEmitter} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {broadcast} from '../../../services/broadcast.service';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

@Injectable()

export class scrum implements OnDestroy{
    private broadcastsubscription: any;
    private selectedobj: string = '';
    public selectedobj$: BehaviorSubject<string>;
    public currentid: any;
    constructor(private broadcast: broadcast, private metadata: metadata, private model: model) {
        this.selectedobj$ = new BehaviorSubject<string>(this.selectedobj);
        this.broadcastsubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    public handleMessage(message) {

    }

    public selectedID(id: string) {
        this.selectedobj$.next(id);
    }

/*    get currentID() {
        return this.currentid = this.selectedobj$.asObservable();
    }*/

    public ngOnDestroy(): void {
        this.broadcastsubscription.unsubscribe();
    }

}
