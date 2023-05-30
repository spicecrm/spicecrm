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
import {navigation} from "../../../services/navigation.service";

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

    constructor(public metadata: metadata, public language: language, public view: view, public modal: modal, public injector: Injector, public model: model, public configuration: configurationService, public navigation: navigation ) {
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
        // open a new tab
        this.navigation.addObjectTab({
            path: 'module/:module/new/:id',
            params: {module: this.model.module, id: this.model.id},
            id: this.model.utils.generateGuid(),
            active: true,
            pinned: false,
            enablesubtabs: false,
            url: `module/${this.model.module}/new/${this.model.id}`,
            tabdata: {
                module: this.model.module,
                id: this.model.id,
                data: this.model.data
            }
        })


        // this.modal.openModal('SalesDocsAddMain', true, this.injector);
        /*
        this.modal.openModal("ObjectEditModal", true, this.injector).subscribe(editModalRef => {
            editModalRef.instance.model.isNew = true;
            // Field "salesdocparty" in table "salesdoctypes" is either "B" (for Business) or "C" (for Customer).
            // The field "salesdocparty" in the module SalesDocs wants "I" (for Individual) instead of "C". Here is the mapping:
            let salesdocType = this.model.getField('salesdoctype');
            let typeData = this.configuration.getData('salesdoctypes').find( typeRecord => typeRecord.name === salesdocType );
            editModalRef.instance.model.setField('salesdocparty', typeData.salesdocparty ? typeData.salesdocparty : 'C');
        });
         */
    }

    /**
     * only allow to continue when the salesdocztype is set
     */
    get canContinue() {
        return this.model.getField('salesdoctype');
    }
}
