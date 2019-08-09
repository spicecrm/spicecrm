/**
 * @module ObjectFields
 */
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';
import { modal } from '../../services/modal.service';

declare const window: any;

@Component({
    selector: 'field-text',
    templateUrl: './src/objectfields/templates/fieldtext.html'
})
export class fieldText extends fieldGeneric implements OnInit {

    private speechRecognition = false;
    @ViewChild('textField', {read: ViewContainerRef, static: false}) private textField: ViewContainerRef;
    private browserIsChrome: boolean;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private modalservice: modal ) {
        super(model, view, language, metadata, router);
        this.browserIsChrome = !!window.chrome && !!window.chrome.webstore;
    }

    public ngOnInit() {
        if ( this.browserIsChrome ) {
            this.speechRecognition = this.fieldconfig.speechRecognition; // boolean
            this.speechRecognition = true; // for debugging
        }
    }

    private getTextAreaStyle() {
        let styleObj = {};

        if (this.fieldconfig.minheight) styleObj['min-height'] = this.fieldconfig.minheight;
        if (this.fieldconfig.maxheight) styleObj['max-height'] = this.fieldconfig.maxheight;

        return styleObj;
    }

    private speechRecognitionStart() {
        this.modalservice.openModal('SpeechRecognition',false).subscribe( modal => {
            modal.instance.textfield = this.textField;
        });
    }

}
