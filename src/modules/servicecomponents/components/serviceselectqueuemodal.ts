/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        if (!this.model.isEditing) {
            this.model.setField('servicequeue_id', this.selectedqueueid);
            this.model.setField('servicequeue_name', this.getQueueName(this.selectedqueueid));
        } else {
            this.model.startEdit();
            this.model.setField('servicequeue_id', this.selectedqueueid);
            this.model.setField('servicequeue_name', this.getQueueName(this.selectedqueueid));
            this.model.save();
        }

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
