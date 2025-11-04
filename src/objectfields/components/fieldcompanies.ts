/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {configurationService} from '../../services/configuration.service';
import {userpreferences} from '../../services/userpreferences.service';

import {fieldGeneric} from './fieldgeneric';


/**
 * renders a select field with the company names defined in the systenm and available for the user
 */
@Component({
    selector: 'field-companies',
    templateUrl: '../templates/fieldcompanies.html',
    standalone: false
})
export class fieldCompanies extends fieldGeneric implements OnInit {
    /**
     * holds the id field name
     */
    // public relateIdField: string;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public backend: backend, public configuration: configurationService, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        this.setDefault();
    }

    /**
     * sets the first one by default if no value is set in edit mode
     */
    public setDefault() {
        // the field name must be the field from type relate e.g. company_name
        // const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        // this.relateIdField = fieldDefs.id_name ? fieldDefs.id_name : this.fieldname;

        if (this.view.isEditMode() && !this.value) {
            if (this.userpreferences.getPreference('companyCodeId')) {
                //this.value = this.getName(this.userpreferences.companyCodeId);
                //this.model.setField(this.relateIdField, this.userpreferences.companyCodeId);
                this.value =  this.userpreferences.getPreference('companyCodeId');
            } else {
                const companyCodes = this.configuration.getData('companycodes').sort((a, b) => a.name.localeCompare(b.name));
                if (companyCodes && companyCodes.length > 0) {
                    // this.value = companyCodes[0].name;
                    // this.model.setField(this.relateIdField, companyCodes[0].id);
                    this.value = companyCodes[0].id;
                }
            }
        }
    }

    get displayName(): string {
        return this.getName(this.value);
    }

    /**
     * get the company code name from the configuration service loaded list
     * @param id
     * @private
     */
    private getName(id: string): string {
        return this.configuration.getData('companycodes').find(company => company.id == id)?.name;
    }

    /**
     * set id and name field on id change
     * @param id
     */
    public onIdChange(id: string) {
        //this.value = this.getName(id);
        //this.model.setField(this.relateIdField, id);
        this.value = id;

        // save to the user preferences
        this.setToPreferences(id);
    }

    /**
     * set the value to the preferences as default mailbox
     * @param value
     * @private
     */
    public setToPreferences(value: string) {

        this.userpreferences.setPreference(`companyCodeId`, value);
    }
}
