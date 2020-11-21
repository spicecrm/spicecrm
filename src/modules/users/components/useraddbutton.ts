/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    templateUrl: "./src/modules/users/templates/useraddbutton.html"
})

export class UserAddButton {

    public disabled: boolean = true;

    constructor(private modal: modal, private language: language, private model: model, private session: session, private metadata: metadata, private configurationService: configurationService) {
        // CR1000463: use spiceacl to enable listing and access foreign user records
        // keep BWC for old modules/ACL/ACLController.php
        let _aclcontroller = this.configurationService.getSystemParamater('aclcontroller');
        if( _aclcontroller && _aclcontroller != 'spiceacl') {
            if (this.session.isAdmin) this.disabled = false;
        } else {
            if (this.metadata.checkModuleAcl('Users', 'edit')) {
                this.disabled = false;
            }
        }
    }

    private execute() {
        this.modal.openModal("UserAddModal");
    }
}
