import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from 'rxjs';
import {metadata} from "../../../services/metadata.service";

declare var moment: any;

@Component({
    selector: 'tele_sales_cockpit_add_attempt_modal',
    templateUrl: './src/modules/telesales/templates/telesalescockpitaddattemptmodal.html',
    providers: [model, view]
})
export class TeleSalesCockpitAddAttemptModal implements OnInit {

    componentconfig: any = {};
    @Input() data: any;
    @Input() selectedLogId: any;
    @Input() maxAttempts: any;
    self: any;
    fieldset: any;
    isAttemptAdded: boolean = false;
    response: Observable<object> = null;
    responseSubject: Subject<any> = null;


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


    ngOnInit() {
        this.model.module = 'CampaignLog';
        this.model.id = this.data.id;
        this.model.data = {
            hits: this.data.hits,
            planned_activity_date: this.data.planned_activity_date,
            activity_type: this.data.activity_type,
            activity_date: '',
        };

        this.componentconfig = this.metadata.getComponentConfig('TeleSalesCockpitAddAttemptModal');
        this.fieldset = this.componentconfig.fieldset;

        // set view to editable and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();
        this.model.data.planned_activity_date = new moment().add(1, 'days');
        this.model.data.activity_date = new moment();

    }

    cancel() {
        this.responseSubject.next( false );
        this.responseSubject.complete();
        this.self.destroy();
    }

    onModalEscX() {
        this.cancel();
    }

    save() {

            // execute on backend
            let planned_activity_date = this.modelutilities.spice2backend(this.model.module, 'planned_activity_date' , this.model.data.planned_activity_date);
            let status = 'attempted';

            this.backend.postRequest('/module/CampaignLog/' + this.selectedLogId + '/' + status,
                {planned_activity_date: planned_activity_date}).subscribe(status => {

                // send toast and set complete
                if (status.success) {
                    this.isAttemptAdded = true;
                    this.toast.sendToast('Attempt added successfully', 'success');
                    this.responseSubject.next( 'attempted' );
                    this.responseSubject.complete();
                    this.self.destroy();


                }
                else {
                    this.toast.sendToast('Error, try again later');
                    this.self.destroy();
                }

            });
    }

    remove() {

        // execute on backend
        this.backend.postRequest('/module/CampaignLog/' + this.model.id + '/completed').subscribe(status => {

            // send toast and set complete
            if (status.success) {
                this.toast.sendToast('Successfully removed from list!', 'success');
                this.model.data.activated = true;
                this.responseSubject.next( "removed" );
                this.self.destroy();

            }
            else
                this.toast.sendToast('Error,  try again later');

        });
        
    }

}