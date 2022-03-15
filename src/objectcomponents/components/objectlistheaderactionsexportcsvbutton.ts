/**
 * @module ObjectComponents
 */

/**
 * @ignore
 */
declare var moment: any;

import {Component, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'object-list-header-actions-export-csv-button',
    templateUrl: '../templates/objectlistheaderactionsexportcsvbutton.html',
})
export class ObjectListHeaderActionsExportCSVButton {

    /**
     * defautls to true and is set in ngOnInit
     */
    public hidden: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modellist: modellist,
        public modal: modal,
        public injector: Injector
    ) {}

    /**
     * checks the acl rights for the user to export and that we have some items selected
     */
    get disabled() {
        return !this.metadata.checkModuleAcl(this.model.module, 'export') || this.modellist.getSelectedCount() == 0;
    }

    /**
     * returns the number of sleected items or all in the modellist
     */
    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }

    public execute() {
        if(!this.disabled) {
            this.modal.openModal('ObjectListHeaderActionsExportCSVSelectFields', true, this.injector);
            /*
            this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
                loadingRef.instance.messagelabel = 'LBL_EXPORTING';
                this.modellist.exportList().subscribe(downloadurl => {
                    loadingRef.instance.self.destroy();

                    // handle the download
                    let a: any = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = downloadurl;
                    a.download = this.model.module + '_' + new moment().format('YYYY_MM_DD_HH_mm') + '.csv';
                    a.click();
                    a.remove();

                });
            });
            */
        }
    }

}

