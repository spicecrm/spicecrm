/**
 * @module ModuleProspectLists
 */
import {Component, Input} from '@angular/core';
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import _ from "underscore";
import {modal} from "../../../services/modal.service";
import {Router} from "@angular/router";

/**
 * renders the button for the Audit log. This is uised in the standard actionsets
 */
@Component({
    selector: 'object-create-targetlist-from-module-modal',
    templateUrl: '../templates/prospectlistscreatetargetlistfrommodulemodal.html',
    providers: [model]

})
export class ProspectListsCreateTargetListFromModuleModal {

    @Input() public prospectListName: string = '';

    public self: any = {};

    /**
     * the result with beans from backend call
     */
    public result: any = {};

    /**
     * bean id the target group is created from
     */
    public parentBeanId: string;

    /**
     * module name the target group is created from
     */
    public parentModule: string;

    /**
     * the array with beans to loop through
     */
    public beans: any = [];

    /**
     * count of the selected modules
     */
    public checkedCount = 0;

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public backend: backend,
        public router: Router,
        public toast: toast
    ) {
        this.model.initialize();
    }

    public ngOnInit() {
        this.beans = _.toArray(this.result.modules);
        this.beans.sort((a, b) => a.sort_order && b.sort_order ? a.sort_order > b.sort_order ? 1 : -1 : a.module > b.module ? 1 : -1);
    };

    /**
     * destroy the component
     * @public
     */
    public closeModal() {
        this.self.destroy();
    }

    /**
     * a getter that checks that at least one module is selected
     */
    get canAdd() {
        return this.beans.filter(bean => bean.selected).length > 0;
    }

    /**
     * adds the selected modules
     *
     * @public
     */
    public add(goto: boolean = false) {
        if (!this.prospectListName) {
            this.toast.sendToast(this.language.getLabel('LBL_ENTER_NAME'), 'error');
        } else {
            const loadingModal = this.modal.await('LBL_SAVING_DATA');

            // prepare sending modules to the backend - filter selected checkboxes from the frontend
            let modules = this.beans.filter(b => b.selected).map(b => {
                return {
                    module: b.module,
                    link_names: b.link_names,
                    inclRejGDPR: b.inclRejGDPR,
                    inclInactive: b.inclInactive
                }
            });
            this.backend.postRequest('module/ProspectLists/fromModule', {},
                {
                    prospectListName: this.prospectListName,
                    data: modules,
                    parentBeanId: this.parentBeanId,
                    parentModule: this.parentModule
                }).subscribe({
                next: (res) => {
                    // if goto is set navigate to the prospectlist
                    if (goto) {
                        this.router.navigate(["/module/ProspectLists/" + res.prospectlistid]);
                    } else {
                        this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                    }
                    loadingModal.emit(true);
                    loadingModal.complete();
                }, error: () => {
                    loadingModal.emit(true);
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                }
            });
            this.closeModal();
        }
    }

}
