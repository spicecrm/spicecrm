import {Component, Input, Optional, OnInit, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-action-save-button',
    templateUrl: './src/objectcomponents/templates/objectactionsavebutton.html',
    host: {
        'class': 'slds-button slds-button--brand',
        '(click)': 'this.saveModel()'
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class ObjectActionSaveButton {

    @Output() actionemitter: EventEmitter<any> = new EventEmitter<any>();

    parent: any = {};
    module: string = '';

    saving: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model) {

    }

    saveModel() {
        if(this.saving) return;

        if(this.model.validate()) {
            this.saving = true;
            this.model.save().subscribe(saved => {
                this.actionemitter.emit(true);
            });
        }
    }

}