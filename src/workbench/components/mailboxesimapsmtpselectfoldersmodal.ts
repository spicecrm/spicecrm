import {Component, OnInit} from "@angular/core";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";

@Component({
    providers: [model, view],
    selector: "mailbox-folders-modal",
    templateUrl: "./src/workbench/templates/mailboxesimapsmtpselectfoldersmodal.html",
})
export class MailboxesIMAPSMTPSelectFoldersModal implements OnInit
{
    public modifiedData = [];
    public self; // needed for selfdestruction... will be set on creation...

    private mailboxes: any[] = [];

    constructor(
        private language: language,
        public model: model,
        private view: view,
    ) {

    }

    public ngOnInit() {

    }

    /**
     * is needed... no other methods known to set model.service and provide it to the childs...
     * if not used, the model will not be provided correctly...
     * @param model
     */
    public setModel(model: model) {
        this.model.id = model.id;
        this.model.module = model.module;
        this.model.data = model.data;
        this.modifiedData = {...model.data};
    }

    public setMailboxes(mailboxes) {
        this.mailboxes = mailboxes;
    }

    public cancel() {
        this.self.destroy();
    }

    public save() {
        this.model.save();
        this.self.destroy();
    }
}