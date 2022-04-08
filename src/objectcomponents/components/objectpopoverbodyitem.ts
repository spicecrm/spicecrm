/**
 * @module ObjectComponents
 */
import {Component,  Input, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';


@Component({
    selector: '[object-popover-body-item]',
    templateUrl: '../templates/objectpopoverbodyitem.html',
    providers:[model, view],
    host:{
        'class' : 'slds-popover__body-list'
    }
})
export class ObjectPopoverBodyItem implements OnInit{

    @Input() module:string = '';
    @Input() id:string = '';
    modelIsLoading: boolean = true;

    fields: Array<any> = [];
    constructor(public language: language, public model: model, public metadata: metadata) {

    }

    ngOnInit(){

        this.model.module = this.module;
        this.model.id = this.id;
        this.modelIsLoading = true;
        this.model.getData(true).subscribe(data => {
            this.modelIsLoading = false;
        });

        let componentconfig = this.metadata.getComponentConfig('ObjectPopoverBodyItem', this.model.module);
        if(componentconfig.fieldset){
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        }
    }
}
