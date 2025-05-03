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
    selector: 'tele-sales-cockpit-add-attempt-modal',
    templateUrl: '../templates/telesalescockpitaddattemptmodal.html',
    providers: [model, view]
})
export class TeleSalesCockpitAddAttemptModal implements OnInit {

    public response: Observable<object> = null;
    public responseSubject: Subject<any> = null;
    @Input() public selectedListItem: any;
    @Input() public maxAttempts: any;
    @Input() public campaignTask: any;
    public self: any;
    public fieldset: string = '';

    public reserved: boolean;

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
        this.model.initialize();
        this.model.module = 'CampaignLog';
        this.model.id = this.selectedListItem.id;
        this.model.startEdit(false);
        this.model.setData({
            hits: parseInt(this.selectedListItem.hits) + 1,
            planned_activity_date: new moment().add((this.campaignTask.telesales_attempt_delay ? this.campaignTask.telesales_attempt_delay : 1), 'hours'),
            activity_type: this.selectedListItem.activity_type,
            activity_date: new moment(),
        }, false);
    }

    public loadFieldset() {
        let componentConf = this.metadata.getComponentConfig('TeleSalesCockpitAddAttemptModal');
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

        let awaitModal = this.modal.await('LBL_SAVING');
        let planned_activity_date = this.modelutilities.spice2backend(this.model.module, 'planned_activity_date', this.model.getField('planned_activity_date'));
        let planned_activity_user_id = !!this.reserved ? this.metadata.session.authData.user.id : '';
        let activity_comment = this.modelutilities.spice2backend(this.model.module, 'activity_comment', this.model.getField('activity_comment'));
        let params = {planned_activity_date: planned_activity_date, activity_comment: activity_comment, planned_activity_user_id: planned_activity_user_id};

        this.backend.postRequest(`module/CampaignLog/${this.model.id}/attempted`, params).subscribe({
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

    public remove() {
        this.backend.postRequest(`module/CampaignLog/${this.model.id}/completed`)
            .subscribe({
                next: (status) => {
                    if (status.success) {
                        this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                        this.responseSubject.next(true);
                        this.self.destroy();
                    } else {
                        this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                    }
                },
                error: (err) => {
                    this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error');
                }
            });
    }
}
