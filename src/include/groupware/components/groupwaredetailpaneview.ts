/**
 * @module ModuleGroupware
 */
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {navigation} from "../../../services/navigation.service";
import {broadcast} from "../../../services/broadcast.service";
import {navigationtab} from "../../../services/navigationtab.service";

/**
 * The pane shows the details customized for the oputlook add in
 */
@Component({
    selector: 'groupware-detail-pane-view',
    templateUrl: '../templates/groupwaredetailpaneview.html',
    providers: [model]
})
export class GroupwareDetailPaneView implements AfterViewInit, OnDestroy {

    /**
     * reference to the header container
     */
    @ViewChild('header', {read: ViewContainerRef, static: true}) public header: ViewContainerRef;

    /**
     * reference to the main container
     */
    @ViewChild('main', {read: ViewContainerRef, static: true}) public main: ViewContainerRef;

    /**
     * indicates that we have passed the view initialization and can render the view
     */
    public initialized: boolean = false;

    /**
     * the rendered componentes that need to be destroyed if we rerender
     */
    public componentRefs: any[] = [];

    /**
     * subscriptions that need to be unsubscribed in the on Destroy lifecycle hook
     */
    public componentSubscriptions: Subscription = new Subscription();

    constructor(public navigation: navigation,
                public navigationtab: navigationtab,
                public broadcast: broadcast,
                public metadata: metadata,
                public model: model) {

        // subsribe to the route
        this.componentSubscriptions.add(
            this.navigationtab.activeRoute$.subscribe(route => {
                this.setRouteData(route);
            })
        );

        // subscribe to the broacast message
        this.componentSubscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    /**
     * initialize and load based on the route data
     *
     * @param route
     */
    public setRouteData(route) {
        if (route.params.module && route.params.id && (this.model.module != route.params.module || this.model.id != route.params.id)) {
            // load the model
            // get the bean details
            this.model.module = route.params.module;
            this.model.id = route.params.id;
            this.model.getData(true, 'detailview', true, true).subscribe(data => {
                // this.navigation.setActiveModule(this.moduleName, this.model.id, data.summary_text);
                this.navigationtab.setTabInfo({displayname: data.summary_text, displaymodule: this.model.module});
            });

            if (this.initialized) {
                this.buildContainer();
            }
        }
    }

    /**
     * handles th ebroadcast message
     * ToDo: add the pinnable support here
     *
     * @param message
     */
    public handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;
        }
    }

    /**
     * initialize the view and render it
     */
    public ngAfterViewInit(): void {
        if (this.model.module && this.model.id) {
            this.initialized = true;
            this.buildContainer();
        }
    }

    /**
     * unsubscribe from all subscriptions
     */
    public ngOnDestroy() {
        this.componentSubscriptions.unsubscribe();
    }

    /**
     * load the config and build the container
     */
    public buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('GroupwareDetailPane', this.model.module);

        for (let view of this.metadata.getComponentSetObjects(componentconfig.header)) {
            this.metadata.addComponent(view.component, this.header).subscribe(componentRef => {
                componentRef.instance.componentconfig = view.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }

        for (let view of this.metadata.getComponentSetObjects(componentconfig.main)) {
            this.metadata.addComponent(view.component, this.main).subscribe(componentRef => {
                componentRef.instance.componentconfig = view.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }

    }
}
