/*
SpiceUI 2018.10.001

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
import {Component, OnInit, Injector} from '@angular/core';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {language} from "../../services/language.service";

/**
 * renders a field with an indicator for data and marketing release according to GDPR Rules
 */
@Component({
    selector: 'field-gdpr',
    templateUrl: './src/objectfields/templates/fieldgdpr.html'
})
export class fieldGDPR extends fieldGeneric implements OnInit {

    /**
     * the gdpr data as retrieved from the backend for the record
     */
    private gdprData: any = {};

    /**
     * an indicator if the laoding is completed for the field or the data is still loading
     */
    private loaded = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private modal: modal, private injector: Injector) {
        super(model, view, language, metadata, router);
    }

    /**
     * load the data on intialization
     */
    public ngOnInit() {
        this.backend.getRequest('gdpr/' + this.model.module + '/' + this.model.id).subscribe(gdprData => {
            this.gdprData = gdprData;
            this.loaded = true;
        });
    }

    /**
     * returns the style for the DATA pill
     */
    private getDataStyle() {
        if (!this.loaded) return {};

        if (this.model.data.gdpr_data_agreement == '1') {
            return {
                'background-color': '#009900',
                'color': 'white',
                'cursor': 'pointer'
            };
        }

        if (this.gdprData && this.gdprData.related) {
            for (let item of this.gdprData.related) {
                if (item.gdpr_data_agreement == '1') {
                    return {
                        'background-color': '#009900',
                        'color': 'white',
                        'cursor': 'pointer'
                    };
                }
            }
        }

        return {
            'background-color': '#cc0000',
            'color': 'white',
            'cursor': 'pointer'
        };

    }

    /**
     * return the stle for the MARKETING pill
     */
    private getMarketingStyle() {
        if (!this.loaded) return {};

        // if agreement was granted
        if (this.model.data.gdpr_marketing_agreement == 'g') {
            return {
                'background-color': '#009900',
                'color': 'white',
                'cursor': 'pointer'
            };
        }

        // if agreement was granted
        if (this.model.data.gdpr_marketing_agreement == 'r') {
            return {
                'background-color': '#cc0000',
                'color': 'white',
                'cursor': 'pointer'
            };
        }

        if (this.gdprData.related) {
            for (let item of this.gdprData.related) {
                if (item.gdpr_marketing_agreement == '1') {
                    return {
                        'background-color': '#009900',
                        'color': 'white',
                        'cursor': 'pointer'
                    }
                }
            }
        }

        return {
            'background-color': '#cc0000',
            'color': 'white',
            'cursor': 'pointer'
        };
    }

    /**
     * renders the details modal
     */
    private showDetails() {
        this.modal.openModal('ObjectGDPRModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.gdprRelatedLog = this.gdprData.related;
            modalRef.instance.gdprAuditLog = this.gdprData.audit;
        });
    }
}
