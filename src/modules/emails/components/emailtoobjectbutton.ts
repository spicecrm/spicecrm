/**
 * @module emails
 */
import {Component, EventEmitter, Output} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

/**
 * this renders a buttopn as part of an actionset that allows conversion of an email to an object. The component there allows an action config with the following paramaters:
 *
 * - module: the module name of the object that ahosul be created
 * - checklink: the link in the module pointing towards the component. If this is set the component will check if there are object already linked with that module on that link. And if so disable the button
 */
@Component({
    selector: "email-to-object-button",
    templateUrl: "./src/modules/emails/templates/emailtoobjectbutton.html",
    providers: [relatedmodels]
})
export class EmailToObjectButton {
    private object_module_name: string;
    private actionconfig; // can be set inside actionsets...
    @Output() public actionemitter = new EventEmitter();

    constructor(
        private language: language,
        private model: model,
        private metadata: metadata,
        private modal: modal,
        private relatedmodels: relatedmodels
    ) {

    }

    /**
     * a getter that returns the disabled status. This getter checks if it is allowed for the user to create such a record and if checklink is set in the actioncopnfig if a record already exists
     */
    get disabled() {
        // check ACL if we can crate such an object at all
        if (!this.metadata.checkModuleAcl(this.actionconfig.module, 'create')) return true;
        if (this.actionconfig.checklink) {
            if (this.relatedmodels.isloading) return true;

            if (this.relatedmodels.count > 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.object_module_name = this.actionconfig.module;

        if (this.actionconfig.checklink) {
            this.relatedmodels.module = this.model.module;
            this.relatedmodels.id = this.model.id;
            this.relatedmodels.relatedModule = this.actionconfig.module;
            this.relatedmodels.linkName = this.actionconfig.checklink;
            this.relatedmodels.getData();
        }
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
