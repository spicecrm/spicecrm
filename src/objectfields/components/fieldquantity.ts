/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {userpreferences} from '../../services/userpreferences.service';
import {configurationService} from "../../services/configuration.service";

import {fieldFloat} from "./fieldfloat";

@Component({
    selector: 'field-quantity',
    templateUrl: '../templates/fieldquantity.html'
})
export class fieldQuantity extends fieldFloat implements OnInit {

    /**
     * the units of measure Array
     */
    public uoms: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public userpreferences: userpreferences, public configuration: configurationService) {
        super(model, view, language, metadata, router, userpreferences);

        this.uoms = this.configuration.getData('uomunits');
    }

    get uomidfield() {
        if (this.fieldconfig.uomid_field) {
            return this.fieldconfig.uomid_field;
        }

        // try the metadata and see if we have a uom_id field
        if (this.metadata.getModuleFields(this.model.module).uom_id) {
            return 'uom_id';
        }
    }

    /**
     * getter for the UOM ID
     */
    get uomid() {
        return this.model.getField(this.uomidfield);
    }

    /**
     * setter for the uom id
     *
     * @param value the value
     */
    set uomid(value) {
        this.model.setField(this.uomidfield, value);
    }

    /**
     * gets the label for the UOM ID
     */
    get uomLabel() {
        if (this.value) {
            let uom = this.uoms.find(u => u.id == this.uomid);
            if (uom) {
                return this.language.getLabel(uom.label);
            } else {
                // if no found return the value
                return this.uomid;
            }
        }
        return '';
    }
}
