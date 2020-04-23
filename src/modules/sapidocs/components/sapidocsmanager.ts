/**
 * @module ModuleSAPIDOCs
 */
import {Component, Injector} from '@angular/core';
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI} from "../interfaces/moudesapidocs.interfaces";

@Component({
    selector: 'sapidocs-manager',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanager.html',
    providers: [sapIdocsManager]
})
export class SAPIDOCsManager {

    constructor(private language: language, private modal: modal, private injector: Injector, private sapIdocsManager: sapIdocsManager) {}

    private addIdocType() {
        this.modal.openModal('SAPIDOCsManagerIDOCTypeAddModal', true, this.injector);
    }

}

