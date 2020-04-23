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
    templateUrl: './src/objectcomponents/templates/objectrecordviewcontainer.html',
    providers: [model]
})
export class ObjectRecordViewContainer implements OnDestroy, AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;
    private module: string = '';
    private id: string = '';
    private initialized: boolean = false;
    private componentset: string = '';
    private componentRefs: any[] = [];

    private componentSubscriptions: Subscription = new Subscription();

    constructor(private navigation: navigation,
                private navigationtab: navigationtab,
                private activatedRoute: ActivatedRoute,
                private metadata: metadata,
                private model: model,
                private broadcast: broadcast,
                private elementref: ElementRef) {

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

    private handleMessage(message) {
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

    private buildContainer() {
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
