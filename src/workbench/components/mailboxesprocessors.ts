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
 * @module WorkbenchModule
 */
import {Component} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";

@Component({
    selector: "mailboxes-processors",
    templateUrl: "./src/workbench/templates/mailboxesprocessors.html",
})
export class MailboxesProcessors {
    public processors: any[] = [];

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private model: model,
        private view: view,
    ) {
        this.model.module = "Mailboxes";
        this.view.isEditable = true;
        this.view.setEditMode();
        this.getProcessors();
    }

    public addProcessor() {
        if (!this.model.data.mailbox_processors) {
            this.model.data.mailbox_processors = [];
        }

        this.model.data.mailbox_processors.push({
            id: this.model.generateGuid(),
            class: "",
            method: "",
            priority: "",
            stop_on_success: "",
            deleted: false
        });
    }

    public removeProcessor(processor_id: string) {
        this.model.data.mailbox_processors.forEach(function(processor) {
            if (processor.id === processor_id) {
                processor.deleted = true;
            }
        });
    }

    get processorsvisible() {
        return this.model.data.mailbox_processors.length > 0;
    }

    public getProcessorMethods(classname: string) {
        for (let processor of this.processors) {
            if (processor.processor_class == classname) {
                return processor.methods;
            }
        }
        return [];
    }

    private getProcessors(): Observable<any> {
        let responseSubject = new Subject<Array<any>>();

        this.backend.getRequest("mailboxes/getmailboxprocessors")
            .subscribe((response: any) => {
                if (response.result === true) {
                    this.processors = response.processors;
                }
                responseSubject.next(response);
                responseSubject.complete();
            });

        return responseSubject.asObservable();
    }
}
