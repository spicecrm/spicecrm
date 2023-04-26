/**
 * @module SystemComponents
 */
import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { language } from '../../services/language.service';
import { Observable ,  Subject } from 'rxjs';

/** @ignore */
declare var _;

/**
 * renders a prompt to the user with a copuple of options
 */
@Component({
    selector: 'system-prompt',
    templateUrl: '../templates/systemprompt.html'
})
export class SystemPrompt implements OnInit, AfterViewInit {

    /**
     * the type of prompt
     */
    @Input() public type: 'info'|'input'|'input_text'|'input_date'|'confirm';

    /**
     * the text that is rendered in the popup
     */
    @Input() public text: string;

    /**
     * the header for the popup in the modal
     */
    @Input() public headertext: string;

    /**
     * theme according to lightning design -> https://www.lightningdesignsystem.com/utilities/themes/
     */
    @Input() public theme: string;
    /**
     * the value to be set
     */
    public radioGroupName: string;
    /**
     * ???
     */
    @Input() public value: string|number = null;

    /**
     * an array of options .. if sent rather than an input in the type input a select option is rendered
     */
    @Input() public options: {value: string|boolean, display: string}[];

    /**
     * if true display the input options as radio group
     * @deprecated Use optionsAs = 'radio' instead.
     */
    @Input() public optionsAsRadio: boolean = false;

    /**
     * if true display the input options as button group
     */
    @Input() public optionsAs: 'radio'|'button'|'select';

    /**
     * the observabkle for the answer
     */
    public answer: Observable<boolean> = null;

    /**
     * the subject for the answer
     */
    public answerSubject: Subject<any> = null;

    /**
     * an optional regex to match the input against
     */
    public regex: string;

    /**
     * reference to self
     */
    public self: any;

    /**
     * reference to the cancel button .. allows focussing when the modal is rendered
     */
    @ViewChild('cancelButton', {static: false}) public cancelButton;

    /**
     * reference to the ok button .. allows focussing when the modal is rendered
     */
    @ViewChild('okButton', {static: false}) public okButton;

    /**
     * reference to the input field .. allows focussing when the modal is rendered
     */
    @ViewChild('inputField', {static: false}) public inputField;

    /**
     * reference to the select field .. allows focussing when the modal is rendered
     */
    @ViewChild('selectField', {static: false}) public selectField;

    constructor( public language: language ) {
        this.answerSubject = new Subject<any>();
        this.answer = this.answerSubject.asObservable();
        this.radioGroupName = _.uniqueId('system-prompt-group-name-');
    }

    get splitText(): string[] {
        return this.text ? this.language.getLabel(this.text, undefined, 'long').split(/(?:\r\n|\r|\n)/g) : [];
    }
    public ngOnInit() {
        if ( !this.theme ) this.theme = 'shade';
        if ( this.optionsAsRadio === true ) this.optionsAs = 'radio';
    }

    public ngAfterViewInit() {
        if ( this.type === 'confirm' ) this.cancelButton.nativeElement.focus();
        else if ( this.type === 'info' ) this.okButton.nativeElement.focus();
        else if ( this.type.startsWith('input') ) {
            if ( this.inputField ) this.inputField.nativeElement.focus();
            else if ( this.selectField ) this.selectField.nativeElement.focus();
        }
    }

    /**
     * checks that ok is enabled
     */
    get canSubmit(){
        // only check for input and input data
        if(!this.type.startsWith('input')) return true;

        // value needs to be set
        if (!this.value ) return false;

        if(this.regex){
            let reg = new RegExp(this.regex);
            return reg.test(String(this.value));
        }

        return true;
    }

    /**
     * when ok is clicked
     */
    public clickOK() {
        if (this.type.startsWith('input')) this.answerSubject.next( this.value );
        else this.answerSubject.next( true );
        this.answerSubject.complete();
        this.self.destroy();
    }

    /**
     * issue cancel and close the modal
     */
    public clickCancel() {
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    /**
     * when ESC button is pressed
     */
    public onModalEscX() {
        if ( this.type === 'info' || this.optionsAs === 'button' ) return false; // No ESC-Key allowed when type is 'info'
        else this.clickCancel();
    }

    public clickButtonGroup( value: any ) {
        this.answerSubject.next( value );
        this.answerSubject.complete();
        this.self.destroy();
    }

}
