/**
 * @module ObjectComponents
 */


import {
    Component
} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {Observable, Subject} from "rxjs";

/**
 * renders in the list header action menu and offers the user the option to export the list to a targetlist
 */
@Component({
    selector: 'object-list-header-actions-export-targetlist-modal',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsexporttargetlistmodal.html',
    providers: [model]
})
export class ObjectListHeaderActionsExportTargetlistModal {

    private self: any = {};
    private targetlistname: string = '';

    constructor(private language: language, private router: Router, private metadata: metadata, private backend: backend, private toast: toast, private modal: modal, private modellist: modellist) {
    }

    private close() {
        this.self.destroy();
    }

    get itemcount() {
        return this.modellist.listData.totalcount;
    }

    private export() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';

            let selectedIds = this.modellist.getSelectedIDs();
            let params = {
                listtype: this.modellist.currentList.id,
                targetlistname: this.targetlistname,
                owner: this.modellist.currentList.id == 'owner' ? true : false,
                module: this.modellist.module,
                modulefilter: this.modellist.modulefilter,
                searchterm: this.modellist.searchTerm,
                aggregates: this.modellist.selectedAggregates,
                listid: this.modellist.currentList.id,
                ids: selectedIds
            };
            this.backend.postRequest('module/ProspectLists/exportfromlist', {}, params).subscribe(result => {
                loadingRef.instance.self.destroy();
                if (result.status == 'success') {
                    this.router.navigate(['/module/ProspectLists/' + result.id]);
                    this.close();
                } else {
                    this.toast.sendToast(result.msg, 'error');
                }
            });
        });
    }

}
