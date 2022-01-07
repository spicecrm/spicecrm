/**
 * @module DialogMailModule
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";

@Component({
    templateUrl: "../templates/dialogmailpanel.html"
})
export class DialogMailPanel {

    public dMailList: any[] = [];
    public isLoading: boolean = false;

    constructor(public language: language, public model: model, public metadata: metadata, public backend: backend) {
        this.getUserMails();
    }

    public getUserMails() {
        this.isLoading = true;
        this.backend.getRequest(`channels/emarketing/dialogmail/${this.model.module}/${this.model.id}/mails`)
            .subscribe(res => {
                this.dMailList = res;
                this.isLoading = false;
            });
    }
}
