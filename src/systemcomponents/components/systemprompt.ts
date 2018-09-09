import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { language } from '../../services/language.service';
import { Observable ,  Subject } from 'rxjs';

@Component({
    selector: 'system-prompt',
    templateUrl: './app/systemcomponents/templates/systemprompt.html',
    host: {
        '( window:keydown )': 'this.keyPressed( $event )'
    }
})
export class SystemPrompt {

    @Input() type: string; // 'info', 'input' or 'confirm'
    @Input() text: string;
    @Input() headertext: string;
    @Input() theme: string; // theme according to lightning design -> https://www.lightningdesignsystem.com/utilities/themes/
    @Input() value: string;

    answer: Observable<boolean> = null;
    answerSubject: Subject<any> = null;

    self: any = {};

    @ViewChild('cancelButton') cancelButton;
    @ViewChild('okButton') okButton;
    @ViewChild('inputField') inputField;

    constructor( private language: language )  {
        this.answerSubject = new Subject<any>();
        this.answer = this.answerSubject.asObservable();
    }

    ngOnInit() {
        if( !this.theme ) this.theme = 'shade';
    }

    ngAfterViewInit() {
        if ( this.type === 'confirm' ) this.cancelButton.nativeElement.focus();
        else if ( this.type === 'info' ) this.okButton.nativeElement.focus();
        else if ( this.type === 'input' ) this.inputField.nativeElement.focus();
    }

    clickOK() {
        if ( this.type === 'input' ) {
            this.answerSubject.next( this.value );
        } else {
            this.answerSubject.next( true );
        }
        this.answerSubject.complete();
        this.self.destroy();
    }

    clickCancel() {
        if ( this.type === 'info' ) return;
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    keyPressed(event) {
        if ( event.keyCode === 27 ) this.clickCancel();
    }

}