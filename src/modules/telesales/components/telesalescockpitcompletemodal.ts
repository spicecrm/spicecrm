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
import {telecockpitservice} from "../services/telecockpit.service";
import {modal} from "../../../services/modal.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'tele-sales-cockpit-complete-modal',
    templateUrl: '../templates/telesalescockpitcompletemodal.html',
    providers: [model, view]
})
export class TeleSalesCockpitCompleteModal implements OnInit {

    public response: Observable<object> = null;
    public responseSubject: Subject<any> = null;
    @Input() public selectedListItem: any;
    @Input() public campaignTask: any;
    public self: any;
    public fieldset: any;
    public fieldOutcome: any;
    public fieldconfigOutcome: any;
    public fieldnameOutcome: string = 'outcome';
    public categories: any;

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public modelutilities: modelutilities,
        public toast: toast,
        public backend: backend,
        public view: view,
        public metadata: metadata,
        public telecockpit: telecockpitservice
    ) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit() {
        this.initializeModel();
        this.loadFieldset();
        this.setEditMode();
    }

    /**
     * initilizes the model
     */
    public initializeModel() {
        this.model.module = 'CampaignLog';
        this.model.id = this.selectedListItem.id;
        this.model.getData().subscribe({
            next: (res) => {
                this.model.startEdit();
                this.model.setFields({
                    activity_type: 'completed',
                    activity_date: new moment(),
                });
            }
        });
    }

    public loadFieldset() {
        let componentConf = this.metadata.getComponentConfig('TeleSalesCockpitCompleteModal');
        this.fieldset = componentConf && componentConf.fieldset ? componentConf.fieldset : '';
    }

    public setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    public save() {
        if (!this.model.validate()) {
            return false;
        }

        let awaitModal = this.modal.await('LBL_SAVING');
        let params = {
            outcome_id1: this.model.getField('outcome_id1'),
            outcome_id2: this.model.getField('outcome_id2'),
            outcome_id3: this.model.getField('outcome_id3'),
            outcome_id4: this.model.getField('outcome_id4'),
        }

        this.backend.postRequest(`module/CampaignLog/${this.model.id}/completed`, params).subscribe({
            next: (status) => {
                if (status.success) {
                    this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                    this.responseSubject.next(true);
                    this.responseSubject.complete();
                    this.telecockpit.loadStats();

                    awaitModal.emit(true);
                    this.self.destroy();

                } else {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');

                    awaitModal.emit(true);

                    this.self.destroy();
                }
            },
            error: (err) => {
                this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error')
            }
        });
    }
}
