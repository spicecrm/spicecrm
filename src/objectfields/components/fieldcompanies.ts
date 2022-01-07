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
    templateUrl: '../templates/fieldcompanies.html'
})
export class fieldCompanies extends fieldGeneric implements OnInit {

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
        if (this.view.isEditMode() && !this.model.getField(this.fieldname)) {
            if (this.userpreferences.companyCodeId) {
                this.value = this.userpreferences.companyCodeId;
            } else {
                let companyCodes = this.configuration.getData('companycodes');
                if (companyCodes && companyCodes.length > 0) {
                    companyCodes.sort((a, b) => a.name > b.name ? -1 : 1);
                    this.value = companyCodes[0].id;
                }
            }
        }
    }


    /**
     * returns ths name for the given id
     */
    get companyName() {
        let companyName = '';
        this.configuration.getData('companycodes').some(company => {
            if (company.id == this.model.getField(this.fieldname)) {
                companyName = company.name;
                return true;
            }
        })
        return companyName;
    }
}
