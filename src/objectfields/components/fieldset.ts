import {Component, Input, ViewChild, ViewContainerRef, AfterViewInit, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'field-set',
    templateUrl: './app/objectfields/templates/fieldset.html',
    host:{
        '[class.slds-form-element]' : 'true'
    }
})
export class fieldSet implements OnInit{
    @Input() fieldset: string = '';
    @Input() fieldsetconfig: any = {};
    fieldsetItems: Array<any> = [];

    constructor(private metadata: metadata) {
    }

    ngOnInit(){
        this.fieldsetItems = this.metadata.getFieldSetFields(this.fieldset);
    }

    getFormClass(){
        if(this.fieldsetconfig.formclass)
            return this.fieldsetconfig.formclass;
    }
}