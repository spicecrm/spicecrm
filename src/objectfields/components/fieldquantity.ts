/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/objectfields/templates/fieldquantity.html'
})
export class fieldQuantity extends fieldFloat implements OnInit {

    /**
     * the uniots of measure Array
     */
    private uoms: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public userpreferences: userpreferences, private configuration: configurationService) {
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
