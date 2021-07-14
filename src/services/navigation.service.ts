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
 * @module services
 */
import {Injectable, EventEmitter} from "@angular/core";
import {Md5} from "ts-md5";
import {Title} from "@angular/platform-browser";
import {Observable, Subject, of, BehaviorSubject, Subscription} from "rxjs";
import {broadcast} from "./broadcast.service";
import {configurationService} from "./configuration.service";
import {Router, ActivatedRouteSnapshot, CanActivate, Params, Route, UrlSegment} from "@angular/router";
import {modal} from "./modal.service";
import {language} from "./language.service";
import {metadata} from "./metadata.service";
import {session} from "./session.service";
import {helper} from "./helper.service";
import {socket} from "./socket.service";
import {backend} from "./backend.service";
import {userpreferences} from "./userpreferences.service";
import {SocketEventI} from "./interfaces.service";

declare var _: any;

export interface routeObject {
    path: string;
    params: any;
}

/**
 * the object for the tab in the tabbed view
 */
export interface objectTab {
    /**
     * a unique id for the tab
     */
    id: string;

    /**
     * the parent tab if we have tabbed navigfation with subtabs
     */
    parentid?: string;

    /**
     * the url for the tab
     */
    url?: string;

    /**
     * the route path for the tab required for matching
     */
    path: string;

    /**
     * the route params object
     */
    params: any;

    /**
     * inidcates if the tab is pinned
     */
    pinned: boolean;

    /**
     * indicates tha the tab is the active one
     */
    active: boolean;

    /**
     * the display name for the tab ... this is sent back by the container populating the navigation tab service
     */
    displayname?: string;

    /**
     * a module for the tab .. also sent back by the navigation tab service to render an icon for the module in the tab
     */
    displaymodule?: string;

    /**
     * a separate icon for the tab
     */
    displayicon?: string;

    /**
     * if subtabs are enabled on the tab
     */
    enablesubtabs: boolean;

}

/**
 * defines the info that can be set on a tab
 */
export interface objectTabInfo {
    displayname: string;
    displaymodule?: string;
    displayicon?: string;
}

@Injectable()
export class navigation {

    /**
     * determines the navigatioon paradigm if set to tabbed or simple
     */
    public navigationparadigm: 'simple' | 'tabbed' | 'subtabbed' = 'tabbed';

    /**
     * determines the navigatioon paradigm if set to tabbed or simple
     */
    private enforcednavigationparadigm: boolean = false;

    /**
     * the current active module ...
     * ToDo: remove
     */
    public activeModule: string = "Home";

    /**
     * an event emitter when the active module changes
     * ToDo: remove
     */
    public activeModule$: EventEmitter<string>;


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

    /**
     * the current active Route
     */
    public activeRoute: routeObject;


    /**
     * a behaviour subject with the active route
     */
    // public activeRoute$: BehaviorSubject<routeObject>;


    /**
     * emits when the active tab is changed
     */
    public activeTab$: BehaviorSubject<string>;

    /*
    for the route management
     */
    public activeObject: string = '';

    /**
     * the main tabs content in terms of route and params
     */
    public maintab: objectTab = {
        path: undefined,
        params: undefined,
        id: 'main',
        active: true,
        pinned: false,
        enablesubtabs: false
    };

    /**
     * holds the object tabs in the tabbed navigation mode
     */
    public objectTabs: objectTab[] = [];

    /**
     * emits whenever an object tab change is happening
     */
    public objectTabsChange$: EventEmitter<boolean> = new EventEmitter<boolean>();


    /**
     * holds the various subscriptions
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(
        private title: Title,
        private session: session,
        private modal: modal,
        private language: language,
        private broadcast: broadcast,
        private configurationService: configurationService,
        private metadata: metadata,
        private helper: helper,
        private socket: socket,
        private backend: backend,
        private userpreferences: userpreferences,
        private router: Router
    ) {
        this.activeModule$ = new EventEmitter<string>();

        // subscribe to the save event .. so when the title for the current displayed bean changes update the browser title
        this.broadcast.message$.subscribe(message => this.handleMessage(message));


        // setTimeout is a workaround, in simple js applications without angular it works without it.
        window.setTimeout(() => {
            addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
                if (this.anyDirtyModel()) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            });
        }, 1);

        // create the bheavious subject and set to the main tab
        this.activeTab$ = new BehaviorSubject('main');

        this.setTabTitle();
    }

    private setSessionData() {
        this.session.setSessionData('navigation', {main: this.maintab, tabs: this.objectTabs});
    }


    /**
     * gets the current active tab object
     */
    get activeTabObject(): objectTab {
        if (this.maintab.active) return this.maintab;

        return this.objectTabs.find(tab => tab.active);
    }

    /**
     * gets the current active tab
     */
    get activeTab() {
        if (this.maintab.active) return 'main';

        return this.objectTabs.find(tab => tab.active)?.id;
    }

    /**
     * sets one tab as active in the maintab or object tabs array
     *
     * @param tabid
     */
    set activeTab(tabid) {
        // clear the current active tab
        if (this.maintab.active) {
            this.maintab.active = false;
        } else {
            let tab = this.objectTabs.find(tab => tab.active);
            if (tab) tab.active = false;
        }

        // set the new active tab
        if (tabid == 'main') {

            this.maintab.active = true;
            this.activeTab$.next('main');

            // set the browser location accordingly without triggering the router
            // this.location.replaceState(this.maintab.url);
            this.router.navigate([this.maintab.url]);
        } else {
            let tab = this.objectTabs.find(tab => tab.id == tabid);
            if (tab) {
                this.setTabActive(tab);
            }
        }

        /**
         * set the session data
         */
        this.setSessionData();
    }

    private setTabActive(tab) {
        tab.active = true;


        // emit the new active tab
        this.activeTab$.next(tab.id);

        // sets the tab title
        this.setTabTitle();

        // set the browser location accordingly without triggering the router
        this.router.navigate([tab.url]);
        // this.location.replaceState(tab.url);
    }

    /**
     * returns the tabs with the tabid as the parenttab
     *
     * @param tabid
     */
    public getSubTabs(tabid) {
        // if tabid is undefined return an empty array as if the filter woudl have returned no results
        if (!tabid) return [];

        // filter the object tab array
        return this.objectTabs.filter(tab => tab.parentid == tabid);
    }

    /**
     * gets the current active tab
     */
    get displayTab() {
        // return the main tab
        if (this.maintab.active) return 'main';

        // return the object tab
        let objectTab = this.objectTabs.find(tab => tab.active);
        return objectTab?.id;
    }

    /**
     * sets the current active module
     *
     * @param activemodule
     * @param id
     * @param summaryText
     */
    public setActiveModule(activemodule: string, id: string = "", summaryText: string = ""): void {
        this.activeModule = activemodule;
        // this.activeId = id;
        this.activeModule$.emit(activemodule);

        this.title.setTitle(this.systemName + " / " + (summaryText !== "" ? summaryText : activemodule));
    }

    private get systemName() {
        return this.configurationService.systemName;
    }

    /**
     * call to enforce a navigation paradigm
     *
     * @param paradigm
     */
    public enforceNavigationParadigm(paradigm: 'simple' | 'tabbed' | 'subtabbed') {
        this.enforcednavigationparadigm = true;
        this.navigationparadigm = paradigm;
    }


    /**
     * sets the model name if the current bean is in focus and the bean is saved
     * @param message
     */
    private handleMessage(message: any) {
        switch (message.messagetype) {
            case "loader.completed":
                // once the laoder completed set the paradigm
                if (!this.enforcednavigationparadigm && message.messagedata == 'loadUserData') {
                    let navparadigm = this.userpreferences.getPreference('navigation_paradigm');
                    this.navigationparadigm = navparadigm ? navparadigm : 'tabbed';
                    this.session.setSessionData('navigation_paradigm', this.navigationparadigm);
                }
                break;
            case 'userpreferences.save':
                // handle the paradigm Change
                let nvp = this.userpreferences.getPreference('navigation_paradigm');
                if (!this.enforcednavigationparadigm && nvp && this.navigationparadigm != nvp) {
                    if (nvp == 'simple' && this.navigationparadigm != nvp) {
                        this.objectTabs = [];
                        this.router.navigate(['module/Home']);
                    } else if (nvp != 'simple' && this.navigationparadigm != nvp) {
                        this.router.navigate(['module/Home']);
                    }
                    this.navigationparadigm = nvp;
                    this.session.setSessionData('navigation_paradigm', this.navigationparadigm);
                }
                break;
            case 'logout':
                this.objectTabs = [];
                this.maintab = {
                    path: undefined,
                    params: undefined,
                    id: 'main',
                    pinned: false,
                    active: true,
                    enablesubtabs: false
                };

                // unsubscribe from all subscriptions
                this.subscriptions.unsubscribe();

                break;
            case 'login':
                // check if we have session data
                let snvp = this.session.getSessionData('navigation_paradigm');
                if (snvp) {
                    this.navigationparadigm = snvp;
                }
                let sessiondata = this.session.getSessionData('navigation');
                if (!_.isEmpty(sessiondata)) {
                    this.maintab = sessiondata.main;
                    this.objectTabs = sessiondata.tabs;

                    // check if we have a module set in the maintab
                    if (this.maintab.params?.module) this.activeModule = this.maintab.params.module;

                    // check for the activetab
                    this.activeTab$.next(this.activeTab);

                    // set the tab title
                    this.setTabTitle();
                }

                // Subscribe to the Socket
                this.subscriptions.add(
                    this.socket.initializeNamespace('module').subscribe(e =>
                        this.handleSocketEvents(e)
                    )
                );

                break;
            case 'model.delete':
                // find matching tabs and close the tab
                for(let tab of this.objectTabs.filter(t => t.params.module == message.messagedata.module && t.params.id == message.messagedata.id)){
                    this.closeObjectTab(tab.id, true);
                }
                break;
            default:
                break;
        }
    }


    /**
     * handle socket event
     * @param event
     * @private
     */
    private handleSocketEvents(event: SocketEventI) {
        switch (event.type) {
            case 'update':
                if (event.data.sessionId != Md5.hashStr(this.session.authData.sessionId) && this.modelregister.find(m => m.model.module == event.data.module && m.model.id == event.data.id && !m.model.isEditing)) {
                    this.backend.get(event.data.module, event.data.id).subscribe(modelData => {
                        let models = this.modelregister.filter(m => m.model.module == event.data.module && m.model.id == event.data.id && !m.model.isEditing);
                        for (let model of models) {
                            model.model.data = {...modelData};
                            model.model.data$.next(model.model.data);
                        }

                        // for all we did not catch broadcast the model save event
                        this.broadcast.broadcastMessage('model.save', {
                            id: event.data.id,
                            module: event.data.module,
                            data: modelData
                        });
                    });
                }

                // check that we have a match on id and moduel and come from another session
                /*
                if(event.data.id == this.id && event.data.module == this.module && event.data.sessionId != this.session.authData.sessionId) {
                    if (!this.isEditing) {
                        this.getData(false, '', false);
                    }
                }
                */
                break;
        }
    }

    /**
     * adds a model as editing in the currrent scope
     * @param module
     * @param id
     * @param summary_text
     */
    public addModelEditing(module, id, summary_text) {
        this.modelsEditing.push({module: module, id: id, summary_text: summary_text, tabid: this.activeTab});
    }

    /**
     * removes a model from teh edit mode
     *
     * @param module
     * @param id
     */
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

    /**
     * returns if ther are any models in edit mode
     */
    get editing() {
        return this.modelsEditing.length > 0;
    }

    /**
     * remove all editing models and not prompt the user again
     */
    public discardAllChanges() {
        this.modelsEditing = [];
    }

    /**
     * Register a model.
     * @param model The model.
     * @return Model id.
     */
    public registerModel(model): number {
        let id = ++this.modelregisterCounter;
        this.modelregister.push({id: id, model: model, tabid: this.activeTab});

        this.socket.joinRoom('module', Md5.hashStr(`${model.module}:${model.id}`).toString());

        return id;
    }

    /**
     * Unregister a model.
     * @param id The model id.
     */
    public unregisterModel(id: number): void {
        let modelIndex = this.modelregister.findIndex(m => m.id == id);
        if (modelIndex >= 0) {
            let module = this.modelregister[modelIndex].model.module;
            let id = this.modelregister[modelIndex].model.id;
            if (this.modelregister.filter(m => m.id != id && m.model.module == module && m.model.id == id).length == 0) {
                this.socket.leaveRoom('module', Md5.hashStr(`${module}:${id}`).toString());
            }
            this.modelregister.splice(modelIndex, 1);
        }
    }

    /**
     * returns the stored data from a mode that is registered
     *
     * @param id
     * @param module
     */
    public getRegisteredModel(id: string, module: string) {
        return this.modelregister.find(model => model.model.id == id && model.model.module == module)?.model;
    }

    /**
     * Checks if there is any model with dirty fields (unsaved).
     */
    public anyDirtyModel(tabid?: string): boolean {
        if (this.modelregister.some(model => {
            if (model.model.isDirty() && (!tabid || (tabid && (model.tabid == tabid || this.parentTabId(tabid) == tabid)))) {
                return true;
            }
        })) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * get the parent tab id
     *
     * @param tabId
     */
    private parentTabId(tabId) {
        // if we are on main no parenttab id can be found
        if (tabId == 'main') return null;

        // otherwise search tabs
        return this.objectTabs.find(tab => tab.id == tabId).parentid;
    }

    /**
     * tries to match the route path from an pobjecttab to the path from a routedata set
     *
     * @param objectTab
     * @param routeData
     */
    private matchPath(objectTab, routeData) {
        // check one .. path are the same
        if (objectTab.path.replace('tab/:tabid/', '') == routeData.path) return true;

        // check two we found it based on the reference path
        if (objectTab.path.replace('tab/:tabid/', '') == routeData.referencepath) return true;

        // check if the current path has a reference and replace back
        let objectroute = this.metadata.getRouteDetails(objectTab.path.replace('tab/:tabid/', ''));

        // check three if the matched main path is a match
        if (objectroute.referencepath && objectroute.referencepath == routeData.path) return true;

        // check foure if the matched main path is a match
        if (objectroute.referencepath && objectroute.referencepath == routeData.referencepath) return true;

        return false;
    }

    /**
     * builds the url from the segment
     *
     * @param segments
     */
    private buildUrl(segments: UrlSegment[]): string {
        let url = '';

        segments.forEach(segment => {
            if (url != '') url += '/';
            url += segment.path;
        });

        return url;
    }


    /**
     * matches two route params ignoring the tabid if the match is different
     *
     * @param objectparams
     * @param routeparams
     */
    private matchRouteParams(objecttab: objectTab, routeparams: any): boolean {
        if (_.isEqual(objecttab.params, routeparams)) return true;

        // if not check if the object has a tabid and that matches the objecttab
        if (routeparams.tabid && routeparams.tabid == objecttab.id) {
            let clonedRouteparams = {...routeparams};
            delete (clonedRouteparams.tabid);
            return _.isEqual(objecttab.params, clonedRouteparams);
        }

        // if not return false
        return false;
    }

    /**
     * handles the navigation
     *
     * @param routeParams
     * @param routeConfig
     * @param routeSnapshot
     */
    public handleNavigation(routeParams: Params, routeConfig: Route, routeSnapshot: ActivatedRouteSnapshot) {

        // get the route data replacing the tab and tabid if this is passed in as part of the route
        let routeData = this.metadata.getRouteDetails(routeConfig.path.replace('tab/:tabid/', ''));

        if (routeData?.target == 'M' || this.navigationparadigm == 'simple') {
            // if we just navigate to the maintab .. no checks
            if (this.maintab.path == routeConfig.path && _.isEqual(this.maintab.params, routeParams)) {
                this.activeTab = 'main';
                return;
            }

            // otherwise we navigate away and need to check for dirty model in the main tab
            this.mainTabChangeCheck().subscribe(response => {
                if (response) {
                    this.maintab.path = routeConfig.path;
                    this.maintab.params = {...routeParams};
                    this.maintab.url = this.buildUrl(routeSnapshot.url);
                    this.activeTab = 'main';

                    // check if we have a module in the route
                    // ToDo: this need to be removed ... legacy from the old simpla tab nav
                    if (this.maintab.params?.module) {
                        this.activeModule = this.maintab.params.module;
                    }
                } else {
                    // set the location back to the maintab url
                    this.router.navigate([this.maintab.url]);
                }
            });
        } else {
            for (let objectTab of this.objectTabs) {
                if (this.matchPath(objectTab, routeData) && this.matchRouteParams(objectTab, routeParams)) {
                    // set the path since the path might be changed dues to the reference path of routes for the tabbed navigation
                    // but do not change it when the only difference is the tabid
                    // that happens if the same object is clicked in a link on a subtab
                    if (objectTab.path != routeConfig.path.replace('tab/:tabid/', '')) {
                        objectTab.path = routeConfig.path;
                        objectTab.url = this.buildUrl(routeSnapshot.url);
                    }
                    this.activeTab = objectTab.id;
                    return;
                }
            }

            // chdeck if we should open in a subtab and the parenttab exists
            let parentTab: objectTab;
            if (this.navigationparadigm == 'subtabbed' && routeParams.tabid) {
                parentTab = this.objectTabs.find(tab => tab.id == routeParams.tabid);
            }

            // add the subtab
            let tabid = this.helper.generateGuid();
            this.objectTabs.unshift({
                id: tabid,
                parentid: parentTab && parentTab.enablesubtabs ? parentTab.id : undefined,
                path: routeConfig.path,
                url: this.buildUrl(routeSnapshot.url),
                params: {...routeParams},
                active: false,
                pinned: false,
                enablesubtabs: routeData.subtabs == '1' ? true : false
            });
            // set the current tab as active tab
            this.activeTab = tabid;

            // emit the change
            this.objectTabsChange$.emit(true);
        }

    }

    /**
     * sets the tab with the passed in ID as active tab
     *
     * @param tabid
     */
    public setActiveTab(tabid) {
        this.activeTab = tabid;
        this.activeTab$.next(this.activeTab);

        // set the tab title
        this.setTabTitle();
    }

    private setTabTitle() {
        // sets the browser title
        let tab = this.getTabById(this.activeTab);

        let displayname = '';
        if (tab.displayname) {
            displayname = tab.displayname;
        } else if (tab.displaymodule) {
            displayname = this.language.getModuleName(tab.displaymodule);
        } else if (this.activeModule) {
            displayname = this.language.getModuleName(this.activeModule);
        }

        this.title.setTitle(this.systemName + (displayname ? ` / ${displayname}` : ''));
    }

    /**
     * clones a tab and adds it to the scope
     *
     * @param tabid
     */
    public cloneTab(tabid) {
        let activeTab = this.getTabById(tabid);
        let newtabid = this.helper.generateGuid();
        this.objectTabs.unshift({
            id: newtabid,
            parentid: undefined,
            path: activeTab.path,
            url: activeTab.url,
            params: {...activeTab.params},
            active: false,
            pinned: false,
            enablesubtabs: activeTab.enablesubtabs
        });
        this.activeTab = newtabid;
    }

    /**
     * set the tab info
     *
     * @param tabid
     * @param displayname
     * @param displaymodule
     */
    public settabinfo(tabid: string, tabinfo: objectTabInfo) {
        if (tabid == 'main') {
            if (tabinfo.displaymodule) {
                this.setActiveModule(tabinfo.displaymodule);
            }
        } else {
            let tab = this.getTabById(tabid);
            if (tab) {
                tab.displayname = tabinfo.displayname;
                tab.displaymodule = tabinfo.displaymodule;
                tab.displayicon = tabinfo.displayicon;
                this.objectTabsChange$.emit(true);
            }
        }
    }

    /**
     * gets the tab object for the current id
     * @param tabid
     */
    public getTabById(tabid) {
        // if we have the maintab .. return the maintab
        if (tabid == 'main') return this.maintab;

        // otherwise find and return the tab from the obejcttabs
        return this.objectTabs.find(tab => tab.id == tabid);
    }

    /**
     * checks if the main tab has changes. if yes propmts teh user and returns the response as boolean as observable
     */
    private mainTabChangeCheck(): Observable<boolean> {
        if (this.anyDirtyModel('main')) {
            let retSubject = new Subject<boolean>();
            this.modal.confirm(this.language.getLabel('MSG_NAVIGATIONSTOP', '', 'long'), this.language.getLabel('MSG_NAVIGATIONSTOP')).subscribe(retval => {
                if (retval) {
                    retSubject.next(true);
                } else {
                    retSubject.next(false);
                }
                retSubject.complete();
            });
            return retSubject.asObservable();
        } else {
            return of(true);
        }
    }

    /**
     * closes a tab
     *
     * * @param tabid
     */
    public closeObjectTab(tabid, force: boolean = false) {
        // not for the main tab
        if (tabid == 'main') return;

        // check dirty tab
        if (!force && this.anyDirtyModel(tabid)) {
            this.modal.confirm(this.language.getLabel('MSG_CLOSETAB', '', 'long'), this.language.getLabel('MSG_CLOSETAB')).subscribe(retval => {
                if (retval) {
                    this.unsetObjectTab(tabid);
                }
            });
        } else {
            this.unsetObjectTab(tabid);
        }
    }

    /**
     * finds and unsets the obejct tab based on the id
     *
     * @param tabid
     */
    private unsetObjectTab(tabid) {
        let index = this.objectTabs.findIndex(tab => tab.id == tabid);
        if (index >= 0) {

            // check if this is the active tab or a subtab is active that has the curretn tab as parent
            // if yes set main as the active tab
            if (this.objectTabs[index].active || this.objectTabs.find(tab => tab.active)?.parentid == tabid) {
                // if we have a parent tab navigate to that .. otherwise to the main tab
                if (this.objectTabs[index].parentid) {
                    this.setActiveTab(this.objectTabs[index].parentid);
                    // this.router.navigate([this.objectTabs.find(tab => tab.id == this.objectTabs[index].parentid).url]);
                } else {
                    this.setActiveTab('main');
                    // this.router.navigate([this.maintab.url]);
                }
            }

            // slice the object tab array
            this.objectTabs.splice(index, 1);

            // remove all records pointinmg to editale models

            // tslint:disable:no-conditional-assignment
            let modelIndex = -1;
            while ((modelIndex = this.modelregister.findIndex(model => model.tabid == tabid)) >= 0) {
                this.modelregister.splice(modelIndex, 1);
            }

            // find any tab that has the id as a parent id
            index = this.objectTabs.length - 1;
            while (index >= 0) {
                // for (let objectTab of this.objectTabs){
                // if the id matched splice the array otherwise increase the index
                let objectTab = this.objectTabs[index];
                if (objectTab.parentid == tabid) {
                    this.objectTabs.splice(index, 1);

                    // tslint:disable:no-conditional-assignment
                    let modelIndex = -1;
                    while ((modelIndex = this.modelregister.findIndex(model => model.tabid == tabid)) >= 0) {
                        this.modelregister.splice(modelIndex, 1);
                    }
                }
                index--;

            }

            // emit the change
            this.objectTabsChange$.emit(true);

            // set to the session
            this.setSessionData();
        }
    }

    public checkActiveRoute(object) {
        return _.isEqual(object, this.activeRoute);
    }

}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class canNavigateAway implements CanActivate {
    constructor(private navigation: navigation, private modal: modal, private language: language) {
    }

    public canActivate(route, state): Observable<boolean> {

        let isToWarn = false;
        for (let model of this.navigation.modelregister) {
            if (!model.model.isGlobal && model.model.isDirty()) {
                isToWarn = true;
                break;
            }
        }

        if (isToWarn) {
            let retSubject = new Subject<boolean>();
            this.modal.confirm(this.language.getLabel('MSG_NAVIGATIONSTOP', '', 'long'), this.language.getLabel('MSG_NAVIGATIONSTOP')).subscribe(retval => {
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
