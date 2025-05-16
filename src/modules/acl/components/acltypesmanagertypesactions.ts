/**
 * @module ModuleACL
 */
import {
    Component,
     Input
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from "../../../services/configuration.service";
import {ACLAction, ACLType} from "../interfaces/aclinterfaces";
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'acltypes-manager-types-actions',
    templateUrl: '../templates/acltypesmanagertypesactions.html',
})
export class ACLTypesManagerTypesActions {

    @Input() public aclType: ACLType;

    /**
     * sets the allowed change scope
     */
    public changescope: 'all' | 'custom' | 'none' = 'none';

    constructor(public backend: backend, public modal: modal, public configurationService: configurationService, public toast: toast) {
        // set teh change scope
        this.changescope = this.configurationService.getCapabilityConfig('core').edit_mode;
    }

    public addAction() {
        this.modal.openModal('ACLTypesManagerTypesAddAction', true).subscribe(modalRef => {
            modalRef.instance.aclType = this.aclType;
        });
    }

    /**
     * check if we can delete
     * @param aclAction
     */
    public canDelete(aclAction: ACLAction){
        if(this.changescope == "none") return false;

        if(aclAction.scope == 'g' && this.changescope != 'all') return false;

        return true;
    }

    public deleteAction(aclAction: ACLAction) {
        if(!this.canDelete(aclAction)) return;

        this.modal.confirm( 'MSG_DELETE_ACL_ACTION', 'MSG_DELETE_ACL_ACTION' ).subscribe( ( answer ) => {
            if(answer) {
                this.backend.deleteRequest(`module/SpiceACLObjects/modules/${this.aclType.acltype.id}/actions/${aclAction.scope}/${aclAction.id}`).subscribe({
                    next: (fielddata) => {
                        this.aclType.aclactions.findIndex(a => a.id == aclAction.id);
                        this.aclType.aclactions.splice(this.aclType.aclactions.findIndex(a => a.id == aclAction.id), 1);
                    },
                    error: (e) => {
                        this.toast.sendToast('Error removing action', 'error')
                    }
                });
            }
        });
    }


}
