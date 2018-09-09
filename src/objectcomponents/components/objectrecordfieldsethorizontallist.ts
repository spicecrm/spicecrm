import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, Input, OnInit} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'object-record-fieldset-horizontal-list',
    templateUrl: './app/objectcomponents/templates/objectrecordfieldsethorizontallist.html'
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