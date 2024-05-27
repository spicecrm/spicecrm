/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Router} from '@angular/router';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {configurationService} from "../../../services/configuration.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {modelattachments} from "../../../services/modelattachments.service";

/**
 * display the email subject with status based email icon. The subject will get the style line through when the email is completed.
 */
@Component({
    selector: 'field-read-receipt',
    templateUrl: '../templates/fieldreadreceipt.html',
    providers: [modelattachments],
})
export class fieldReadReceipt extends fieldGeneric {

    public sendReadReceipt: boolean;

    public mailboxReadReceiptConfig: string;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public modelattachments: modelattachments,
                public configuration: configurationService) {
        super(model, view, language, metadata, router);
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;

        this.setMailboxSettings(this.model.getField('mailbox_id'));

        this.model.observeFieldChanges('mailbox_id').subscribe(id =>
            this.setMailboxSettings(id)
        );
    }

    get hidden() {
        return this.mailboxReadReceiptConfig == '0';
    }
    private setMailboxSettings(mailboxId: string) {
        if (!!mailboxId) {
            this.backend.getRequest("module/Mailboxes/scope").subscribe(
                (results: any) => {
                    const selectedMailboxData = results.find(m => m.value == mailboxId);
                    this.mailboxReadReceiptConfig = selectedMailboxData.send_read_receipt;
                });
        }
    }

    public setReadReceipt(value){
        this.model.setField('send_read_receipt', value);
    }
}
