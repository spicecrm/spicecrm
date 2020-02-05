/**
 * @module ObjectFields
 */
import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {modal} from '../../services/modal.service';

declare const window: any;

@Component({
    selector: 'field-text',
    templateUrl: './src/objectfields/templates/fieldtext.html'
})
export class fieldText extends fieldGeneric implements OnInit {

    /**
     * sets if speech recognition is turned on
     */
    private speechRecognition = false;

    /**
     * if the user resizes manually
     */
    private fixedHeight: number;

    /**
     * reference to the text area
     */
    @ViewChild('textField', {read: ViewContainerRef, static: false}) private textField: ViewContainerRef;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private modalservice: modal) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        if (window.webkitSpeechRecognition) {
            this.speechRecognition = this.fieldconfig.speechRecognition; // boolean
            this.speechRecognition = true; // for debugging
        }
    }

    private resize(event) {
        this.fixedHeight = event.height;
    }

    private getTextAreaStyle() {

        // get min and max height and set default values
        let minheight = this.fieldconfig.minheight ? this.fieldconfig.minheight.replace('px', '') : 38;
        let maxheight = this.fieldconfig.maxheight ? this.fieldconfig.maxheight.replace('px', '') : 300;

        // generate a style object
        let styleObj = {
            'min-height': minheight + 'px',
            'max-height': maxheight + 'px',
            'height': this.fixedHeight ? this.fixedHeight + 'px' : minheight + 'px'
        };

        // check the scroll height and determine auto height
        if (!this.fixedHeight && this.textField && this.fieldconfig.maxheight) {
            styleObj.height = (this.textField.element.nativeElement.scrollHeight + 2 < this.fieldconfig.maxheight ? this.textField.element.nativeElement.scrollHeight + 2 : this.fieldconfig.maxheight) + 'px';
        }

        return styleObj;
    }

    /**
     * returns true if the field is to be displaxed truncated
     */
    get truncated() {
        return this.fieldconfig.truncate ? true : false;
    }

    private speechRecognitionStart() {
        this.modalservice.openModal('SpeechRecognition', false).subscribe(modal => {
            modal.instance.textfield = this.textField;
        });
    }

}
