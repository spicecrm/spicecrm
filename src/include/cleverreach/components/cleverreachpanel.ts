/**
 * @module CleverReachModule
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";

@Component({
    templateUrl: "./src/include/cleverreach/templates/cleverreachpanel.html"
})
export class CleverReachPanel {

    public CRList: any[] = [];
    private isLoading: boolean = false;

    constructor(private language: language, private model: model, private metadata: metadata, private backend: backend) {
        this.getReceiversMailings();
    }

    private getReceiversMailings() {
        this.isLoading = true;
        this.backend.getRequest(`/CleverReach/Contact/${this.model.id}/mails`)
            .subscribe(res => {
                this.CRList = res;
                window.console.log(res);
                this.isLoading = false;
            });
    }
}
