/**
 * @module ModuleGroupware
 */
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {navigation} from "../../../services/navigation.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {broadcast} from "../../../services/broadcast.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

/**
 * Outlook add-in detail pane showing a list of beans that use the email addresses found in the email.
 * In case there is just one such bean, the details of it will be shown.
 */
@Component({
    selector: 'groupware-detail-pane-view',
    templateUrl: './src/include/groupware/templates/groupwaredetailpaneview.html',
    providers: [model]
})
export class GroupwareDetailPaneView implements AfterViewInit, OnDestroy{

    @ViewChild('header', {read: ViewContainerRef, static: true}) private header: ViewContainerRef;
    @ViewChild('main', {read: ViewContainerRef, static: true}) private main: ViewContainerRef;

    private initialized: boolean = false;
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
                if (this.model.module != route.params.module || this.model.id != route.params.id) {
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
        if(this.model.module && this.model.id){
            this.initialized = true;
            this.buildContainer();
        }
    }

    public ngOnDestroy() {
        this.componentSubscriptions.unsubscribe();
    }

    private buildContainer() {
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
