import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {view} from '../../../services/view.service';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {helper} from '../../../services/helper.service';
import {modal} from '../../../services/modal.service';
import { userpreferences } from '../../../services/userpreferences.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'event-booking-table',
    templateUrl : '../templates/eventbookingtable.html',
    providers : [relatedmodels, model]
})

export class EventBookingTable implements OnInit {

    public isLoaded: boolean = false;

    @Input() public tableData: any = {};

    @Input() public fieldset: any = {};

    @Input() public allowOverflow: boolean = false;

    /**
     * calculated timeblocks
     */
    public timeBlocks: any = {};

    /**
     * capacity rows
     */
    public tableRows: any[][] = [];

    /**
     * ids of bookings
     */
    public bookingIDs: any[] = [];

    constructor(
        public relatedmodels: relatedmodels,
        public view: view,
        public model: model,
        public metadata: metadata,
        public backend: backend,
        public language: language,
        public helper: helper,
        public ViewContainerRef: ViewContainerRef,
        public modal: modal,
        public toast: toast,
        public userpreferences: userpreferences ) {
    }

    public ngOnInit() {
        this.renderTable();
    }

    /**
     * render the table
     */
    public renderTable( activeCapacityType? ){
        this.isLoaded = true;
        this.tableData = activeCapacityType ? activeCapacityType : this.tableData;
        this.calculateTableRows();
    }

    /**
     * calculate all rows with timeslots and cell data
     */
    public calculateTableRows() {
        this.isLoaded = false;
        let numberRows = this.getNumberOfRows();
        this.tableRows = [];

        for (let row = 0;row < numberRows; row++) {
            let cell = 0;
            this.tableRows[row] = [];

            for(let timeslot of this.tableData.calculated_timeslots){

                let booking = Array.isArray(timeslot?.bookings)?timeslot?.bookings[row] : null;
                let capacityData = this.getCapacityAndStatus(timeslot, row, booking);

                this.tableRows[row][cell] = {};
                this.tableRows[row][cell].timeslot = timeslot;
                this.tableRows[row][cell].booking = booking;
                this.tableRows[row][cell].capacity = capacityData.capacity;
                this.tableRows[row][cell].status = capacityData.status;
                cell++;
            }
        }
        this.isLoaded = true;
    }


    /**
     * get eventcapacity (if overbooked get the last capacity)
     */
    public getCapacityAndStatus( timeslot, row, booking ): any {
        let result = {capacity: null, status: 'empty'};
        let counter = 0;

        for (let capacity of timeslot.capacities) {
            for(let i = 0; i < Number(capacity.numberPlaces); i++) {
                if(row == counter){
                    result.capacity = capacity;
                    result.status = 'available';
                    if ( booking ) result.status = 'booked';
                }
                counter++;
            }
        }
        if(counter <= row && booking && this.allowOverflow) {
            result.status = 'overbooked';
            result.capacity = timeslot.capacities[timeslot.capacities.length];
        }
        return result;
    }

    /**
     * calculate number of rows (max of booking places or bookings)
     */
    public getNumberOfRows() {
        let maxNumberRows = 0;
        for(let timeslot of this.tableData.calculated_timeslots) {
            let numberRows = 0;
            let numberBookings = timeslot.bookings?.length;
            for ( let capacity of timeslot.capacities ) numberRows += Number( capacity.numberPlaces );
            if ( numberRows < numberBookings && this.allowOverflow ) numberRows = numberBookings;
            if ( maxNumberRows < numberRows ) maxNumberRows = numberRows;
        }
        return maxNumberRows;
    }

    /**
     * create new model eventbooking and open EventBookingAddModal with presets data
     */
    public createEventBooking(timeslot) {
        this.model.module = 'EventBookings';
        this.model.id = undefined;
        this.model.initialize();
        this.model.setField('date_start', moment.unix(timeslot.tsFrom));

        // this.model.setField('eventcapacitytype_date_start', this.tableData.date_start);
        // this.model.setField('eventcapacitytype_date_end', this.tableData.date_end);
        // this.model.setField('eventcapacitytype_duration_minutes', this.tableData.duration);

        let capacityData = this.getCapacityAndStatus(timeslot, timeslot?.bookings?.length, null);

        if(capacityData.capacity) {
            this.model.setField('event_capacity_id', capacityData.capacity.id);
            this.model.setField('event_capacity_name', capacityData.capacity.name);
        } else {
            this.model.data.event_id = this.tableData.event_id;
            this.model.data.event_type = this.tableData.id;
        }

        this.modal.openModal('EventBookingAddModal', true, this.ViewContainerRef.injector).subscribe(editModalRef => {
            if (editModalRef) {
                editModalRef.instance.model.isNew = true;
                editModalRef.instance.capacityType = this.tableData;
                this.model.startEdit();

                // wait for the response
                editModalRef.instance.action.subscribe(add => {
                    if (add) {
                        for(let timeslot of this.tableData.calculated_timeslots){
                            if(timeslot.tsFrom == add.data.date_start.unix()) {
                                timeslot.bookings.push(add.data);
                            }
                        }
                        this.renderTable();
                    }
                })
            }
        });
    }

    /**
     * delete booking
     */
    public deleteItem(event) {
        this.helper.confirm(this.language.getLabel('MSG_DELETE_RECORD'), this.language.getLabel('MSG_DELETE_RECORD', null, 'long'))
            .subscribe(answer => {
                if (answer) {
                    for(let timeslot of this.tableData.calculated_timeslots){
                        if(timeslot.tsFrom == event.date_start.unix()) {
                            for(let key in timeslot.bookings){
                                if(timeslot.bookings[key].id == event.id) {
                                    timeslot.bookings.splice(key, 1);

                                    let body = {
                                        ids: [event.id],
                                        action: 'DELETE'
                                    };
                                    this.backend.patchRequest(`module/EventBookings`, {}, body).subscribe(res => {
                                        this.renderTable();
                                    });
                                }
                            }
                        }
                    }
                }
            });
    }


    /**
     * get the hidden attribute if the acl right is not granted
     */
    public showAddButton(timeSlot ) {
        return (
            timeSlot.bookings.length < timeSlot.numberPlaces
            && this.metadata.checkModuleAcl('EventBookings', 'create')
            && moment().unix() < timeSlot.tsFrom
        );
    }


    public getColumnStyle(timeBlock) {
        if(moment().unix() < timeBlock.tsFrom) {
            return '';
        } else if(moment().unix() < timeBlock.tsTo) {
            return 'border-left: 4px solid rgb(127, 255, 122)';
        }else {
            return 'background-color: #fafafa';
        }
    }

    public counter(i: string) {
        return new Array<number>(parseInt(i,10));
    }

    public getTime(from: string) {
        return moment.unix(from).format( this.userpreferences.getTimeFormat() );
    }

    public getDate(from: string) {
        return moment.unix(from).format( this.userpreferences.getDateFormat() );
    }

    public hideDate(from: string) {
        if(moment.unix(from).format('HH:mm') == '00:00') {
            return 'inherit';
        }
        if(from == this.tableData.calculated_ts_date_start) {
            return 'inherit';
        }
        return 'hidden';
    }

    get isEditMode() {
        return this.view.isEditMode();
    }

    get isEditable() {
        return true;
    }
}
