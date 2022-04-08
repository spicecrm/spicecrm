/**
 * @module ModuleEmails
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";

/**
 * renders an edit button that can be used in actionsets to start editing the model and render the model edit modal
 */
@Component({
    selector: 'email-action-set-read-button',
    templateUrl: '../templates/emailactionsetreadbutton.html'
})
export class EmailActionSetReadButton {

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
    ) {

    }

    /**
     * hide the button while the model is editing and the status of the model != 'unread'
     */
    get hidden() {
        return this.model.getFieldValue('status') != "unread" && this.model.isEditing? true: false;
    }

    /**
     * set to dsiabled when we are not allowed to edit or we are editing or saving already
     */
    get disabled() {
        if (!this.model.checkAccess('edit')) {
            return true;
        }
        return this.model.isEditing || this.model.isSaving;
    }

    /*
    * set the status of the current model to read
    */
    public execute() {
        this.model.setField("status", "read");
    }
}
