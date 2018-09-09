import {Component, ElementRef, Renderer, Input, Output, OnDestroy, EventEmitter, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: '[object-popover-header]',
    templateUrl: './src/objectcomponents/templates/objectpopoverheader.html',
    providers: [view],
    host:{
        'class' : 'slds-popover__header'
    }
})
export class ObjectPopoverHeader implements OnInit{

    fields: Array<any> = [];
    constructor(private language: language, private model: model, private metadata: metadata) {

    }

    ngOnInit(){
        let componentconfig = this.metadata.getComponentConfig('ObjectPopoverHeader', this.model.module);
        if(componentconfig.fieldset){
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        }
    }
}