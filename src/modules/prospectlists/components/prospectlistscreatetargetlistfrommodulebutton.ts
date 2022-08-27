/**
 * @module ModuleProspectLists
 */
import {Component, OnInit, Injector} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
declare var _;

/**
 * renders the button for the Audit log. This is uised in the standard actionsets
 */
@Component({
    selector: 'prospectlists-create-targetlist-from-module-button',
    templateUrl: '../templates/prospectlistscreatetargetlistfrommodulebutton.html',

})
export class ProspectListsCreateTargetListFromModuleButton implements OnInit {

    /**
     * keeps modules declared in the actionset config
     */
    public actionconfig: any = {};

    /**
     * the loaded modules with object data
     * */
    public beans: any = [];

    /**
     * modal loading
     * */
    public loading: boolean = true;

    /**
     * standard acl for the button
     * */
    public disabled: boolean = true;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public backend: backend,
        public injector: Injector,
        public toast: toast
    ) {

    }

    public ngOnInit() {
        if (this.model.module && this.metadata.checkModuleAcl('ProspectLists', 'create')) {
            this.disabled = false;
        }
    }

    /**
     * open the modal
     * loading module list related to the bean
     */
    public execute() {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest('module/ProspectLists/getrelated/' + this.model.module + '/' + this.model.id, {modules: this.actionconfig.modules}).subscribe(result => {
            loadingModal.emit(true);
            if (result) {
                this.beans = result;
                this.modal.openModal('ProspectListsCreateTargetListFromModuleModal', true, this.injector).subscribe(modalRef => {
                        modalRef.instance.result = this.beans;
                        modalRef.instance.parentBeanId = this.model.id;
                        modalRef.instance.parentModule = this.model.module;
                    }
                );
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR_LOADING_DATA'), 'error');
            }
        });
    }
}
