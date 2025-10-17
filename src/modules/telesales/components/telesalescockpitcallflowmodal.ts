/**
 * @module ModuleTeleSales
 */
import {Component, ComponentRef, Injector, Input} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {telecockpitservice} from "../services/telecockpit.service";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {empty, Observable, Subject} from "rxjs";
import {fieldPhone} from "../../../objectfields/components/fieldphone";
import {telephony} from "../../../services/telephony.service";


declare var moment: any;

@Component({
    selector: 'telesales-cockpitcall-flow-modal',
    templateUrl: '../templates/telesalescockpitcallflowmodal.html',
    providers: [model, view],
    standalone: false
})

export class TeleSalesCockpitCallFlowModal {

    @Input() public selectedListItem: any;

    public parent: any = undefined;

    public callActions =
        [{label: 'LBL_REACHED', value: 'reached'}, {label: 'LBL_NOT_REACHED', value: 'notreached'}];

    public self: ComponentRef<TeleSalesCockpitCallFlowModal>;

    public callStatus: string;
    public response: Observable<object> = null;
    public responseSubject: Subject<any> = null;

    @Input() public maxAttempts: any;
    @Input() public campaignTask: any;
    public attemptFieldset: string = '';
    public logCallFieldset: string = '';
    public numbers: { value: string, label: string }[] = [];

    public reserved: boolean;

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public modelutilities: modelutilities,
                public toast: toast,
                public backend: backend,
                public view: view,
                public metadata: metadata,
                public injector: Injector,
                public telecockpit: telecockpitservice,
                public telephony: telephony) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit() {
        this.initializeModel();
        this.loadFieldsets();
        this.setEditMode();
        this.getPhoneNumbers();
    }


    /**
     * get all phone numbers from the selected item
     */
    public getPhoneNumbers() {
        this.numbers = [];
        let phones = Object.keys(this.selectedListItem.data).filter(fieldName => fieldName.startsWith(`phone_`));
        phones.forEach(phone => {
            if (this.selectedListItem.data[phone] && this.selectedListItem.data[phone] !== "") {
                this.numbers.push({
                    value: this.selectedListItem.data[phone],
                    label: phone
                });
            }
        })
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

    public loadFieldsets() {
        let componentConf = this.metadata.getComponentConfig('TeleSalesCockpitCallFlowModal');
        this.attemptFieldset = componentConf && componentConf.attemptFieldset ? componentConf.attemptFieldset : '';
        this.logCallFieldset = componentConf && componentConf.logCallFieldset ? componentConf.logCallFieldset : '';
    }

    public setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public close() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    get telephonyActive() {
        return this.telephony.isActive;
    }

    /**
     * triggers the calling of an msisdn
     */
    public initiateCall(e: MouseEvent, value) {
        e.stopPropagation();
        this.telephony.initiateCall(value, {
            relatedid: this.selectedListItem.data.id,
            relatedmodule: this.selectedListItem.data.module,
            relateddata: this.selectedListItem.data
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


    public saveNotReached() {
        let awaitModal = this.modal.await('LBL_SAVING');
        let planned_activity_date = this.modelutilities.spice2backend(this.model.module, 'planned_activity_date', this.model.getField('planned_activity_date'));
        let planned_activity_user_id = !!this.reserved ? this.metadata.session.authData.user.id : '';
        let activity_comment = this.modelutilities.spice2backend(this.model.module, 'activity_comment', this.model.getField('activity_comment'));
        let params = {
            planned_activity_date: planned_activity_date,
            activity_comment: activity_comment,
            planned_activity_user_id: planned_activity_user_id
        };

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

    public saveCalled() {
        this.model.module = 'Calls';
        this.model.id = this.model.generateGuid();
        let item = this.telecockpit.selectedListItem;
        if (!item) {
            return;
        }

        let params = {call_id: this.model.id};

        this.backend.postRequest(`module/CampaignLog/${item.id}/called`, params)
            .subscribe(status => {
                if (status.success) {
                    this.updateItem();
                    this.close();
                }
            }, err => this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error'));
    }


    public updateItem() {
        let item = this.telecockpit.selectedListItem;
        item.hits++;
        item.related_id = this.model.id;
        item.planned_activity_date = undefined;
    }

    public saveAndClose() {
        let item = this.telecockpit.selectedListItem;
        if (!item) {
            return;
        }
        this.modal.openModal('TeleSalesCockpitCompleteModal', true, this.injector).subscribe(modalRef => {
            modalRef.instance.selectedListItem = item;
            modalRef.instance.campaignTask = this.telecockpit.selectedcampaigntask;
            modalRef.instance.response.subscribe(response => {
                if (!!response) {
                    this.removeItem(item);
                    this.close();
                }
            })
        });
    }

    public removeItem(item) {
        let index = this.telecockpit.listItems.indexOf(item);
        if (index < 0) {
            return;
        }
        this.telecockpit.listItems.splice(index, 1);
        this.telecockpit.listItems = this.telecockpit.listItems.slice();
        this.telecockpit.selectedListItem$ = this.telecockpit.listItems[0];
    }

}
