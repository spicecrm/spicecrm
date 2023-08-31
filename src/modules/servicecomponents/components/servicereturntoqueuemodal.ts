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
    selector: 'service-return-to-queue-modal',
    templateUrl: '../templates/servicereturntoqueuemodal.html',
    providers: [model, modellist]
})
export class ServiceReturnToQueueModal {
    /**
     * reference to the modal itself
     */
    public self: any = {};

    /**
     * the current queue id for the service ticket
     */
    public returntoqueue_id: string = '';

    /**
     * the list of available queues
     */
    public queues: any[] = [];

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
     * indicates when we are laoding queues
     */
    public loading: boolean = true;
    /**
     * an emitter for the selected queue if all was passed properly
     */
    public selectedqueue: EventEmitter<any> = new EventEmitter<any>();

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
        this.returntoqueue_id = this.model.getField('returntoqueue_id');

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
     * save the new Queue ID and the ServiceTicketNote for history
     */
    public async save() {
        const loadingModal = this.modal.await('LBL_SAVING_DATA');

        // set the model fields and save the model
        this.model.setField('servicequeue_id', this.returntoqueue_id);
        this.model.setField('returntoqueue_id', '');
        this.model.setField('serviceticket_status', 'Returned');
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
