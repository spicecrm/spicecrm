/**
 * @module ObjectFields
 */
import {Component, Input, OnChanges, OnInit, Optional} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

@Component({
    selector: 'field-messages',
    templateUrl: '../templates/fieldmessages.html'
})
export class FieldMessagesComponent implements OnInit, OnChanges {
    /**
     * the fieldname
     *
     * @private
     */
    @Input() public fieldname: string = '';

    /**
     * the messages collected
     * @private
     */
    @Input('messages') public _messages = [];

    /**
     * the errors
     *
     * @private
     */
    public errors = [];

    /**
     * the warnings
     *
     * @private
     */
    public warnings = [];

    /**
     * notices
     *
     * @private
     */
    public notices = [];

    constructor(public model: model, public view: view, public language: language, @Optional() public fielderrorgroup: fielderrorgrouping) {
    }

    public ngOnInit() {
        this.model.messageChange$.subscribe(() => {
            this.updateMessages();
        });
    }

    public ngOnChanges() {
        this.updateMessages();
    }

    public ngOnDestroy() {
        if (this.fielderrorgroup) this.fielderrorgroup.setError(this.fieldname, false);
    }

    public updateMessages() {
        let messages: any[];
        if (this._messages.length == 0 && this.fieldname) {
            messages = this.model.getFieldMessages(this.fieldname) || [];
        } else {
            messages = this._messages;
        }
        this.errors = this.filterMessages(messages, 'error');
        this.warnings = this.filterMessages(messages, 'warning');
        this.notices = this.filterMessages(messages, 'notice');
        if (this.fielderrorgroup) this.fielderrorgroup.setError(this.fieldname, this.errors.length !== 0);
    }

    public filterMessages(messages: any[], type?: string) {
        return messages.filter((e) => {
            return (!type || e.type == type);
        });
    }
}
