/**
 * @module ObjectComponents
 */
import { Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-record-fieldset-horizontal-list',
    templateUrl: './src/objectcomponents/templates/objectrecordfieldsethorizontallist.html'
})
export class ObjectRecordFieldsetHorizontalList implements OnInit{

    @Input()fieldset: string = '';
    fieldsetitems: Array<any> = [];

    constructor(private metadata: metadata, private model: model) {
    }

    ngOnInit(){
        this.fieldsetitems =  this.metadata.getFieldSetItems(this.fieldset);
    }

    isField(fieldsetitem){
        return fieldsetitem.field ? true : false;
    }


}