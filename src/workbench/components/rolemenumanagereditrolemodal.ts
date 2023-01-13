/**
 * @module WorkbenchModule
 */
import {Component, ComponentRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {RoleMenuManager} from "./rolemenumanager";
import {RoleI, RoleModuleI} from "../interfaces/systemui.interfaces";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {Subject} from "rxjs";


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
          systemdefault: '',
          portaldefault: '',
          showsearch: 1,
          showfavorites: 1,
          description: '',
          default_dashboard: '',
          version: '',
          package: '',
          scope: 'custom',
          scope_icon: '',
          systemTreeDefs: {},
      };
    public save$ = new Subject<RoleI>();
    public radioOptions = [
        {label: "custom", value: 'custom'},
        {label: 'global', value: 'global'},
    ];

    constructor(public metadata: metadata, public modelutilities: modelutilities, public backend: backend, public toast: toast) {

    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * remove the frontend fields before posting to backend
     */
    public saveRole() {

        if (!this.newRole.id) {
            this.newRole.id = this.modelutilities.generateGuid();
        }

        const table = this.newRole.scope == 'custom' ? 'sysuicustomroles' : 'sysuiroles';
        const data = {...this.newRole};
        delete data.scope;
        delete data.scope_icon;
        delete data.systemTreeDefs;


        this.backend.postRequest(`configuration/configurator/${table}/${this.newRole.id}`, null, {config: data}).subscribe({
            next: () => {
                this.newRole.scope_icon = this.newRole.scope == 'custom' ? 'people' : 'world';
                this.save$.next(this.newRole);
                this.save$.complete();
                this.toast.sendToast('LBL_DATA_SAVED', 'success');
            }
        });
        this.self.destroy();
    }

}



