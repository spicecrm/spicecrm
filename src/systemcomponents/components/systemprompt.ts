/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        else if ( this.type === 'input' ) this.inputField.nativeElement.focus();
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
