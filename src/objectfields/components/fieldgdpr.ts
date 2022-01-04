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
    templateUrl: '../templates/fieldgdpr.html'
})
export class fieldGDPR extends fieldGeneric implements OnInit {

    /**
     * the gdpr data as retrieved from the backend for the record
     */
    public gdprData: any = {};

    /**
     * an indicator if the laoding is completed for the field or the data is still loading
     */
    public loaded = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public backend: backend, public modal: modal, public injector: Injector) {
        super(model, view, language, metadata, router);
    }

    /**
     * load the data on intialization
     */
    public ngOnInit() {
        this.backend.getRequest('common/gdpr/' + this.model.module + '/' + this.model.id ).subscribe(gdprData => {
            this.gdprData = gdprData;
            this.loaded = true;
        });
    }

    /**
     * returns the style for the DATA pill
     */
    public getDataStyle() {
        if (!this.loaded) return {};

        if (this.model.getField('gdpr_data_agreement') == '1') {
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
    public getMarketingStyle() {
        if (!this.loaded) return {};

        // if agreement was granted
        if (this.model.getField('gdpr_marketing_agreement') == 'g') {
            return {
                'background-color': '#009900',
                'color': 'white',
                'cursor': 'pointer'
            };
        }

        // if agreement was granted
        if (this.model.getField('gdpr_marketing_agreement') == 'r') {
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
    public showDetails() {
        this.modal.openModal('ObjectGDPRModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.gdprRelatedLog = this.gdprData.related;
            modalRef.instance.gdprAuditLog = this.gdprData.audit;
        });
    }
}
