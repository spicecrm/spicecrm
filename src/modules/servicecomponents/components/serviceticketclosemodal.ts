/**
 * @module ServiceComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";

/**
 * renders a close dialog in case the SLA was not met and prompts the user to specifiy the reason why the SLA was not met.
 * The deviation reason needs to be visible in the fieldset
 * additonal fields might be added
 */
@Component({
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
        public view: view
    ) {
        // set the view to edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // load the fieldset
        let componentconfig = this.metadata.getComponentConfig('ServiceTicketCloseModal', this.model.module);
        this.fieldset = componentconfig.fieldset;
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * cheks if the deviation reason for the sla is set
     */
    get canSave() {
        return this.model.getField('sladeviation_reason').length > 0;
    }

    /**
     * set the status and closes the modal
     */
    public setStatus() {
        if(!this.canSave) return;

        // start editing the model and set the status
        this.model.startEdit(true, true);
        this.model.setField('serviceticket_status', 'Closed');
        if (this.model.validate()) {
            this.model.save();
        } else {
            this.model.edit();
        }
        this.close();
    }

}
