/**
 * @module ServiceComponentsModule
 */
import {Component, EventEmitter, SkipSelf} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {ServiceQueueI} from "../interfaces/servicecomponents.interfaces";
import {firstValueFrom, Subscription} from "rxjs";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'service-select-queue-modal',
    templateUrl: '../templates/serviceselectqueuemodal.html',
    providers: [model, modellist]
})
export class ServiceSelectQueueModal {
    /**
     * reference to the modal itself
     */
    public self: any = {};

    /**
     * the current queue id for the service ticket
     */
    public parentqueue_id: string = '';

    /**
     * the list of available queues
     */
    public queues: any[] = [];

    /**
     * getter for template
     */
    get queuelist() {
        return this.queues.filter(queue => {if(queue.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0) return true;  return false;}).sort((a, b) => a.name.localeCompare(b.name));
    }

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

    /**
     * a search term to filter the queue list
     */
    public searchTerm: string = '';

    /**
     * holds component subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    constructor(
        @SkipSelf() public model: model,
        public serviceticketnote: model,
        public metadata: metadata,
        public backend: backend,
        public modellist: modellist,
        public modal: modal
    ) {
        this.parentqueue_id = this.model.getField('servicequeue_id');

        this.modellist.initialize('ServiceQueues');
        this.modellist.setListType('all', false);
        this.modellist.setSortField( 'name', 'ASC' );
        this.modellist.loadlimit = -99;
        this.modellist.useCache = true;
        this.modellist.searchTerm = this.searchTerm;
        this.subscriptions.add(
            this.modellist.getListData().subscribe( data => {
                if ( data ) {
                    this.queues = this.modellist.listData.list;
                }
                this.loading = false;
            }));
    }

    /**
     * filter the queues according to search
     */
    get queueList(): ServiceQueueI[] {
        return this.queues.filter(queue => {if(queue.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0) return true;  return false;}).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * closes the modal and emits false
     */
    public cancel() {
        this.selectedqueue.emit(false);
        this.subscriptions.unsubscribe();
        this.self.destroy();
    }

    /**
     * track queue list for filter
     * @param index
     * @param item
     */
    public trackByFn(index, item) {
        return item.id;
    }


    /**
     * save the new Queue ID and the ServiceTicketNote for history
     */
    public async save() {
        const loadingModal = this.modal.await('LBL_SAVING_DATA');

        // set the model fields and save the model
        this.model.setField('servicequeue_id', this.selectedqueueid);
        this.model.setField('servicequeue_name', this.queues.find(q => q.id == this.selectedqueueid).name);
        this.model.setField('serviceticket_status', 'In Process');
        await firstValueFrom(this.model.save());

        /**
         * save the note
         */
        if(this.note){
            this.serviceticketnote.module = 'ServiceTicketNotes';
            this.serviceticketnote.initialize(this.model);
            this.serviceticketnote.setField('description', this.note);
            await firstValueFrom(this.serviceticketnote.save());
        }

        loadingModal.next(true);
        loadingModal.complete();

        this.subscriptions.unsubscribe();

        this.self.destroy();
    }
}
