/**
 * @module ObjectComponents
 */

import { OnInit, ComponentFactoryResolver, Component, Input} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-record-details-tab-row',
    templateUrl: '../templates/objectrecorddetailstabrow.html'
})
export class ObjectRecordDetailsTabRow implements OnInit {
    // @ViewChild('fieldsetcontainer', {read: ViewContainerRef, static: true}) fieldsetcontainer: ViewContainerRef;

    initialized: boolean = false;
    componentconfig: any = {}
    componentRefs: any[] = [];
    rowFields: Array<any> = [];

    @Input() fieldset: string = '';

    constructor(public activatedRoute: ActivatedRoute, public metadata: metadata, public componentFactoryResolver: ComponentFactoryResolver, public model: model) {
        //if (this.initialized)
        //    this.buildContainer();
    }

    /*
    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }
    */

    ngOnInit(){
        this.rowFields = this.metadata.getFieldSetFields(this.fieldset['fieldset']);
    }

    getFieldSizeClass(){
        return 'slds-size--1-of-'+this.rowFields.length;
    }

    getFieldWidth(){
        return {
            width: Math.round(1 / this.rowFields.length * 100) + '%'
        }
    }

    showLabel(fieldConfig){
        if(fieldConfig.hidelabel === true)
            return false;
        else
            return true;
    }
}
