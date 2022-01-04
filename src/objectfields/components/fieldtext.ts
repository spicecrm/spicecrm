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
    templateUrl: '../templates/fieldtext.html'
})
export class fieldText extends fieldGeneric implements OnInit {

    /**
     * sets if speech recognition is turned on
     */
    public speechRecognition = false;

    /**
     * if the user resizes manually
     */
    public fixedHeight: number;

    /**
     * setthe fieldlength to 0
     */
    public fieldlength = 0;

    /**
     * reference to the text area
     */
    @ViewChild('textField', {read: ViewContainerRef, static: false}) public textField: ViewContainerRef;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public modalservice: modal) {
        super(model, view, language, metadata, router);
    }

    /**
     * initialize and load the fieldlength
     */
    public ngOnInit() {
        super.ngOnInit();
        if (window.webkitSpeechRecognition) {
            this.speechRecognition = this.fieldconfig.speechRecognition; // boolean
        }

        this.getFieldLength();
    }

    /**
     * determines if the field has a length set
     *
     * @private
     */
    public getFieldLength() {
        let field = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (field.len) {
            this.fieldlength = field.len;
        }
    }

    /**
     * gets the max length for the field attribute
     */
    get maxLength() {
        return this.fieldlength > 0 ? this.fieldlength : 65000;
    }

    /**
     * handle the resize of the field
     *
     * @param event
     * @private
     */
    public resize(event) {
        this.fixedHeight = event.height;
    }

    public getTextAreaStyle() {

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

    public speechRecognitionStart() {
        this.modalservice.openModal('SpeechRecognition', false).subscribe(modal => {
            modal.instance.textfield = this.textField;
        });
    }

    /**
     * After a change of the textfield value, save the new value to the model.
     */
    public change($event) {
        if ($event.target.value) this.value = $event.target.value;
    }

    /**
     * returns the length of the text
     */
    get textLength() {
        return this.value ? this.value.length : 0;
    }

}
