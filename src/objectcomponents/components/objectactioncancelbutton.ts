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

    @Output() public  actionemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private helper: helper, private view: view, @Optional()private modalwindow: modalwindow) {}

    get hidden() {
        return !this.model.isEditing;
    }

    public execute() {
        this.model.cancelEdit();
        this.view.setViewMode();

        // emit that we cancelled
        this.actionemitter.emit('cancel');

        // close the modal window if we have one
        if(this.modalwindow) this.modalwindow.self.destroy();
    }
}