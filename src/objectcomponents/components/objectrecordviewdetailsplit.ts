/**
 * @module ObjectComponents
 */

import {
    AfterViewInit,  Component,  ViewChild, ViewContainerRef,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';


@Component({
    selector: 'object-recordview-detail-split',
    templateUrl: './src/objectcomponents/templates/objectrecordviewdetailsplit.html'

})
export class ObjectRecordViewDetailsplit implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('leftcontainer', {read: ViewContainerRef}) leftcontainer: ViewContainerRef;
    @ViewChild('rightcontainer', {read: ViewContainerRef}) rightcontainer: ViewContainerRef;
    initialized: boolean = false;
    componentRefs: any = [];
    componentSubscriptions: Array<any> = [];
    listViewDefs: any = [];
    componentSets: any = {};
    componentconfig: any = {};


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

        if(!this.componentconfig.left || !this.componentconfig.right) {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetailsplit', this.model.module);
            if(!this.componentconfig.left && componentconfig.left)
                this.componentconfig.left = componentconfig.left;
            if(!this.componentconfig.right && componentconfig.right)
                this.componentconfig.right = componentconfig.right;
        }
        if (this.componentconfig.left) {
            for (let view of this.metadata.getComponentSetObjects(this.componentconfig.left)) {
                this.metadata.addComponent(view.component, this.leftcontainer).subscribe(componentRef => {
                    componentRef.instance['componentconfig'] = view.componentconfig;
                    this.componentRefs.push(componentRef);
                })
            }
        }

        if (this.componentconfig.right) {
            for (let view of this.metadata.getComponentSetObjects(this.componentconfig.right)) {
                this.metadata.addComponent(view.component, this.rightcontainer).subscribe(componentRef => {
                    componentRef.instance['componentconfig'] = view.componentconfig;
                    this.componentRefs.push(componentRef);
                })
            }
        }

    }
}