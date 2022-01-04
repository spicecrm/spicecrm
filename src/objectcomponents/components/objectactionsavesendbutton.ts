/**
 * @module ObjectComponents
 *
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'object-action-save-send-button',
    templateUrl: '../templates/objectactionsavesendbutton.html'
})
/**
 * this button is meant for activity stream add item with an activity type were there is something to send
 * example text messages
 * Since sending is done within save logic in the backend this button is just a workaround to get a proper toast "data sent"
 */
export class ObjectActionSaveSendButton {

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * if set to true display the button as icon
     */
    public displayasicon: boolean = false;
    public actionconfig: any = {};

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

    /**
     * get the label from actionconfig or use default LBL_SAVE
     */
    get label() {
        if(this.actionconfig.label && this.actionconfig.label !== '') return this.actionconfig.label;
        else return 'LBL_SEND';
    }

    /**
     * get the label from actionconfig or use default LBL_DATA_SENT
     */
    get toastLabel() {
        if(this.actionconfig.toastlabel && this.actionconfig.toastlabel !== '') return this.actionconfig.toastlabel;
        else return 'LBL_DATA_SENT';
    }

    /*
    * call model.send() to save & send
    * @set saving
    * @emit 'save' by actionemitter
    * @call model.endEdit
    * @setViewMode
    */
    public execute() {
        if (this.model.isSaving) return;

        if (this.model.validate()) {
            this.model.saveAndSend(true, this.toastLabel).subscribe(saved => {
                this.model.endEdit();
                this.view.setViewMode();
                this.actionemitter.emit('save');
            });
        }
    }
}
