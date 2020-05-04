/**
 * @module ObjectComponents
 */

/**
 * @ignore
 */
declare var moment: any;

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
import {modal} from '../../../services/modal.service';

/**
 * renders in the list header action menu and offers the user the option to export the list to a targetlist
 */
@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocslistheaderactionsprocessbutton.html',
})
export class SAPIDOCsListHeaderActionsProcessButton {

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private injector: Injector
    ) {
    }

    /**
     * only enable if items are selected
     */
    get disabled(): boolean {
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
        this.modal.openModal('SAPIDOCsListHeaderActionsProcessModal', true, this.injector);
    }
}
