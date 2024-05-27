/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {SystemLoadingModal} from "../../../systemcomponents/components/systemloadingmodal";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'reporter-integration-targetlistexport-modal',
    templateUrl: '../templates/reporterintegrationtargetlistexportmodal.html',
    providers: [model]
})
export class ReporterIntegrationTargetlistexportModal{

    public self: any = {};
    public model: any = {};
    public whereConditions: any = {};
    public targetlist_action: string = 'new';
    public targetlistname: string = '';
    public targetlist_update_action: string = '';
    public targetlist_update_id: string = '';

    constructor(
        public language: language,
        public metadata: metadata,
        public backend: backend,
        public modal: modal,
        public prospectListModel: model,
        public toast: toast) {

    }

    public closeModal() {
        this.self.destroy();
    }

    public exportTargetList() {

        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            // set the loading popover message
            modalRef.instance.messagelabel = 'LBL_EXPORTING';
            let requestbody = {};
            switch(this.targetlist_action){
                case 'new':
                    // generate body
                    requestbody = {
                        targetlist_action: "new",
                        targetlist_name: this.targetlistname,
                        record: this.model.id,
                        whereConditions: window.btoa(JSON.stringify(this.whereConditions))
                    };
                    break;
                case 'update':
                    // generate body
                    const targetListValueArray = this.targetlist_update_id.split('::');
                    requestbody = {
                        targetlist_action: "update",
                        targetlist_id: targetListValueArray[0],
                        targetlist_update_action: this.targetlist_update_action,
                        targetlist_update_action_now: true,
                        record: this.model.id,
                        whereConditions: window.btoa(JSON.stringify(this.whereConditions))
                    };
                    break;
            }

            // run the query
            this.backend.postRequest('module/KReports/plugins/action/ktargetlistexport/export_to_targetlist', {}, requestbody).subscribe(
                {
                    next: (res) => {
                        this.toast.sendToast(this.language.getLabel('LBL_SUCCESS'), 'success');
                        this.resetParameters();
                        modalRef.instance.self.destroy();
                        this.closeModal();
                    },
                    error: err => {
                        this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                        this.resetParameters();
                        modalRef.instance.self.destroy();
                        this.closeModal();
                    }
                }
            );
        });
    }

    /**
     * will check if the button can be pushed
     */
    public canExport(){
        let canExport = true;
        switch(this.targetlist_action){
            case 'new':
                if(this.targetlistname.length <= 0) canExport = false;
                break;
            case 'update':
                if(this.targetlist_update_id.length <=0 || this.targetlist_update_action.length <=0) canExport = false;
                break;
        }
        return !canExport;
    }

    /**
     * will reset the data entered when the main action is changed
     */
    public resetParameters(){
        this.targetlistname = '';
        this.targetlist_update_id = '';
        this.targetlist_update_action = '';
    }

}
