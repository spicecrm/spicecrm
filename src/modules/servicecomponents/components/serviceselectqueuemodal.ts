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
    templateUrl: './src/modules/servicecomponents/templates/serviceselectqueuemodal.html',
    providers: [model]
})
export class ServiceSelectQueueModal {
    private self: any = {};
    private parentqueue_id: string = '';
    private queues: any[] = [];
    private loading: boolean = true;
    private displaynote: boolean = true;
    private selectedqueueid: string = '';
    private note: string = '';
    private selectedqueue: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        @SkipSelf() private model: model,
        private serviceticketnote: model,
        private metadata: metadata,
        private language: language,
        private backend: backend,
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

    private cancel() {
        this.selectedqueue.emit(false);
        this.self.destroy();
    }

    private save() {

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

    private getQueueName(id) {
        for (let queue of this.queues) {
            if (queue.id == this.selectedqueueid) {
                return queue.name;
            }
        }
    }
}
