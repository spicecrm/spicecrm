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
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsexporttargetlistbutton.html',
})
export class ObjectListHeaderActionsExportTargetlistButton {

    /**
     * only "hidden" is used
     */
    public disabled: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private injector: Injector
    ) {}

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
            if(fielddef.type == 'link' && fielddef.module == 'ProspectLists'){
                hasProspectlistLink = true;
                break;
            }
        }
        if(!hasProspectlistLink) return true;

        // check the export right as well
        return !this.metadata.checkModuleAcl(this.model.module, 'export');
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
