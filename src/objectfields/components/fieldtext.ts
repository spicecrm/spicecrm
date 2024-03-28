/**
 * @module ObjectFields
 */
import {Component, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {modal} from '../../services/modal.service';
import {helper} from '../../services/helper.service';

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
     * displays/hides volume icon
     */
    public hideVolumeIcon: boolean = false;

    /**
     * if the user resizes manually
     */
    public fixedHeight: number;

    /**
     * setthe fieldlength to 0
     */
    public fieldlength = 0;

    /**
     * determines if html content shall be removed
     */
    public striphtml = false;
    
    get displayTemplateVariableHelper() {
        return this.model?.module in {
            OutputTemplates: true,
            EmailTemplates: true,
            CampaignTasks: true,
            LandingPages: true,
            Mailboxes: true,
            TextSnippets: true
        }
    }

    /**
     * check the acl view and list access for the text snippets to show/hide button
     */
    get displayTextSnippet(): boolean {
        return this.metadata.checkModuleAcl('TextSnippets', 'list') && this.metadata.checkModuleAcl('TextSnippets', 'view');
    }

    /**
     * reference to the text area
     */
    @ViewChild('textField', {read: ViewContainerRef, static: false}) public textField: ViewContainerRef;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public modal: modal,
                public viewContainerRef: ViewContainerRef,
                public helper: helper
    ) {
        super(model, view, language, metadata, router);
    }

    /**
     * initialize and load the fieldlength
     */
    public ngOnInit() {
        super.ngOnInit();
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            this.speechRecognition = this.fieldconfig.speechRecognition; // boolean
        }

        this.hideVolumeIcon = this.fieldconfig.hideVolumeIcon; // boolean

        this.getFieldLength();
        this.setStripHtml();
    }

    /**
     * determines if the html Tags shall be removed
     *
     */
    public setStripHtml() {
        if (this.fieldconfig.striphtml) {
            this.striphtml = this.fieldconfig.striphtml;
        }
    }

    /**
     * determines if the field has a length set
     *
     * @private
     */
    public getFieldLength() {
        let field = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (field.len) {
            this.fieldlength = parseInt(field.len, 10);
        }
        if (this.fieldconfig.maxlength && (!this.fieldlength || parseInt(this.fieldconfig.maxlength, 10) < this.fieldlength)) this.fieldlength = this.fieldconfig.maxlength;
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
        let minheight = this.fieldconfig.minheight ? this.fieldconfig.minheight.replace('px', '') : 80;
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
     * use the speech API and read the text
     */
    public toSpeech() {
        let speech = new SpeechSynthesisUtterance();
        speech.text = this.value;
        speech.lang = this.getSpeechLanguage();
        speechSynthesis.speak(speech);
    }

    /**
     * get the speec api language from teh logged on language
     *
     * @private
     */
    private getSpeechLanguage() {
        let langArray = this.language.currentlanguage.split('_');
        if (langArray.length != 2) return 'en-US';
        return langArray[0] + '-' + langArray[1].toUpperCase();
    }

    /**
     * returns true if the field is to be displaxed truncated
     */
    get truncated() {
        return this.fieldconfig.truncate ? true : false;
    }

    public speechRecognitionStart() {
        this.modal.openModal('SpeechRecognition', false).subscribe(modal => {
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

    get currentPosition() {
        return this.focuselement.element.nativeElement.selectionStart;
    }

    /**
     * open the template variable select modal and insert the parsed variable
     */

    public openTemplateVariableHelper() {
        this.helper.addTemplateVariables(this.modal, this.model, this.viewContainerRef.injector).subscribe({
            next: text => {
                const oldString = this.value ?? '';
                this.value = oldString.substring(0, this.currentPosition) + text + oldString.substring(this.currentPosition)
            },
            error: () => {
                this.model.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        })
    }

    /**
     * open the text snippet select modal and insert the parsed snippet html
     */
    public openTextSnippetModal() {
        const moduleFilter = this.metadata.getComponentConfig('SystemRichTextEditor', 'TextSnippets')?.textSnippetsModuleFilter;

        this.helper.addTextSnippet('PLAIN', moduleFilter, this.modal, this.model, this.viewContainerRef.injector).subscribe({
            next: snippet => {
                const oldString = this.value ?? '';
                this.value = oldString.substring(0, this.currentPosition) + snippet + oldString.substring(this.currentPosition)
            },
            error: () => {
                this.model.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        })
    }
}
