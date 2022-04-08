/**
 * @module ObjectFields
 */
import {Component, Injector, OnInit} from '@angular/core';
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
     * an indicator if the loading is completed for the field or the data is still loading
     */
    private loaded = false;
    /**
     * holds the marketing style
     */
    public marketingStyle: {'background-color', 'color', 'cursor'};
    /**
     * holds the data style
     */
    public dataStyle: {'background-color', 'color', 'cursor'};

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private modal: modal, private injector: Injector) {
        super(model, view, language, metadata, router);
    }

    /**
     * load the data on initialization
     */
    public ngOnInit() {
        this.backend.getRequest('common/gdpr/' + this.model.module + '/' + this.model.id).subscribe(gdprData => {
            this.gdprData = gdprData;
            this.loaded = true;
            this.setMarketingStyle();
            this.setDataStyle();
        });

        this.subscriptions.add(
            this.model.data$.subscribe(() => {
                this.setMarketingStyle();
                this.setDataStyle();
            })
        );
    }

    /**
     * set the style for the data pill
     */
    private setDataStyle() {

        if (!this.loaded) return {};
        let color = '#cc0000';

        if (this.model.data.gdpr_data_agreement == '1' || this.gdprData?.related?.some(r => r.gdpr_data_agreement == '1')) {
            color = '#009900';
        }

        this.dataStyle = {
            'background-color': color,
            'color': 'white',
            'cursor': 'pointer'
        };

    }

    /**
     * set the style for the marketing pill
     */
    private setMarketingStyle() {

        if (!this.loaded) return {};

        const fieldDef = this.metadata.getModuleFields(this.model.module)?.gdpr_marketing_agreement;
        let color = '#cc0000';

        // if agreement was granted
        if (
            (fieldDef?.type == 'enum' && this.model.data.gdpr_marketing_agreement == 'g') ||
            (fieldDef?.type?.startsWith('bool') && this.model.data.gdpr_marketing_agreement == 1) ||
            this.gdprData?.related?.some(r => r.gdpr_marketing_agreement == '1')
        ) {
            color = '#009900';
        }

        this.marketingStyle = {
            'background-color': color,
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
            modalRef.instance.gdprAuditLog = this.gdprData.audit.map(log => ({
                ...log,
                model: {
                    module: this.model.module,
                    id: this.model.id,
                    [log.field_name]: this.model.utils.backend2spice(this.model.module, log.field_name, log.value)
                }
            }));
        });
    }
}
