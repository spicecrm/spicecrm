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
    templateUrl: "../templates/mailboxesprocessors.html",
})
export class MailboxesProcessors {
    public processors: any[] = [];

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public model: model,
        public view: view,
    ) {
        this.model.module = "Mailboxes";
        this.view.isEditable = true;
        this.view.setEditMode();
        this.getProcessors();
    }

    public addProcessor() {
        if (!this.model.getField('mailbox_processors')) {
            this.model.setField('mailbox_processors',  []);
        }

        this.model.getField('mailbox_processors').push({
            id: this.model.generateGuid(),
            class: "",
            method: "",
            priority: "",
            stop_on_success: "",
            deleted: false
        });
    }

    public removeProcessor(processor_id: string) {
        this.model.getField('mailbox_processors').forEach(function(processor) {
            if (processor.id === processor_id) {
                processor.deleted = true;
            }
        });
    }

    get processorsvisible() {
        return this.model.getField('mailbox_processors').length > 0;
    }

    public getProcessorMethods(classname: string) {
        for (let processor of this.processors) {
            if (processor.processor_class == classname) {
                return processor.methods;
            }
        }
        return [];
    }

    public getProcessors(): Observable<any> {
        let responseSubject = new Subject<any[]>();

        this.backend.getRequest("module/Mailboxes/processors")
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
