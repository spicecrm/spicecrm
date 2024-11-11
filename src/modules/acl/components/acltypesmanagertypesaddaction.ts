/**
 * @module ModuleACL
 */
import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {configurationService} from "../../../services/configuration.service";
import {ACLAction, ACLType} from "../interfaces/aclinterfaces";
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'acltypes-manager-types-add-action',
    templateUrl: '../templates/acltypesmanagertypesaddaction.html',
})
export class ACLTypesManagerTypesAddAction implements OnInit{

    /**
     * reference to the modal itself
     */
    private self: any = {};


    @Input() public aclType: ACLType;

    /**
     * sets the allowed change scope
     */
    public changescope: 'all' | 'custom' | 'none' = 'none';

    public aclAction: ACLAction;


    constructor(public backend: backend, public modelutilities: modelutilities, public configurationService: configurationService, public toast: toast) {
        // set teh change scope
        this.changescope = this.configurationService.getCapabilityConfig('core').edit_mode;
    }

    ngOnInit(){
        this.aclAction = {
            id: this.modelutilities.generateGuid(),
            sysmodule_id: this.aclType.acltype.id,
            scope: 'c'
        }
    }

    close(){
        this.self.destroy();
    }

    get adddisabled(){
        return this.aclAction.action == '' || this.aclType.aclactions.map(a => a.action).indexOf(this.aclAction.action) >= 0;
    }

    add(){
        this.backend.postRequest('module/SpiceACLObjects/modules/'+this.aclType.acltype.id+'/actions/'+this.aclAction.id, {}, this.aclAction).subscribe({
            next: (actiondata) => {
                this.aclType.aclactions.push(this.aclAction);
                this.aclType.aclactions.sort((a, b) => a.action.localeCompare(b.action));
            },
            error: (e) => {
                this.toast.sendToast('Error adding field', 'error')
            }
        });
        this.close();
    }

}
