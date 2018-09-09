import {Component, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'service-select-queue-modal',
    templateUrl: 'app/modules/servicecomponents/templates/serviceselectqueuemodal.html',
    providers: [model]
})
export class ServiceSelectQueueModal
{
    self: any = {};
    parentqueue_id: string = '';
    queues: Array<any> = [];
    loading: boolean = true;
    displaynote: boolean = true;
    selectedqueueid: string = '';
    note: string = '';
    selectedqueue: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private model:model,
        private metadata:metadata,
        private language:language,
        private backend:backend,
    )
    {
        this.backend.getRequest('module/ServiceQueues').subscribe(queues => {
            for(let queue of queues.list){
                if(queue.id != this.parentqueue_id)
                    this.queues.push(queue)
            }
            this.loading = false;
        })
    }

    cancel(){
        this.selectedqueue.emit(false);
        this.self.destroy();
    }

    save(){
        this.selectedqueue.emit({
            servicequeue_id: this.selectedqueueid,
            servicequeue_name: this.getQueueName(this.selectedqueueid),
            note: this.note
        })
        this.self.destroy();
    }

    private getQueueName(id){
        for(let queue of this.queues){
            if(queue.id == this.selectedqueueid){
                return queue.name;
            }
        }
    }
}