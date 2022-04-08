/**
 * @module ObjectComponents
 */

/**
 * @ignore
 */
declare var moment: any;

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';

/**
 * renders in the list header action menu and offers the user the option to export the list to a targetlist
 */
@Component({
    selector: 'object-list-header-actions-export-targetlist-button',
    templateUrl: '../templates/objectlistheaderactionsexporttargetlistbutton.html',
})
export class ObjectListHeaderActionsExportTargetlistButton {

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal,
        public injector: Injector
    ) {
    }

    /**
     * cheks the acl rights for the user to export
     */
    get hidden() {
        // check if the user can create a prospetlist
        if (!this.metadata.checkModuleAcl('ProspectLists', 'create')) return true;

        // check if the module can link to a prospectlist
        let hasProspectlistLink = false;
        let fielddefs = this.metadata.getModuleFields(this.modellist.module);
        for (let field in fielddefs) {
            let fielddef = fielddefs[field];
            if (fielddef.type == 'link' && fielddef.module == 'ProspectLists') {
                hasProspectlistLink = true;
                break;
            }
        }
        if (!hasProspectlistLink) return true;

        // check the export right as well
        return !this.metadata.checkModuleAcl(this.model.module, 'export');
    }

    /**
     * ensure we have some items selected
     */
    get disabled() {
        return this.modellist.getSelectedCount() == 0;
    }

    /**
     * returns the number of sleected items or all in the modellist
     */
    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }

    public execute() {
        this.modal.openModal('ObjectListHeaderActionsExportTargetlistModal', true, this.injector);
    }
}
