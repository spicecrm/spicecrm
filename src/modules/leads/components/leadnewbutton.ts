/**
 * @module ModuleLeads
 */
import {Component, Optional, Injector, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {relatedmodels} from '../../../services/relatedmodels.service';


/**
 * renders a button to add a new lead
 *
 * the button is used as component in an actionset
 */
@Component({
    selector: 'lead-new-button',
    templateUrl: '../templates/leadnewbutton.html',
    providers: [model]
})
export class LeadNewButton {

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    constructor(public injector: Injector, public language: language, public metadata: metadata, public modal: modal, public model: model, @SkipSelf() public parentmodel: model, @Optional() public relatedmodel: relatedmodels) {
    }

    /**
     * execute the lead creation
     *
     * from accounts and contacts it is B2B , from consumers B2C
     */
    public execute() {
        this.model.module = 'Leads';
        this.model.id = undefined;
        if (this.parentmodel.module == 'Contacts' || this.parentmodel.module == 'Accounts') {
            this.model.addModel('', this.parentmodel, {lead_type: 'b2b'});
        } else if (this.relatedmodel && (this.relatedmodel.module == 'Contacts' || this.relatedmodel.module == 'Accounts')) {
            this.model.addModel('', this.relatedmodel.model, {lead_type: 'b2b'});
        } else if (this.parentmodel.module == 'Consumer') {
            this.model.addModel('', this.parentmodel, {lead_type: 'b2c'});
        }  else if (this.relatedmodel && this.relatedmodel.module == 'Consumers') {
            this.model.addModel('', this.relatedmodel.model, {lead_type: 'b2c'});
        } else {
            // make sure we have no idea so a new on gets issues
            this.model.initialize(this.parentmodel);
            this.modal.openModal('LeadSelectTypeModal', true, this.injector);
        }
    }

    /**
     * getter for the disbaled state of the button
     */
    get disabled() {
        return !this.metadata.checkModuleAcl('Leads', "create");
    }
}
