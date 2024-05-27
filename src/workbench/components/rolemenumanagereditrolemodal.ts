/**
 * @module WorkbenchModule
 */
import {Component, ComponentRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {RoleI} from "../interfaces/systemui.interfaces";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {Subject} from "rxjs";
import {modal} from "../../services/modal.service";
import {configurationService} from "../../services/configuration.service";


/**
 * a modal window to edit role data 
 */
@Component({
    selector: 'role-menu-manager-edit-role-modal',
    templateUrl: '../templates/rolemenumanagereditrolemodal.html',
})
export class RoleMenuManagerEditRoleModal {

    /**
     * reference to the modal self
     */
    public self: ComponentRef<RoleMenuManagerEditRoleModal>;

      public newRole: RoleI = {
          id: '',
          identifier: '',
          name: '',
          label: '',
          icon: '',
          systemdefault: false,
          portaldefault: false,
          showsearch: true,
          showfavorites: true,
          description: '',
          default_dashboard: '',
          default_dashboardset: '',
          version: '',
          package: '',
          scope: 'custom',
          rolescope: 'i',
          scope_icon: '',
          systemTreeDefs: {},
      };
    public save$ = new Subject<RoleI>();
    public radioOptions = [
        {label: "custom", value: 'custom'},
        {label: 'global', value: 'global'},
    ];

    constructor(public metadata: metadata,
                public modelutilities: modelutilities,
                public backend: backend,
                public toast: toast,
                private configurationService: configurationService,
                public modal: modal) {

    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    public canSave(){
        if(!this.newRole.name || !this.newRole.label || !this.newRole.identifier){
            return false;
        }
        return true;
    }
    /**
     * remove the frontend fields before posting to backend
     */
    public saveRole() {

        if (!this.newRole.id) {
            this.newRole.id = this.modelutilities.generateGuid();
        }

        const table = this.newRole.scope == 'custom' ? 'sysuicustomroles' : 'sysuiroles';
        const data: any = {...this.newRole};
        delete data.scope;
        delete data.scope_icon;
        delete data.systemTreeDefs;

        data.systemdefault = data.systemdefault ? 1 : 0;

        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.postRequest(`configuration/configurator/${table}/${this.newRole.id}`, null, {config: data}).subscribe({
            next: () => {
                this.newRole.scope_icon = this.newRole.scope == 'custom' ? 'people' : 'world';
                this.save$.next(this.newRole);
                this.save$.complete();
                loadingModal.emit(true);
                this.configurationService.reloadTaskData('roles');
                this.configurationService.reloadTaskData('sysroles');
                this.toast.sendToast('LBL_DATA_SAVED', 'success');
            }
        });
        this.self.destroy();
    }

}



