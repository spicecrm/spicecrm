/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {favorite} from '../../services/favorite.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'object-recordview',
    templateUrl: './src/objectcomponents/templates/objectrecordview.html',
    providers: [model]

})
export class ObjectRecordView implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('headercontainer', {read: ViewContainerRef}) private headercontainer: ViewContainerRef;
    @ViewChild('maincontainer', {read: ViewContainerRef}) private maincontainer: ViewContainerRef;
    private moduleName: any = '';
    private initialized: boolean = false;
    private componentRefs: any = [];
    private componentSubscriptions: Array<any> = [];
    private listViewDefs: any = [];
    private componentSets: any = {};

    constructor(
        private broadcast: broadcast,
        private navigation: navigation,
        private activatedRoute: ActivatedRoute,
        private metadata: metadata,
        private componentFactoryResolver: ComponentFactoryResolver,
        private model: model,
        private favorite: favorite,
        private elementRef: ElementRef
    ) {
        this.componentSubscriptions.push(this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        }));

    }

    public ngOnInit(){
        this.moduleName = this.activatedRoute.params['value'].module;

        // set theenavigation paradigm
        this.navigation.setActiveModule(this.moduleName);

        // get the bean details
        this.model.module = this.moduleName;
        this.model.id = this.activatedRoute.params['value'].id;

        // set data to the FAV service
        this.favorite.enable(this.model.module, this.model.id);

        this.model.getData(true, 'detailview', true, true).subscribe(data => {
            this.navigation.setActiveModule(this.moduleName, this.model.id, data.summary_text);

        });

        if (this.initialized)
            this.buildContainer();

    }

    public ngOnDestroy(){
        for (let component of this.componentRefs) {
            component.destroy();
        }

        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }

    public ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {

            case 'model.save':
                if (this.model.module === message.messagedata.module && this.model.id === message.messagedata.id) {
                    this.model.data = message.messagedata.data;
                }
                break;
        }
    }

    private buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordView', this.moduleName);

        if (componentconfig.header) {
            for (let view of this.metadata.getComponentSetObjects(componentconfig.header)) {
                this.metadata.addComponent(view.component, this.headercontainer).subscribe(componentRef => {
                    componentRef.instance.componentconfig = view.componentconfig;
                    this.componentRefs.push(componentRef);
                });
            }
        }

        if (componentconfig.main) {
            for (let view of this.metadata.getComponentSetObjects(componentconfig.main)) {
                this.metadata.addComponent(view.component, this.maincontainer).subscribe(componentRef => {
                    componentRef.instance.componentconfig = view.componentconfig;
                    this.componentRefs.push(componentRef);
                })
            }
        }

    }

}