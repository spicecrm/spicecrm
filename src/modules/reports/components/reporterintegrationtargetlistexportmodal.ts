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
    templateUrl: './src/modules/reports/templates/reporterintegrationtargetlistexportmodal.html'
})
export class ReporterIntegrationTargetlistexportModal {

    private self: any = {};
    private model: any = {};
    private whereConditions: any = {};

    private targetlistname: string = '';

    constructor(private language: language, private metadata: metadata, private backend: backend, private modal: modal) {
    }

    private closeModal() {
        this.self.destroy();
    }

    private exportTargetList() {

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

            this.backend.postRequest('kreporter/plugins/action/ktargetlistexport/export_to_targetlist', {}, requestbody).subscribe(result => {
                modalRef.instance.self.destroy();
                this.closeModal();
            });
        });
    }

}
