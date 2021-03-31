/**
 * @module DialogMailModule
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";

@Component({
    templateUrl: "./src/include/dialogmail/templates/dialogmailpanel.html"
})
export class DialogMailPanel {

    public dMailList: any[] = [];
    private isLoading: boolean = false;

    constructor(private language: language, private model: model, private metadata: metadata, private backend: backend) {
        this.getUserMails();
    }

    private getUserMails() {
        this.isLoading = true;
        this.backend.getRequest(`channels/emarketing/dialogmail/${this.model.module}/${this.model.id}/mails`)
            .subscribe(res => {
                this.dMailList = res;
                this.isLoading = false;
            });
    }
}
