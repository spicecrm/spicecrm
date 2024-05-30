import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import { toast } from '../../../services/toast.service';

@Component({
    selector: 'event-booking-table-item',
    templateUrl : '../templates/eventbookingtableitem.html',
    providers: [model, view]
})

export class EventBookingTableItem implements OnInit{
    /**
     * cell information
     */
    @Input() public cell: any = {};


    /**
     * fieldset in use
     */
    @Input() public fieldset: any = {};

    /**
     * isdeleted
     */
    @Output() deleteBooking = new EventEmitter<string>();

    /**
     * the fields if they are rendered
     */
    public status: string = "";

    /**
     * the fields if they are rendered
     */
    public fields: any[] = [];

    public isSavingParticipation = false;

    constructor(
        public metadata: metadata,
        public model: model,
        public view: view,
        public toast: toast
    ) {
        this.view.isEditable = false;
    }

    ngOnInit() {
        this.renderItem();
    }

    /**
     * get the fieldset fields
     */
    private renderItem(){
        this.fields = this.metadata.getFieldSetFields(this.fieldset);
        if(this.cell.booking) this.setEventBookingModel();
    }

    /**
     * set relate data for provided model
     */
    private setEventBookingModel(){
        this.model.module = "EventBookings";
        this.model.id = this.cell.booking?.id;
        if(this.cell.booking?.id) {
            this.model.setData(this.cell.booking);
        }
    }

    /**
     * returns the color for the status
     */
    get getItemBackground() {
        let color: string = '';

        switch (this.cell.status) {
            case 'booked':
                color = '#FFFFFF';
                break;
            case 'available':
                color = '#C9FFC7';
                break;
            case 'overbooked':
                color = '#ECFFBA';
                break;
            default:
                color = '#FFFFFF';
                break;
        }
        return color;
    }

    /**
     * delete booking
     */
    public delete(){
        this.deleteBooking.emit(this.cell.booking);
    }

    /**
     * set/unset participation
     */
    public setParticipated(participated){
        this.isSavingParticipation = true;
        let valueToReset = this.model.getField('participated');
        this.model.setField('participated', participated);
        this.model.save().subscribe(
            () => {
                this.isSavingParticipation = false;
            }, error => {
                this.model.setField('participated', valueToReset );
                this.toast.sendToast('Error saving participation info.','error');
                this.isSavingParticipation = false;
            });
    }

}
