/**
 * @module MailLogModule
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";

@Component({
    templateUrl: "./src/include/maillog/templates/maillogpanel.html"
})
export class MailLogPanel {

    public mailLogList: any[] = [];
    private isLoading: boolean = false;

    constructor(private language: language, private model: model, private metadata: metadata, private backend: backend) {
        this.getUserMails();
    }

    private getUserMails() {
        this.isLoading = true;
        this.backend.getRequest(`/MailLog/Contact/${this.model.id}/mails`)
            .subscribe(res => {
                this.mailLogList = res;
                window.console.log(res);
                this.isLoading = false;
            });
    }
}
