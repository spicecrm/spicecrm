/**
 * @module ServiceComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";


@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketclosemodal.html',
    providers: [view]
})
export class ServiceTicketCloseModal {

    /**
     * the status network item record
     */
    private self: any;

    /**
     * the fieldset to be rendered according to the componentconfig
     */
    private fieldset: string;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private view: view
    ) {
        // set the view to edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // load the fieldset
        let componentconfig = this.metadata.getComponentConfig('ServiceTicketCloseModal', this.model.module);
        this.fieldset = componentconfig.fieldset;
    }

    private close() {
        this.self.destroy();
    }


    get canSave() {
        return this.model.getField('sladeviation_reason').length > 0;
    }

    private setStatus() {
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
