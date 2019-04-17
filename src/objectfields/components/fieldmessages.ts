/**
 * @module ObjectFields
 */
import { Component, Input, OnChanges, OnInit, Optional } from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

@Component({
    selector: 'field-messages',
    templateUrl: './src/objectfields/templates/fieldmessages.html'
})
export class FieldMessagesComponent implements OnInit, OnChanges
{
    @Input() fieldname:string = '';
    @Input('messages') _messages = [];
    errors = [];
    warnings = [];
    notices = [];

    constructor ( private model: model, private view: view, private language: language, @Optional() private fielderrorgroup: fielderrorgrouping ) { }

    ngOnInit() {
        this.model.messageChange$.subscribe( () => {
            this.updateMessages();
        });
    }

    ngOnChanges() {
        this.updateMessages();
    }

    updateMessages() {
        let messages: Array<any>;
        if( this._messages.length == 0 && this.fieldname ) {
            messages = this.model.getFieldMessages( this.fieldname ) || [];
        } else {
            messages = this._messages;
        }
        this.errors = this.filterMessages( messages, 'error');
        this.warnings = this.filterMessages( messages, 'warning');
        this.notices = this.filterMessages( messages, 'notice');
        if ( this.fielderrorgroup ) this.fielderrorgroup.setError( this.fieldname,this.errors.length !== 0 );
    }

    filterMessages( messages: Array<any>, type?: string) {
        return messages.filter((e) => {return (!type || e.type == type)});
    }

    ngOnDestroy(){
        if ( this.fielderrorgroup ) this.fielderrorgroup.setError( this.fieldname, false );
    }

}