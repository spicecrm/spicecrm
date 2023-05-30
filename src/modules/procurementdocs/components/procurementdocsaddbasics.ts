/**
 * @module ModuleProcurementDocs
 */
import {
    Component, Injector
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {configurationService} from '../../../services/configuration.service';

/**
 * renders a modal that allws picking the basic paramaters for the procurementdoc when adding a new procurement document
 */
@Component({
    selector: 'procurement-docs-add-basic',
    templateUrl: '../templates/procurementdocsaddbasics.html',
    providers: [view]
})
export class ProcurementDocsAddBasics {

    /**
     * for the modal the reference to self
     */
    public self: any;

    /**
     * the fieldset to be rendered - loaded from the module conf
     */
    public fieldset: string = '';

    constructor(public metadata: metadata, public language: language, public view: view, public modal: modal, public injector: Injector, public model: model, public configuration: configurationService ) {
        // set the basics for the view
        this.view.isEditable = true;
        this.view.setEditMode();

        // load the fieldset to be rendered
        this.fieldset = this.metadata.getComponentConfig('ProcurementDocsAddBasics', 'ProcurementDocs').fieldset;
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * continues to the next step and closes the modal
     */
    public next() {
        this.self.destroy();
        // this.modal.openModal('ProcurementDocsAddMain', true, this.injector);
        this.modal.openModal("ObjectEditModal", true, this.injector).subscribe(editModalRef => {
            editModalRef.instance.model.isNew = true;
            // Field "procurementdocparty" in table "procurementdoctypes" is either "B" (for Business) or "C" (for Customer).
            // The field "procurementdocparty" in the module ProcurementDocs wants "I" (for Individual) instead of "C". Here is the mapping:
            let procurementdocType = this.model.getField('procurementdoctype');
            let typeData = this.configuration.getData('procurementdoctypes').find( typeRecord => typeRecord.name === procurementdocType );
            editModalRef.instance.model.setField('procurementdocparty', typeData.procurementdocparty ? typeData.procurementdocparty : 'C');
        });
    }

    /**
     * only allow to continue when the procurementdocztype is set
     */
    get canContinue() {
        return this.model.getField('procurementdoctype');
    }
}
