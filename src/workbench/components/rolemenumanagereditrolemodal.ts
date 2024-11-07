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

    public dashboards: any[] = [];
    public dashboardSets: any[] = [];
    public currentDashboard: { id: string, name: string };
    public currentDashboardSet: { id: string, name: string };

    constructor(public metadata: metadata,
                public modelutilities: modelutilities,
                public backend: backend,
                public toast: toast,
                private configurationService: configurationService,
                public modal: modal) {
        this.getDashboards();
        this.getDashboardSets();

    }

    /**
     * get dashboards
     */
    public getDashboards() {
        this.backend.getRequest(`configuration/spiceui/core/module/dashboards`).subscribe(dashboards => {
            this.dashboards = dashboards;
            if (!!this.newRole.default_dashboard) {
                this.currentDashboard = this.dashboards.find(d => d.id == this.newRole.default_dashboard).name;
            }
        });
    }

    /**
     * get dashboardsets
     */
    public getDashboardSets() {
        this.backend.getRequest(`configuration/spiceui/core/module/dashboardsets`).subscribe(dashboardSets => {
            this.dashboardSets = dashboardSets;
            if (!!this.newRole.default_dashboardset) {
                this.currentDashboardSet = this.dashboardSets.find(ds => ds.id == this.newRole.default_dashboardset).name;
            }
        });
    }

    public setDashboard(dashboard) {
        this.newRole.default_dashboard = dashboard ? dashboard.id : "";
    }

    public setDashboardSet(dashboardSet) {
        this.newRole.default_dashboardset = dashboardSet ? dashboardSet.id : "";
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
        // data.default_dashboard = this.currentDashboard.id;

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



