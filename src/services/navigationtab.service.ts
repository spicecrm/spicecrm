/**
 * @module services
 */
import {Injectable, EventEmitter} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {objectTabInfo, routeObject} from "./navigation.service";

declare var _: any;



@Injectable()
export class navigationtab {

    /**
     * the current active Route
     */
    public activeRoute: routeObject = {params: undefined, path: undefined};

    /**
     * a behaviour subject with the active route
     */
    public activeRoute$: BehaviorSubject<routeObject>;

    /**
     * the id of the tab that hosts the view
     */
    public tabid: string;

    /**
     * an event emitter for the display name of the tab
     */
    public tabinfo$: EventEmitter<objectTabInfo> = new EventEmitter<objectTabInfo>();

    constructor() {
        this.activeRoute$ = new BehaviorSubject(this.activeRoute);
    }

    /**
     * enables the tab to emit a name for the header tab
     *
     * @param name
     */
    public setTabInfo(tabinfo: objectTabInfo) {
        this.tabinfo$.emit(tabinfo);
    }

}
