/**
 * @module ObjectComponents
 */

import {
    Component
} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'object-listview-filter-panel-export-targetlist',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelexporttargetlist.html',
})
export class ObjectListViewFilterPanelExportTargetlist {

    self: any = {};
    listId: string = '';
    targetlistname: string = '';

    constructor(private language: language, private metadata: metadata, private backend: backend, private toast: toast, private router: Router, private modal: modal) {
    }

    close() {
        this.self.destroy();
    }

    export() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_EXPORTING';
            this.backend.postRequest('/modules/ProspectLists/createfromlist/' + this.listId, {targetlistname: this.targetlistname}).subscribe(result => {
                loadingRef.instance.self.destroy();
                if (result.status == 'success') {
                    this.router.navigate(['/module/ProspectLists/' + result.id]);
                    this.close();
                } else {
                    this.toast.sendToast(result.msg, 'error');
                }
            })
        })
    }


}