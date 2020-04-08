/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, OnInit, Optional, Output} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modalwindow} from '../../services/modalwindow.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";

/**
 * a standard actionset item to open a model
 */
@Component({
    selector: 'object-action-cancel-button',
    templateUrl: './src/objectcomponents/templates/objectactioncancelbutton.html',
    providers: [helper]
})
export class ObjectActionCancelButton {

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private helper: helper, private view: view, @Optional() private modalwindow: modalwindow) {
    }

    /**
     * disable when the model is saving
     */
    get disabled() {
        return this.model.isSaving;
    }

    /**
     * hide the button if we are not in edit mode
     */
    get hidden() {
        return !this.model.isEditing;
    }

    /**
     * cancel and destroy the modal if we have one
     */
    public execute() {
        this.model.cancelEdit();
        this.view.setViewMode();

        // emit that we cancelled
        this.actionemitter.emit('cancel');

        // close the modal window if we have one
        if (this.modalwindow) this.modalwindow.self.destroy();
    }
}
