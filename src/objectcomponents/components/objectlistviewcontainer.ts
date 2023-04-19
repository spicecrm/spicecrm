/**
 * @module ObjectComponents
 */
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';
import {broadcast} from '../../services/broadcast.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-listview-container',
    templateUrl: '../templates/objectlistviewcontainer.html'
})
export class ObjectListViewContainer implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef, static: true}) public container: ViewContainerRef;
    public moduleName: any = '';
    public initialized: boolean = false;
    public componentRefs: any = [];
    public componentSubscriptions: Subscription = new Subscription();

    constructor(public metadata: metadata, public broadcast: broadcast, public navigation: navigation, public navigationtab: navigationtab, private language: language) {
        // subscribe to route params.module changes
        this.componentSubscriptions.add(
            this.navigationtab.activeRoute$.subscribe(route=>{
                this.moduleName = route.params.module;

                // fallback in case we have a specific route then we assume the end of the route is the module
                if(!this.moduleName){
                    this.moduleName = route.path.split("/").pop();
                    this.navigationtab.activeRoute.params.module = this.moduleName;
                }

                this.navigationtab.setTabInfo({displaymodule: this.moduleName, displayname: this.metadata.getModuleDefs(this.moduleName).module_label});

                if (this.initialized) {
                    this.buildContainer();
                }
            })
        );

        // subscribe to applauncher.setrole
        this.componentSubscriptions.add(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));
    }

    public ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    public ngOnDestroy() {
        // destroy components
        for (let component of this.componentRefs) {
            component.destroy();
        }

        // unsubscribe from Observables
        this.componentSubscriptions.unsubscribe()
    }

    /*
    * @add ObjectListViewContainer components from componentConfig
    * @pass componentconfig to componentRef
    * @push componentRef to componentRefs
    */
    public buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        this.componentRefs = [];

        let componentconfig = this.metadata.getComponentConfig('ObjectListViewContainer', this.moduleName);
        for (let view of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(view.component, this.container).subscribe(componentRef => {
                if (view.componentconfig && Object.keys(view.componentconfig).length > 0) {
                    componentRef.instance.componentconfig = view.componentconfig;
                } else {
                    componentRef.instance.componentconfig = this.metadata.getComponentConfig(view.component, this.moduleName);
                }
                this.componentRefs.push(componentRef);
            });
        }
    }

    /*
    * @handle broadcast message
    * @param message: object
    * @buildContainer
    */
    public handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;
        }
    }
}
