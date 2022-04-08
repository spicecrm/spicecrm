/**
 * @module ObjectComponents
 */
import {
    AfterViewInit, Component, ElementRef, ViewChild, ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-recordview-container',
    templateUrl: '../templates/objectrecordviewcontainer.html',
    providers: [model]
})
export class ObjectRecordViewContainer implements OnDestroy, AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef, static: true}) public container: ViewContainerRef;
    public module: string = '';
    public id: string = '';
    public initialized: boolean = false;
    public componentset: string = '';
    public componentRefs: any[] = [];

    public componentSubscriptions: Subscription = new Subscription();

    constructor(public navigation: navigation,
                public navigationtab: navigationtab,
                public activatedRoute: ActivatedRoute,
                public metadata: metadata,
                public model: model,
                public broadcast: broadcast,
                public elementref: ElementRef) {

        this.componentSubscriptions.add(
            this.navigationtab.activeRoute$.subscribe(route => {
                if (this.module != route.params.module || this.id != route.params.id) {
                    this.module = route.params.module;
                    this.id = route.params.id;

                    if (this.initialized) {
                        this.buildContainer();
                    }
                }
            })
        );
        this.componentSubscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    public handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
                this.buildContainer();
                break;
        }
    }

    public ngAfterViewInit(): void {
        this.initialized = true;
        this.buildContainer();
    }

    public ngOnDestroy() {
        this.componentSubscriptions.unsubscribe();
    }

    public buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordViewContainer', this.module);
        this.componentset = componentconfig.componentset;

        for (let view of this.metadata.getComponentSetObjects(this.componentset)) {
            this.metadata.addComponent(view.component, this.container).subscribe(componentRef => {
                componentRef.instance.componentconfig = view.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }

    }
}
