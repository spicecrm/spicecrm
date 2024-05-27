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
    selector: 'field-zip-compress',
    templateUrl: '../templates/fieldzipcompress.html',
    providers: [modelattachments],
})
export class fieldZipCompress extends fieldGeneric {

    public zipCompress: boolean;

    public mailboxZipConfig: string;

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

        this.setUploadSettings(this.model.getField('mailbox_id'));

        this.model.observeFieldChanges('mailbox_id').subscribe(id =>
            this.setUploadSettings(id)
        );
    }

    get zipHidden() {
        return this.mailboxZipConfig == '0';
    }
    private setUploadSettings(mailboxId: string) {
        if (!!mailboxId) {
            this.backend.getRequest("module/Mailboxes/scope").subscribe(
                (results: any) => {
                    const selectedMailboxData = results.find(m => m.value == mailboxId);
                    this.mailboxZipConfig = selectedMailboxData.zip_compress;
                });
        }
    }

    public setZip(value){
        this.model.setField('zip_compress', value);
    }
}
