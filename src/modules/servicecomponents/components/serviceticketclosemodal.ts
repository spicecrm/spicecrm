/**
 * @module ServiceComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {toast} from "../../../services/toast.service";
import {field} from "../../../objectfields/components/field";

/**
 * renders a close dialog in case the SLA was not met and prompts the user to specifiy the reason why the SLA was not met.
 * The deviation reason needs to be visible in the fieldset
 * additonal fields might be added
 */
@Component({
    selector: 'service-ticket-close-modal',
    templateUrl: '../templates/serviceticketclosemodal.html',
    providers: [view]
})
export class ServiceTicketCloseModal {

    /**
     * the status network item record
     */
    public self: any;

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

        // load the fieldset
        let componentconfig = this.metadata.getComponentConfig('ServiceTicketCloseModal', this.model.module);
        this.fieldset = componentconfig.fieldset;

        // start editing the model and set the status
        this.model.startEdit(true, true);
    }

    /**
     * closes the modal
     */
    public close() {
        this.model.cancelEdit();
        this.self.destroy();
    }

    /**
     * cheks if the deviation reason for the sla is set
     */
    get canSave() {
        return !this.model.getFieldStati('sladeviation_reason').invalid;
    }

    /**
     * set the status and closes the modal
     */
    public setStatus() {
        if(!this.canSave) return;
        this.model.startEdit(true);
        this.model.setField('serviceticket_status', 'Closed');
        if (this.model.validate()) {
            this.model.save();
            this.close();
        } else {
            this.toast.sendToast(this.language.getLabel("MSG_INPUT_REQUIRED"), 'error');
            this.model.edit().subscribe(()=>{
                this.close();
            });
        }
    }

}
