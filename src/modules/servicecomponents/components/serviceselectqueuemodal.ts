/**
 * @module ServiceComponentsModule
 */
import {Component, EventEmitter, SkipSelf} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'service-select-queue-modal',
    templateUrl: '../templates/serviceselectqueuemodal.html',
    providers: [model]
})
export class ServiceSelectQueueModal {
    public self: any = {};
    public parentqueue_id: string = '';
    public queues: any[] = [];
    public loading: boolean = true;
    public displaynote: boolean = true;
    public selectedqueueid: string = '';
    public note: string = '';
    public selectedqueue: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        @SkipSelf() public model: model,
        public serviceticketnote: model,
        public metadata: metadata,
        public language: language,
        public backend: backend,
    ) {
        this.parentqueue_id = this.model.getField('servicequeue_id');
        this.backend.getRequest('module/ServiceQueues').subscribe(queues => {
            for (let queue of queues.list) {
                if (queue.id != this.parentqueue_id) {
                    this.queues.push(queue);
                }
            }
            this.loading = false;
        });
    }

    public cancel() {
        this.selectedqueue.emit(false);
        this.self.destroy();
    }

    public save() {

        this.model.setField('servicequeue_id', this.selectedqueueid);
        this.model.setField('servicequeue_name', this.getQueueName(this.selectedqueueid));
        this.model.save();

        if(this.note){
            this.serviceticketnote.module = 'ServiceTicketNotes';
            this.serviceticketnote.initialize(this.model);
            this.serviceticketnote.setField('description', this.note);
            this.serviceticketnote.save();
        }

        this.self.destroy();
    }

    public getQueueName(id) {
        for (let queue of this.queues) {
            if (queue.id == this.selectedqueueid) {
                return queue.name;
            }
        }
    }
}
