/**
 * @module ModuleSalesDocs
 */
import {Component} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';

@Component({
    templateUrl: "./src/modules/salesdocs/templates/salesdocsfinalizebutton.html",
})
export class SalesdocsFinalizeButton {

    constructor(
        public language: language, public metadata: metadata, public model: model,
        public modal: modal, private backend: backend, private toast: toast ) {
    }

    /**
     * execute when the button is clicked
     */
    public execute() {

        // Make the first character of the label uppercase:
        let labelFinalize = this.language.getLabel('LBL_FINALIZE');
        labelFinalize = labelFinalize.charAt(0).toUpperCase() + labelFinalize.slice(1);

        // Ask for confirmation:
        this.modal.confirm(this.language.getLabel('MSG_FINALIZED_NO_ALTERING'),labelFinalize+'?').subscribe( answer => {
           if ( answer === true ) {
               // Send finalization request to the backend:
               this.backend.postRequest('module/SalesDocs/'+this.model.id+'/finalize').subscribe( answer => {
                   this.toast.sendToast('Sales Document successfully finalized.','success');
               }, error => {
                   if ( error.error && error.error.error && error.error.error.errorCode === 'alreadyFinalized') {
                       this.toast.sendToast( 'Sales Document already finalized.', 'info', null, false );
                   } else {
                       this.toast.sendToast( 'Error finalizing the sales document.', 'error', error.error.error.message );
                   }
               });
           }
        });

    }

    /**
     * Button is disabled, when field "finalized_on" is already set or when record is currently being processed.
     */
    get disabled() {
        return !!this.model.getField('finalized_on') || this.model.isEditing;
    }

}
