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

    public self: ComponentRef<TeleSalesCockpitCallFlowModal>;

    public callStatus: string;
    public response: Observable<object> = null;
    public responseSubject: Subject<any> = null;

    @Input() public maxAttempts: any;
    @Input() public campaignTask: any;
    public fieldset: string = '';
    public numbers:{value: string, label: string}[] = [];

    public reserved: boolean;
    constructor(public language: language,
                public model: model,
                public modal: modal,
                public modelutilities: modelutilities,
                public toast: toast,
                public backend: backend,
                public view: view,
                public metadata: metadata,
                public telecockpit: telecockpitservice,
                public telephony: telephony) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit() {
        this.initializeModel();
        this.loadFieldset();
        this.setEditMode();
        this.getPhoneNumbers();
    }


    /**
     * get all phone numbers from the selected item
     */
    public getPhoneNumbers(){
        this.numbers = [];
        let phones = Object.keys(this.selectedListItem.data).filter(fieldName => fieldName.startsWith(`phone_`));
        phones.forEach(phone=> {
            if(this.selectedListItem.data[phone] && this.selectedListItem.data[phone]!==""){
                this.numbers.push({
                    value:  this.selectedListItem.data[phone],
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

    public loadFieldset() {
        let componentConf = this.metadata.getComponentConfig('TeleSalesCockpitAddAttemptModal');
        this.fieldset = componentConf && componentConf.fieldset ? componentConf.fieldset : '';
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


}
