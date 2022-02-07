/**
 * @module ServiceComponentsModule
 */
import {Component, EventEmitter, SkipSelf} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'service-select-queue-modal',
    templateUrl: '../templates/serviceselectqueuemodal.html',
    providers: [model]
})
export class ServiceSelectQueueModal {
    /**
     * reference to the modal itself
     */
    public self: any = {};

    /**
     * the parent queue id
     */
    public parentqueue_id: string = '';

    /**
     * the list of available queues
     */
    public queues: any[] = [];

    /**
     * indicates when we are laoding queues
     */
    public loading: boolean = true;

    /**
     * an indicator if a note shoudl be displayed
     */
    public displaynote: boolean = true;

    /**
     * the id of the selceted queue
     */
    public selectedqueueid: string = '';

    /**
     * the string for the note
     */
    public note: string = '';

    /**
     * an emitter for the selected queue if all was passed properly
     */
    public selectedqueue: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        @SkipSelf() public model: model,
        public serviceticketnote: model,
        public metadata: metadata,
        public backend: backend,
    ) {
        this.parentqueue_id = this.model.getField('servicequeue_id');
        this.backend.getRequest('module/ServiceQueues', {limit: -99}).subscribe(queues => {
            for (let queue of queues.list) {
                if (queue.id != this.parentqueue_id) {
                    this.queues.push(queue);
                    this.queues = this.queues.sort( (a,b) => {
                        return a.name.localeCompare(b.name);
                    });
                }
            }
            this.loading = false;
        });
    }

    /**
     * closes the modal and emits false
     */
    public cancel() {
        this.selectedqueue.emit(false);
        this.self.destroy();
    }

    public save() {

        // set the model fields and save the model
        this.model.setField('servicequeue_id', this.selectedqueueid);
        this.model.setField('servicequeue_name', this.queues.find(q => q.id == this.selectedqueueid).name);
        this.model.setField('serviceticket_status', 'In Process');
        this.model.save();

        /**
         * save the note
         */
        if(this.note){
            this.serviceticketnote.module = 'ServiceTicketNotes';
            this.serviceticketnote.initialize(this.model);
            this.serviceticketnote.setField('description', this.note);
            this.serviceticketnote.save();
        }

        this.self.destroy();
    }
}
