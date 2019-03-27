/**
 * @module ObjectComponents
 */

/**
 * @ignore
 */
declare var moment: any;

import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {modellist} from '../../services/modellist.service';

/**
 * renders in the list header action menu and offers the user the oiption to download the list
 *
 * either downloads the full list with all entries or the selected entries
 */
@Component({
    selector: 'object-list-header-actions-export-button',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsexportbutton.html',
})
export class ObjectListHeaderActionsExportButton {

    constructor(private language: language, private metadata: metadata, private modellist: modellist, private model: model, private modal: modal, private backend: backend) {
    }

    /**
     * cheks the acl rights for the user to export
     */
    get exportdisabled() {
        return !this.metadata.checkModuleAcl(this.model.module, 'export');
    }

    /**
     * returns the number of sleected items or all in the modellist
     */
    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }

    /**
     * a getter for a filename with the module and the current date & time
     */
    get exportfilename() {
        return this.model.module + '_' + new moment().format('YYYY_MM_DD_HH_mm') + '.csv';
    }

    /**
     * the export action
     */
    private export() {

        if(!this.exportdisabled) {
            this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
                loadingRef.instance.messagelabel = 'LBL_EXPORTING';
                this.modellist.exportList().subscribe(downloadurl => {
                    loadingRef.instance.self.destroy();

                    // handle the download
                    let a: any = document.createElement("a");
                    a.href = downloadurl;
                    a.download = this.exportfilename;
                    a.click();
                    a.remove();

                });
            });
        }

    }
}
