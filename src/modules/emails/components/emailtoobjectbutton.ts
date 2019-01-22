import {Component, EventEmitter, Output} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: "email-to-object-button",
    templateUrl: "./src/modules/emails/templates/emailtoobjectbutton.html",
})
export class EmailToObjectButton {
    private object_module_name: string;
    private actionconfig; // can be set inside actionsets...
    @Output() public actionemitter = new EventEmitter();
    public disabled = false;

    constructor(
        private language: language,
        private model: model,
        private modal: modal,
    ) {

    }

    public ngOnInit() {
        this.object_module_name = this.actionconfig.module;
    }

    public execute() {
        this.modal.openModal("EmailToObjectModal", true).subscribe(
            cmpref => {
                cmpref.instance.email_model = this.model;
                cmpref.instance.object_module_name = this.object_module_name;
                cmpref.instance.object_relation_link_name = this.actionconfig.relation_link_name;
                cmpref.instance.object_predefined_fields = this.actionconfig.predefined_fields;
                cmpref.instance.save$.subscribe(
                    data => {
                        this.actionemitter.emit("save");
                    }
                );
            }
        );
    }
}
