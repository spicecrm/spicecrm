import {
    AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'object-recordview-container',
    templateUrl: './src/objectcomponents/templates/objectrecordviewcontainer.html',
    providers: [model]
})
export class ObjectRecordViewContainer implements OnDestroy {
    // @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
    private module: string = '';
    private id: string = '';
    private initialized: boolean = false;
    private componentset: string = '';

    private routeSubscribe: any = {};
    private componentSubscriptions: any[] = [];

    constructor(private navigation: navigation,
                private activatedRoute: ActivatedRoute,
                private metadata: metadata,
                private model: model,
                private broadcast: broadcast,
                private elementref: ElementRef) {

        this.componentSubscriptions.push(
            this.activatedRoute.params.subscribe(params => {
                this.module = params.module;
                this.id = params.id;

                // set theenavigation paradigm
                this.navigation.setActiveModule(this.module);

                this.buildContainer();
            })
        );
        this.componentSubscriptions.push(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    private handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;
        }
    }

    public ngOnDestroy() {
        // unsubscribe from Observables
        for (let componentSubscription of this.componentSubscriptions) {
            componentSubscription.unsubscribe();
        }
    }

    private buildContainer() {
        let componentconfig = this.metadata.getComponentConfig('ObjectRecordViewContainer', this.module);
        this.componentset = componentconfig.componentset;
        /*
        for (let view of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(view.component, this.container).subscribe(componentRef => {
                componentRef.instance.componentconfig = view.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
        */
    }
}
