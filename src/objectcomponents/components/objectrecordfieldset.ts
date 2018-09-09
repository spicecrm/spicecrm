import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, Input, OnInit,AfterContentInit} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'object-record-fieldset',
    templateUrl: './src/objectcomponents/templates/objectrecordfieldset.html'
})
export class ObjectRecordFieldset implements OnInit{

    @Input()fieldset: string = '';
    @Input()direction: string = 'horizontal';

    fieldsetitems: Array<any> = [];
    numberOfColumns: number = 0; // in grid

    constructor(private metadata: metadata, private model: model) {
    }

    ngOnInit() {
        this.fieldsetitems = this.metadata.getFieldSetItems(this.fieldset);
        for ( let item of this.fieldsetitems )
            this.numberOfColumns = this.numberOfColumns + ( item.fieldconfig.width ? item.fieldconfig.width*1 : ( item.fieldconfig.width = 1 ));
        if ( this.numberOfColumns > 8 ) console.warn('wrong fieldset grid ('+this.fieldset+')');
    }

    get renderVertical(){
        return this.direction == 'vertical' ? true : false;
    }

    isField(fieldsetitem){
        return fieldsetitem.field ? true : false;
    }

    sizeClass(i) { // get sizeClass()
        // return ' slds-size--1-of-' + this.fieldsetitems.length;
        return ' slds-size--' + this.fieldsetitems[i].fieldconfig.width + '-of-' + this.numberOfColumns;
    }

}