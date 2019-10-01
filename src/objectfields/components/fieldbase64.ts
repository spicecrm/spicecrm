/**
 * @module ObjectFields
 */
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';
import { footer } from '../../services/footer.service';
import { modal } from '../../services/modal.service';

@Component({
    selector: 'field-base64',
    templateUrl: './src/objectfields/templates/fieldbase64.html'
})
export class fieldBase64 extends fieldGeneric{

    speechRecognition: boolean = false;
    @ViewChild('textField', {read: ViewContainerRef, static: true}) textField: ViewContainerRef;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public footer: footer, private modalservice: modal ) {
        super(model, view, language, metadata, router);
    }

    get value() {
        try {
            return decodeURIComponent(window.atob(this.model.getField(this.fieldname)));
        }catch(e){
            return '';
        }
    }

    set value(val) {

        this.model.setField(this.fieldname, window.btoa(val));
    }


    getTextAreaStyle(){
        let styleObj = {};

        if(this.fieldconfig.minheight) styleObj['min-height'] = this.fieldconfig.minheight;
        if(this.fieldconfig.maxheight) styleObj['max-height'] = this.fieldconfig.maxheight;

        return styleObj
    }
}