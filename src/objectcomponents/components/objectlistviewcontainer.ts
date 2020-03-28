/**
 * @module ObjectComponents
 */
import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'object-listview-container',
    templateUrl: './src/objectcomponents/templates/objectlistviewcontainer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectListViewContainer implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;
    private moduleName: any = '';
    private initialized: boolean = false;
    private componentRefs: any = [];
    private componentSubscriptions: any[] = [];

    constructor(private metadata: metadata, private broadcast: broadcast, private navigation: navigation, private navigationtab: navigationtab) {
        // subscribe to route params.module changes
        this.navigationtab.activeRoute$.subscribe(route=>{
            this.moduleName = route.params.module;
            if (this.initialized) {
                this.buildContainer();
            }
        });

        // subscribe to applauncher.setrole
        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
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
        for (let componentSubscription of this.componentSubscriptions) {
            componentSubscription.unsubscribe();
        }
    }

    /*
    * @add ObjectListViewContainer components from componentConfig
    * @pass componentconfig to componentRef
    * @push componentRef to componentRefs
    */
    private buildContainer() {
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
    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;
        }
    }
}
