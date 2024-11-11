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
import {ACLField, ACLType} from "../interfaces/aclinterfaces";
import {toast} from "../../../services/toast.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * renders a modal with a selection of fields for the mldule to be added in the ACL Componentes
 */
@Component({
    selector: 'acltypes-manager-types-add-fields',
    templateUrl: '../templates/acltypesmanagertypesaddfields.html',
})
export class ACLTypesManagerTypesAddFields implements OnInit {

    /**
     * reference to self for the modal
     */
    public self: any = {};

    /**
     * the current acl type
     */
    @Input() public aclType: ACLType;

    /**
     * the acl field to be added
     */
    public aclField: ACLField;

    /**
     * sets the allowed change scope
     */
    public changescope: 'all' | 'custom' | 'none' = 'none';

    constructor(public backend: backend, public modelutilities: modelutilities, public configurationService: configurationService, public toast: toast) {
        // set teh change scope
        this.changescope = this.configurationService.getCapabilityConfig('core').edit_mode;
    }

    public ngOnInit() {
        this.aclField = {
            id: this.modelutilities.generateGuid(),
            sysmodule_id: this.aclType.acltype.id,
            scope: 'c'
        }

    }

    get canAdd(){
        return this.aclField.name && this.aclType.aclfields.map(f => f.name).indexOf(this.aclField.name) == -1;
    }

    /**
     * handler when the add buton is pushed
     */
    public add() {
        this.backend.postRequest('module/SpiceACLObjects/modules/' + this.aclType.acltype.id + '/fields/' + this.aclField.id, {}, this.aclField).subscribe({
            next: (fielddata) => {
                this.aclType.aclfields.push(this.aclField);
                this.aclType.aclfields.sort((a, b) => a.name.localeCompare(b.name));
                this.close();
            },
            error: (e) => {
                this.toast.sendToast('Error adding action', 'error')
            }
        });
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}
