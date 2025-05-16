/**
 * @module ModuleACL
 */
import {
    Component,
    Input
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {configurationService} from '../../../services/configuration.service';
import {backend} from '../../../services/backend.service';
import {ACLAction, ACLField, ACLType} from "../interfaces/aclinterfaces";
import {toast} from "../../../services/toast.service";


@Component({
    selector: 'acltypes-manager-types-fields',
    templateUrl: '../templates/acltypesmanagertypesfields.html',
})
export class ACLTypesManagerTypesFields {

    @Input() public aclType: ACLType;

    /**
     * sets the allowed change scope
     */
    public changescope: 'all' | 'custom' | 'none' = 'none';

    constructor(public backend: backend, public modal: modal, public configurationService: configurationService, public toast: toast) {
        // set teh change scope
        this.changescope = this.configurationService.getCapabilityConfig('core').edit_mode;
    }

    public addField() {
        this.modal.openModal('ACLTypesManagerTypesAddFields').subscribe(modalRef => {
            modalRef.instance.aclType = this.aclType;
        });
    }

    /**
     * check if we can delete
     * @param aclAction
     */
    public canDelete(aclField: ACLField){
        if(this.changescope == "none") return false;

        if(aclField.scope == 'g' && this.changescope != 'all') return false;

        return true;
    }

    public deleteField(aclField: ACLField) {
        this.modal.confirm( 'MSG_DELETE_ACL_FIELD', 'MSG_DELETE_ACL_FIELD').subscribe( ( answer ) => {
            if(answer) {
                this.backend.deleteRequest(`module/SpiceACLObjects/modules/${this.aclType.acltype.id}/fields/${aclField.scope}/${aclField.id}`).subscribe({
                    next: (fielddata) => {
                        this.aclType.aclfields.splice(this.aclType.aclfields.findIndex(f => f.id == aclField.id), 1);
                    },
                    error: (e) => {
                        this.toast.sendToast('Error removing field', 'error')
                    }
                });
            }
        });
    }

}
