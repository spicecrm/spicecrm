/**
 * @module ServiceComponentsModule
 */
import {Component, SkipSelf} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from '../../../services/view.service';
import {toast} from "../../../services/toast.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: '../templates/serviceticketprolongmodal.html',
    providers: [model, view]
})
export class ServiceTicketProlongModal {
    public self: any = {};
    public prolongDate: any = new moment();
    public minDate: any;
    public maxDate: any;
    public prolongReason: string = '';
    public saving: boolean = false;

    /**
     * the componentset id to render prolongation form
     */
    public componentset: string = '';

    /**
     * the name of the field containing SLA field
     */
    public sladatefield: string = 'resolve_until';

    /**
     * the maximal number of days in the future the user can select a date with the date picker
     * default is 5 as it was hard coded before introducing this parameter in 2022.03.001
     */
    public prolongmaxdays: number = 5;

    /**
     * the componentconfig set in ServiceTicketProlongModal
     */
    public componentconfig: any = {};

    constructor(
        @SkipSelf() public serviceticket: model,
        public model: model,
        public view: view,
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public toast: toast
    ) {

        // initialize model for ServiceTicketProlongation
        this.initializeProlongation();

        // grab component config
        this.componentconfig = this.metadata.getComponentConfig('ServiceTicketProlongModal', this.model.module);
        this.componentset = (this.componentconfig.componentset ? this.componentconfig.componentset : this.componentset);
        this.prolongmaxdays = (this.componentconfig.prolongmaxdays ? this.componentconfig.prolongmaxdays : this.prolongmaxdays);
        this.sladatefield = (this.componentconfig.sladatefield ? this.componentconfig.sladatefield : this.sladatefield);

        // set default parameters for date picker
        this.minDate = new moment();
        this.maxDate = new moment().add(this.prolongmaxdays, 'days');
    }

    /**
     * initialize ServiceTicketProlongation model
     */
    public initializeProlongation() {
        this.model.module = 'ServiceTicketProlongations';
        this.model.initialize();
        this.model.executeCopyRulesParent(this.serviceticket);
        // on first prolongation, set the value to sladatefield
        if(!this.model.getField('prolonged_until')){
            this.model.setField('prolonged_until', this.serviceticket.getField(this.sladatefield));
        }
        this.setEditMode();
    }

    /**
     * set view edit mode
     */
    public setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * cancel prolongation process and close modal window
     */
    public cancel() {
        this.self.destroy();
    }

    /**
     * will save a serviceticketprolongation
     * and set the prolonged_until in the ticket
     */
    public save() {
        if(this.validate()){
            // logic for backward compatibility: no componentset in use
            if(!this.componentset){
                let _body = {
                    prolonged_until: this.prolongDate.format("YYYY-MM-DD"),
                    prolongation_reason: this.prolongReason // this is a text and will saved to description in ServiceTicketProlongation;
                };

                // save ticket & prolongation
                this.backend.postRequest('module/ServiceTickets/' + this.serviceticket.id + '/prolong', {}, _body).subscribe(
                    status => {
                        this.model.setField('prolonged_until', this.prolongDate);
                        this.self.destroy();
                    },
                    error => {
                        this.saving = false;
                    });

            } else { // componentset in use
                // save prolongatiom
                this.model.setField('name',  this.model.getField('assigned_user_name') + '/' + this.prolongDate.format("YYYY-MM-DD"));
                this.view.setViewMode();
                this.model.save().subscribe(success => {
                    // save ticket
                    this.serviceticket.setField('sladeviation_reason', this.model.getField('description'));
                    this.serviceticket.setField('prolonged_until', this.prolongDate.format("YYYY-MM-DD"));
                    this.serviceticket.save(true).subscribe(success => {
                        this.self.destroy();
                    }, error => {
                        this.toast.sendToast('LBL_DATA_NOT_SAVED', 'error');
                    });
                }, error => {
                    this.toast.sendToast('LBL_DATA_NOT_SAVED', 'error');
                });
            }
        }
    }

    /**
     * check if prolonged date was changed.
     * It has to be changed else it doesn't make sense to prolong
     */
    public validate(){
        if(this.serviceticket.getField('prolonged_until') != null && this.model.getField('prolonged_until').format("YYYY-MM-DD") == this.serviceticket.getField('prolonged_until').format("YYYY-MM-DD")){
            this.toast.sendToast('MSG_MODIFY_PROLONGATION_DATE', 'error');
            return false;
        }
        return true;
    }

    /**
     * set the selected date to prolong to
     * @param date
     */
    public setDate(date) {
        this.prolongDate = date;
        this.model.setField('prolonged_until', this.prolongDate);
    }
}
