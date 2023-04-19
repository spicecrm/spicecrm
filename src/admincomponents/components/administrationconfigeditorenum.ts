/**
 * @module AdminComponentsModule
 */
import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {toast} from '../../services/toast.service';

/**
 * a simple config editor that allows editing config settings for a specific subtree
 */
@Component({
    selector: 'administration-configeditor-enum',
    templateUrl: '../templates/administrationconfigeditorenum.html'
})
export class AdministrationConfigEditorEnum {


    @Input() options: any[] = [];

    @Input('value') public value: string|number;

    set _value(value) {
        this.value = value;
        this._newValue.emit(value);
    }

    get _value() {
        return typeof this.value == 'number' ? this.value.toString() : this.value;
    }

    @Output('newvalue') _newValue: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public modal: modal,
        public toast: toast
    ) {

    }

}
