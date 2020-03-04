/**
 * @module services
 */
import {Injectable, EventEmitter} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {Observable, Subject, of} from "rxjs";
import {broadcast} from "./broadcast.service";
import {configurationService} from "./configuration.service";
import {CanActivate} from "@angular/router";
import {modal} from "./modal.service";
import {language} from "./language.service";

declare var _: any;

export interface routeObject {
    path: string;
    params: any;
}

export interface objectTab {
    path: string;
    params: any;
    subtabs: routeObject[];
}

@Injectable()
export class navigation {

    public activeModule$: EventEmitter<string>;

    public activeModule: string = "Home";
    public hasSubTabs: string;
    private activeId: string = "";

    private modelsEditing: any[] = [];

    /**
     * The array where all existing models are registered.
     */
    public modelregister: any[] = [];

    /**
     * A counter to give every registered model a unique id.
     * This id is needed to unregister a model.
     */
    private modelregisterCounter = 0;

    constructor(private title: Title, private broadcast: broadcast, private configurationService: configurationService) {
        this.activeModule$ = new EventEmitter<string>();

        // subscribe to the save event .. so when the title for the current displayed bean changes update the browser title
        this.broadcast.message$.subscribe(message => this.handleMessage(message));

        // setTimeout is a workaround, in simple js applications without angular it works without it.
        window.setTimeout( () => {
            addEventListener( 'beforeunload', ( e: BeforeUnloadEvent ) => {
                if ( this.anyDirtyModel() ) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            } );
        }, 1 );

    }

    public setActiveModule(activemodule: string, id: string = "", summaryText: string = ""): void {
        this.activeModule = activemodule;
        this.activeId = id;
        this.activeModule$.emit(activemodule);

        this.title.setTitle(this.systemName + " " + (summaryText !== "" ? summaryText : activemodule));
    }

    private get systemName() {
        return this.configurationService.data.display ? this.configurationService.data.display : "SpiceCRM";
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {
            case "model.save":
                if (this.activeModule === message.messagedata.module && this.activeId === message.messagedata.id) {
                    this.title.setTitle(this.systemName + " " + message.messagedata.data.summary_text);
                }
                break;
            default:
                break;
        }
    }

    public addModelEditing(module, id, summary_text) {
        this.modelsEditing.push({module, id, summary_text});
    }

    public removeModelEditing(module, id) {
        let i = 0;
        this.modelsEditing.some(model => {
            if (model.id == id && model.module == module) {
                this.modelsEditing.splice(i, 1);
                return true;
            }
            i++;
        });
    }

    get editing() {
        return this.modelsEditing.length > 0;
    }

    public discardAllChanges() {
        this.modelsEditing = [];
    }

    /**
     * Register a model.
     * @param model The model.
     * @return Model id.
     */
    public registerModel( model ): number {
        let id = ++this.modelregisterCounter;
        this.modelregister.push({ id: id, model: model });
        return id;
    }

    /**
     * Unregister a model.
     * @param id The model id.
     */
    public unregisterModel( id: number ): void {
        this.modelregister.some( ( model, i ) => {
            if ( model.id === id ) {
                this.modelregister.splice( i, 1 );
                return true;
            }
        });
    }

    /**
     * Checks if there is any model with dirty fields (unsaved).
     */
    public anyDirtyModel(): boolean {
        if ( this.modelregister.some( model => {
            if ( model.model.isDirty() ) {
                return true;
            }
        })) {
            return true;
        } else return false;
    }

    /*
    for the route management
     */
    public activeObject: string = '';
    public activeRoute: any = {};
    public activeRoute$: EventEmitter<any> = new EventEmitter<any>();
    public objectTabs: objectTab[] = [];
    public objectSubTabs: routeObject[] = [];
    public routercontainer: any;

    public handleNavigation(routeParams, routeConfig) {

        this.activeRoute = {
            path: routeConfig.path,
            params: {...routeParams}
        };
        this.activeRoute$.emit(this.activeRoute);

        if (routeConfig.path == 'module/:module') {
            this.activeObject = routeParams.module;
            this.objectSubTabs = [];
        } else {

            // check if we need to open a new tab
            for (let objectTab of this.objectTabs) {
                if (objectTab.path == this.activeRoute.path && _.isEqual(objectTab.params, this.activeRoute.params)) {
                    return;
                }
            }

            // if we are here we did not find an active tab for the route and add a new tab
            this.objectTabs.unshift({
                path: routeConfig.path,
                params: {...routeParams},
                subtabs: []
            });
        }


    }

    public closeObjectTab(object) {
        let i = 0;
        for (let objectTab of this.objectTabs) {
            if (_.isEqual(objectTab, object)) {
                this.objectTabs.splice(i, 1);
                return;
            }
            i++;
        }
    }

    public checkActiveRoute(object) {
        return _.isEqual(object, this.activeRoute);
    }

}

@Injectable()
export class canNavigateAway implements CanActivate {
    constructor(private navigation: navigation, private modal: modal, private language: language) {
    }

    public canActivate(route, state): Observable<boolean> {

        let isToWarn = false;
        for ( let model of this.navigation.modelregister ) {
            if ( !model.model.isGlobal && model.model.isDirty() ) {
                isToWarn = true;
                break;
            }
        }

        if ( isToWarn ) {
            let retSubject = new Subject<boolean>();
            this.modal.confirm(this.language.getLabel('MSG_NAVIGATIONSTOP','', 'long'), this.language.getLabel('MSG_NAVIGATIONSTOP')).subscribe(retval => {
                if (retval) {
                    this.navigation.discardAllChanges();
                }
                retSubject.next(retval);
                retSubject.complete();
            });
            return retSubject.asObservable();
        } else {
            return of(true);
        }
    }
}
