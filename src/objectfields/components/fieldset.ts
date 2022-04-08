/**
 * @module ObjectFields
 */
import {Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'field-set',
    templateUrl: '../templates/fieldset.html',
    host:{
        '[class.slds-form-element]' : 'true'
    }
})
export class fieldSet implements OnInit{
    @Input() fieldset: string = '';
    @Input() fieldsetconfig: any = {};
    fieldsetItems: Array<any> = [];

    constructor(public metadata: metadata) {
    }

    ngOnInit(){
        this.fieldsetItems = this.metadata.getFieldSetItems(this.fieldset);
    }

    getFormClass(){
        if(this.fieldsetconfig.formclass)
            return this.fieldsetconfig.formclass;
    }
}
