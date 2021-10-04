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
    templateUrl: './src/systemcomponents/templates/systemprompt.html'
})
export class SystemPrompt implements OnInit, AfterViewInit {

    /**
     * the type of prompt
     */
    @Input() private type: 'info'|'input'|'confirm';

    /**
     * the text that is rendered in the popup
     */
    @Input() private text: string;

    /**
     * the header for the popup in the modal
     */
    @Input() private headertext: string;

    /**
     * theme according to lightning design -> https://www.lightningdesignsystem.com/utilities/themes/
     */
    @Input() private theme: string;
    /**
     * the value to be set
     */
    protected radioGroupName: string;
    /**
     * ???
     */
    @Input() private value: string|number = null;

    /**
     * an array of options .. if sent rather than an input in the type input a select option is rendered
     */
    @Input() private options: Array<{value: string, display: string}>;

    /**
     * if true display the input options as radio group
     */
    @Input() private optionsAsRadio: boolean = false;

    /**
     * the observabkle for the answer
     */
    private answer: Observable<boolean> = null;

    /**
     * the subject for the answer
     */
    private answerSubject: Subject<any> = null;

    /**
     * reference to self
     */
    private self: any;

    /**
     * reference to the cancel button .. allows focussing when the modal is rendered
     */
    @ViewChild('cancelButton', {static: false}) private cancelButton;

    /**
     * reference to the ok button .. allows focussing when the modal is rendered
     */
    @ViewChild('okButton', {static: false}) private okButton;

    /**
     * reference to the input field .. allows focussing when the modal is rendered
     */
    @ViewChild('inputField', {static: false}) private inputField;

    /**
     * reference to the select field .. allows focussing when the modal is rendered
     */
    @ViewChild('selectField', {static: false}) private selectField;

    constructor( private language: language ) {
        this.answerSubject = new Subject<any>();
        this.answer = this.answerSubject.asObservable();
        this.radioGroupName = _.uniqueId('system-prompt-group-name-');
    }

    get splitText(): string[] {
        return this.text ? this.language.getLabel(this.text, undefined, 'long').split(/(?:\r\n|\r|\n)/g) : [];
    }
    public ngOnInit() {
        if ( !this.theme ) this.theme = 'shade';
    }

    public ngAfterViewInit() {
        if ( this.type === 'confirm' ) this.cancelButton.nativeElement.focus();
        else if ( this.type === 'info' ) this.okButton.nativeElement.focus();
        else if ( this.type === 'input' ) {
            if ( this.inputField ) this.inputField.nativeElement.focus();
            else if ( this.selectField ) this.selectField.nativeElement.focus();
        }
    }

    /**
     * when ok is clicked
     */
    private clickOK() {
        if ( this.type === 'input' ) this.answerSubject.next( this.value );
        else this.answerSubject.next( true );
        this.answerSubject.complete();
        this.self.destroy();
    }

    /**
     * issue cancel and close the modal
     */
    private clickCancel() {
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    /**
     * when ESC button is pressed
     */
    public onModalEscX() {
        if ( this.type === 'info' ) return false; // No ESC-Key allowed when type is 'info'
        else this.clickCancel();
    }

}
