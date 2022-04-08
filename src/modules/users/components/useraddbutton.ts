/**
 * @module ModuleUsers
 */
import {Component, Injector} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * a special button to enable adding a user
 */
@Component({
    selector: 'user-add-button',
    templateUrl: "../templates/useraddbutton.html"
})

export class UserAddButton {

    /**
     * set the button to disabled
     */
    public disabled: boolean = true;

    constructor(public modal: modal, public language: language, public model: model, public session: session, public metadata: metadata, public injector: Injector, public configurationService: configurationService) {
        // CR1000463: use spiceacl to enable listing and access foreign user records
        // keep BWC for old modules/ACL/ACLController.php
        let _aclcontroller = this.configurationService.getSystemParamater('aclcontroller');
        if( _aclcontroller && _aclcontroller != 'spiceacl') {
            if (this.session.isAdmin) this.disabled = false;
        } else {
            if (this.metadata.checkModuleAcl('Users', 'create')) {
                this.disabled = false;
            }
        }
    }

    /**
     * execute the click on the button
     *
     * @private
     */
    public execute() {
        this.modal.openModal("UserAddModal", true, this.injector);
    }
}
