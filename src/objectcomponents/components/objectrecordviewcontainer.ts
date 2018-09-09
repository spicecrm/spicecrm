import {
    AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';

//var System = require('../../../../node_modules/systemjs/dist/system.js');

@Component({
    selector: 'object-recordview-container',
    templateUrl: './app/objectcomponents/templates/objectrecordviewcontainer.html',
    providers: [model]
})
export class ObjectRecordViewContainer implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
    module: string = '';
    id: string = '';
    initialized: boolean = false;
    componentRefs: Array<any> = [];

    routeSubscribe: any = {};
    componentSubscriptions: Array<any> = [];

    constructor(private navigation: navigation,
                private activatedRoute: ActivatedRoute,
                private metadata: metadata,
                private model: model,
                private broadcast: broadcast,
                private elementref: ElementRef) {

        this.routeSubscribe = this.activatedRoute.params.subscribe(params => {
            this.module = params['module'];
            this.id = params['id'];

            // console.log('activeRouteParams ', params);

            // set theenavigation paradigm
            this.navigation.setActiveModule(this.module);

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
        // destroy subcomponents
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

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordViewContainer', this.module);
        for (let view of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(view.component, this.container).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = view.componentconfig;
                this.componentRefs.push(componentRef);
            })
        }

    }
}