/**
 * @module ModuleTeleSales
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from 'rxjs';
import {metadata} from "../../../services/metadata.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'tele-sales-cockpit-add-attempt-modal',
    templateUrl: './src/modules/telesales/templates/telesalescockpitaddattemptmodal.html',
    providers: [model, view]
})
export class TeleSalesCockpitAddAttemptModal implements OnInit {

    public response: Observable<object> = null;
    public responseSubject: Subject<any> = null;
    @Input() private selectedListItem: any;
    @Input() private maxAttempts: any;
    private self: any;
    private fieldset: string = '';

    constructor(
        private language: language,
        private model: model,
        private modelutilities: modelutilities,
        private toast: toast,
        private backend: backend,
        private view: view,
        private metadata: metadata,
    ) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit() {
        this.initializeModel();
        this.loadFieldset();
        this.setEditMode();
    }

    private initializeModel() {
        this.model.module = 'CampaignLog';
        this.model.id = this.selectedListItem.id;
        this.model.data = {
            hits: this.selectedListItem.hits,
            planned_activity_date: new moment().add(1, 'days'),
            activity_type: this.selectedListItem.activity_type,
            activity_date: new moment(),
        };
    }

    private loadFieldset() {
        let componentConf = this.metadata.getComponentConfig('TeleSalesCockpitAddAttemptModal');
        this.fieldset = componentConf && componentConf.fieldset ? componentConf.fieldset : '';
    }

    private setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    private cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    private save() {
        let planned_activity_date = this.modelutilities.spice2backend(this.model.module, 'planned_activity_date', this.model.data.planned_activity_date);
        let params = {planned_activity_date: planned_activity_date};

        this.backend.postRequest(`module/CampaignLog/${this.model.id}/attempted`, params)
            .subscribe(
                status => {
                    if (status.success) {
                        this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                        this.responseSubject.next(true);
                        this.responseSubject.complete();
                        this.self.destroy();

                    } else {
                        this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                        this.self.destroy();
                    }
                },
                err => this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error'));
    }

    private remove() {
        this.backend.postRequest(`module/CampaignLog/${this.model.id}/completed`)
            .subscribe(
                status => {
                    if (status.success) {
                        this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                        this.responseSubject.next(true);
                        this.self.destroy();
                    } else {
                        this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                    }
                },
                err => this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error'));
    }
}
