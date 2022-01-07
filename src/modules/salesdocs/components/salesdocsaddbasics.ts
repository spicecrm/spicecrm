/**
 * @module ModuleSalesDocs
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
 * renders a modal that allws picking the basic paramaters for the salesdoc when adding a new sales document
 */
@Component({
    selector: 'salesdocs-add-basic',
    templateUrl: '../templates/salesdocsaddbasics.html',
    providers: [view]
})
export class SalesDocsAddBasics {

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
        this.fieldset = this.metadata.getComponentConfig('SalesDocsAddBasics', 'SalesDocs').fieldset;
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
        // this.modal.openModal('SalesDocsAddMain', true, this.injector);
        this.modal.openModal("ObjectEditModal", true, this.injector).subscribe(editModalRef => {
            editModalRef.instance.model.isNew = true;
            // Field "salesdocparty" in table "salesdoctypes" is either "B" (for Business) or "C" (for Customer).
            // The field "salesdocparty" in the module SalesDocs wants "I" (for Individual) instead of "C". Here is the mapping:
            let salesdocType = this.model.getField('salesdoctype');
            let typeData = this.configuration.getData('salesdoctypes').find( typeRecord => typeRecord.name === salesdocType );
            editModalRef.instance.model.setField('salesdocparty', typeData.salesdocparty ? typeData.salesdocparty : 'C');
        });
    }

    /**
     * only allow to continue when the salesdocztype is set
     */
    get canContinue() {
        return this.model.getField('salesdoctype');
    }
}
