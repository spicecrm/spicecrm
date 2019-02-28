import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { language } from '../../services/language.service';
import { Observable ,  Subject } from 'rxjs';

@Component({
    selector: 'system-prompt',
    templateUrl: './src/systemcomponents/templates/systemprompt.html'
})
export class SystemPrompt implements OnInit, AfterViewInit {

    @Input() private type: string; // 'info', 'input' or 'confirm'
    @Input() private text: string;
    @Input() private headertext: string;
    @Input() private theme: string; // theme according to lightning design -> https://www.lightningdesignsystem.com/utilities/themes/
    @Input() private value: string;

    private answer: Observable<boolean> = null;
    private answerSubject: Subject<any> = null;

    private self: any;

    @ViewChild('cancelButton') private cancelButton;
    @ViewChild('okButton') private okButton;
    @ViewChild('inputField') private inputField;

    constructor( private language: language ) {
        this.answerSubject = new Subject<any>();
        this.answer = this.answerSubject.asObservable();
    }

    public ngOnInit() {
        if ( !this.theme ) this.theme = 'shade';
    }

    public ngAfterViewInit() {
        if ( this.type === 'confirm' ) this.cancelButton.nativeElement.focus();
        else if ( this.type === 'info' ) this.okButton.nativeElement.focus();
        else if ( this.type === 'input' ) this.inputField.nativeElement.focus();
    }

    private clickOK() {
        if ( this.type === 'input' ) {
            this.answerSubject.next( this.value );
        } else {
            this.answerSubject.next( true );
        }
        this.answerSubject.complete();
        this.self.destroy();
    }

    private clickCancel() {
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    public onModalEscX() {
        if ( this.type === 'info' ) return false; // No ESC-Key allowed when type is 'info'
        else this.clickCancel();
    }

}
