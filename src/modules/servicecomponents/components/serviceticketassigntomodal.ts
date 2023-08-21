/**
 * @module ServiceComponentsModule
 */
import {Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {toast} from "../../../services/toast.service";
import {field} from "../../../objectfields/components/field";

/**
 * renders a dialog primarily to assign a user to the ticket
 * fieldset will be rendered, therefore other values possibles
 */
@Component({
    selector: 'service-ticket-assign-to-modal',
    templateUrl: '../templates/serviceticketassigntomodal.html',
    providers: [view]
})
export class ServiceTicketAssignToModal implements OnInit {

    /**
     * reference to self to be able to close the modal
     */
    public self: any;

    /**
     * the target status value passed from the network button
     */
    public serviceticket_status: string = '';

    /**
     * the fieldset to be rendered according to the componentconfig
     */
    public fieldset: string;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public view: view,
        public toast: toast
    ) {
        // set the view to edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // start editing the model and set the status
        this.model.startEdit(true, true);

        // load the fieldset
        let componentconfig = this.metadata.getComponentConfig('ServiceTicketAssignToModal', this.model.module);
        this.fieldset = componentconfig.fieldset;

    }

    /**
     * set the values
     */
    public ngOnInit() {
        // set the target status passed by the actionbutton
        this.model.setField('serviceticket_status', this.serviceticket_status);
        // empty the value so that user has to set one
        // make sure that fieldis required in the field
        this.model.setField('assigned_user_id', '');
    }

    /**
     * closes the modal
     */
    public close() {
        this.model.cancelEdit();
        this.self.destroy();
    }

    /**
     * meant for any check we need to add in the future
     * just return true for noa
     */
    get canSave() {
        return true;
    }

    /**
     * set the status and closes the modal
     */
    public setAssign() {
        if(!this.canSave) return;

        this.model.setField('serviceticket_status', this.serviceticket_status);
        if (this.model.validate()) {
            this.model.save();
        } else {
            this.toast.sendToast(this.language.getLabel("MSG_INPUT_REQUIRED"), 'error');
            this.model.edit(false);
        }
        this.close();
    }

}
