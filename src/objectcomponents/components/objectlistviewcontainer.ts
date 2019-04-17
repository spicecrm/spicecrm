/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,  Component,  ViewChild, ViewContainerRef,
    OnDestroy
} from '@angular/core';
import { ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'object-listview-container',
    templateUrl: './src/objectcomponents/templates/objectlistviewcontainer.html'
})
export class ObjectListViewContainer implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
    moduleName: any = '';
    initialized: boolean = false;
    componentRefs: any = [];
    listViewDefs: any = [];
    fieldSet: string = '';
    listFields: Array<any> = [];
    componentSubscriptions: Array<any> = [];

    constructor(private activatedRoute: ActivatedRoute, private metadata: metadata, private broadcast: broadcast) {
        this.activatedRoute.params.subscribe(params => {
            this.moduleName = params['module'];
            if (this.initialized)
                this.buildContainer();
        });

        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));


    }

    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;

        }
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    ngOnDestroy() {
        // destroy components
        for (let component of this.componentRefs) {
            component.destroy();
        }

        // unsubscribe from Observables
        for (let componentSubscription of this.componentSubscriptions) {
            componentSubscription.unsubscribe();
        }
    }

    buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        this.componentRefs = [];

        let componentconfig = this.metadata.getComponentConfig('ObjectListViewContainer', this.moduleName);
        for (let view of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(view.component, this.container).subscribe(componentRef => {
                if (view.componentconfig && view.componentconfig.length > 0)
                    componentRef.instance['componentconfig'] = view.componentconfig;
                else
                    componentRef.instance['componentconfig'] = this.metadata.getComponentConfig(view.component, this.moduleName);
                this.componentRefs.push(componentRef);
            });
        }
    }

}