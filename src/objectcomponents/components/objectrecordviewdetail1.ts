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
import {navigation} from '../../services/navigation.service';

//var System = require('../../../../node_modules/systemjs/dist/system.js');

@Component({
    selector: 'object-recordview-detail-1',
    templateUrl: './app/objectcomponents/templates/objectrecordviewdetail1.html'

})
export class ObjectRecordViewDetail1 implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('contentcontainer', {read: ViewContainerRef}) contentcontainer: ViewContainerRef;
    initialized: boolean = false;
    componentRefs: any = [];
    componentSubscriptions: Array<any> = [];
    listViewDefs: any = [];
    componentSets: any = {};


    constructor( private metadata: metadata, private model: model, private elementRef: ElementRef ) {

    }

    ngOnInit(){

        if (this.initialized)
            this.buildContainer();

    }

    ngOnDestroy(){
        for (let component of this.componentRefs) {
            component.destroy();
        }

        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }


    buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetail1', this.model.module);

        if (componentconfig.main) {
            for (let view of this.metadata.getComponentSetObjects(componentconfig.main)) {
                this.metadata.addComponent(view.component, this.contentcontainer).subscribe(componentRef => {
                    componentRef.instance['componentconfig'] = view.componentconfig;
                    this.componentRefs.push(componentRef);
                })
            }
        }
    }
}