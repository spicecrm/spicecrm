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
    templateUrl: './src/objectfields/templates/fieldmessages.html'
})
export class FieldMessagesComponent implements OnInit, OnChanges {
    /**
     * the fieldname
     *
     * @private
     */
    @Input() private fieldname: string = '';

    /**
     * the messages collected
     * @private
     */
    @Input('messages') private _messages = [];

    /**
     * the errors
     *
     * @private
     */
    private errors = [];

    /**
     * the warnings
     *
     * @private
     */
    private warnings = [];

    /**
     * notices
     *
     * @private
     */
    private notices = [];

    constructor(private model: model, private view: view, private language: language, @Optional() private fielderrorgroup: fielderrorgrouping) {
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

    private updateMessages() {
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

    private filterMessages(messages: any[], type?: string) {
        return messages.filter((e) => {
            return (!type || e.type == type);
        });
    }
}
