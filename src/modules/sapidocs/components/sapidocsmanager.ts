/**
 * @module ModuleSAPIDOCs
 */
import {Component, Injector} from '@angular/core';
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI} from "../interfaces/moudesapidocs.interfaces";

@Component({
    selector: 'sapidocs-manager',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanager.html',
    providers: [sapIdocsManager]
})
export class SAPIDOCsManager {

    constructor(private language: language, private navigationtab: navigationtab, private modal: modal, private injector: Injector, private sapIdocsManager: sapIdocsManager) {
        // set the tab name
        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_SAP_IDOCS_MANAGER'), displayicon: 'settings'});
    }

    /**
     * saves the changes
     */
    private saveChanges() {
        this.sapIdocsManager.updateSegments();
    }

    /**
     * adds a new idoc type
     */
    private addIdocType() {
        this.modal.openModal('SAPIDOCsManagerIDOCTypeAddModal', true, this.injector);
    }

}

