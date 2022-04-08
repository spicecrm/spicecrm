/**
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
@Component({
    selector: '[object-popover-header]',
    templateUrl: '../templates/objectpopoverheader.html',
    providers: [view],
    host:{
        'class' : 'slds-popover__header'
    }
})
export class ObjectPopoverHeader implements OnInit{

    fields: Array<any> = [];
    constructor(public language: language, public model: model, public metadata: metadata) {

    }

    ngOnInit(){
        let componentconfig = this.metadata.getComponentConfig('ObjectPopoverHeader', this.model.module);
        if(componentconfig.fieldset){
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        }
    }
}
