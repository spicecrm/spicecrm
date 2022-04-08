/**
 * @module ModuleLeads
 */
import {Component, Input, Output, EventEmitter, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {Observable, Subject} from "rxjs";
import {view} from "../../../services/view.service";

/**
 * a separet modal to display the steps for th elad comversion as well as the progress
 */
@Component({
    templateUrl: '../templates/leadselecttypemodal.html',
    providers: [view]
})
export class LeadSelectTypeModal {

    /**
     * reference to the modal itsefl
     */
    public self: any;

    /**
     * the fieldset to be rendered
     */
    public fieldset: string;

    constructor(public injector: Injector, public metadata: metadata, public view: view, public language: language, public modal: modal, public model: model) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.fieldset = this.metadata.getComponentConfig('LeadSelectTypeModal', 'Leads').fieldset;
    }

    /**
     * simple getter to enable the create button
     */
    get cancreate() {
        return !!this.model.getField('lead_type');
    }

    /**
     * trigger creating the new lead
     */
    public create() {
        if(this.cancreate) {
            this.modal.openModal("ObjectEditModal", true, this.injector);
            this.close();
        }
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}
