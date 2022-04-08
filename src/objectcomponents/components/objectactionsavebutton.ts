/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'object-action-save-button',
    templateUrl: '../templates/objectactionsavebutton.html'
})
export class ObjectActionSaveButton {

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    constructor(public language: language, public metadata: metadata, public model: model, public view: view) {

    }

    /**
     * disable the button when the model is saving
     */
    get disabled() {
        return this.model.isSaving;
    }

    /*
    * @return boolean
    */
    get hidden() {
        return !this.model.isEditing;
    }

    /*
    * @set saving
    * @emit 'save' by actionemitter
    * @call model.endEdit
    * @setViewMode
    */
    public execute() {
        if (this.model.isSaving) return;

        if (this.model.validate()) {
            this.model.save(true).subscribe(saved => {
                this.model.endEdit();
                this.view.setViewMode();
                this.actionemitter.emit('save');
            });
        }
    }
}
