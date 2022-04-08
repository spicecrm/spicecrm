/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {SystemLoadingModal} from "../../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'reporter-integration-targetlistexport-modal',
    templateUrl: '../templates/reporterintegrationtargetlistexportmodal.html'
})
export class ReporterIntegrationTargetlistexportModal {

    public self: any = {};
    public model: any = {};
    public whereConditions: any = {};

    public targetlistname: string = '';

    constructor(public language: language, public metadata: metadata, public backend: backend, public modal: modal) {
    }

    public closeModal() {
        this.self.destroy();
    }

    public exportTargetList() {

        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            // set the loading popover message
            modalRef.instance.messagelabel = 'LBL_CREATING_TARGETLIST';

            // generate body
            let requestbody = {
                targetlist_action: "new",
                targetlist_name: this.targetlistname,
                record: this.model.id,
                whereConditions: btoa(JSON.stringify(this.whereConditions))
            };

            this.backend.postRequest('module/KReports/plugins/action/ktargetlistexport/export_to_targetlist', {}, requestbody).subscribe(result => {
                modalRef.instance.self.destroy();
                this.closeModal();
            });
        });
    }

}
