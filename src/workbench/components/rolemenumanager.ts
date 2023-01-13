/**
 * a component allowing the management of the domaisn in the dictionary defined in the system
 */
import {
    ChangeDetectorRef,
    Component,
    ComponentRef,
    Injector,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from "@angular/core";
import {backend} from "../../services/backend.service";
import {RoleI, RoleModuleI} from "../interfaces/systemui.interfaces";
import {SystemViewProviderDirective} from "../../directives/directives/systemviewprovider";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {RoleMenuManagerEditRoleModal} from "./rolemenumanagereditrolemodal";

@Component({
    selector: 'role-menu-manager',
    templateUrl: '../templates/rolemenumanager.html',
})
export class RoleMenuManager implements OnInit {

    /**
     * backend user roles list
     */
    public roles: RoleI[] = [];
    /**
     * selected role id to display role modules
     */
    public selectedRoleId: string;
    /**
     * system role modules
     */
    public roleModules: RoleModuleI[] = [];
    /**
     * loading data
     */
    public isLoading: boolean = false;
    @ViewChild('test') private test: SystemViewProviderDirective;
    @ViewChildren(SystemViewProviderDirective) private customTrigger: QueryList<SystemViewProviderDirective>;
    @ViewChildren(SystemViewProviderDirective) private viewProviders: QueryList<SystemViewProviderDirective>;

    private roleModulesBackup: { [key: symbol]: RoleModuleI } = {};

    constructor(private backend: backend,
                private modal: modal,
                private toast: toast,
                private cdRef: ChangeDetectorRef,
                public injector: Injector) {
    }

    /**
     * saving the rolemodule after editing
     * @param roleModule
     * @param viewProvider
     */
    public saveRoleModule(roleModule: RoleModuleI, viewProvider: SystemViewProviderDirective) {

        viewProvider.view.setViewMode();
        delete this.roleModulesBackup[roleModule.id];
        roleModule.id = this.backend.modelutilities.generateGuid();
        roleModule.sysuirole_id = this.selectedRoleId;

        const table = roleModule.scope == 'global' ? 'sysuirolemodules' : 'sysuicustomrolemodules';
        const data = {...roleModule};
        delete data.scope;

        this.backend.postRequest(`configuration/configurator/${table}/${roleModule.id}`, null, {config: data}).subscribe({
            next: () => {
                this.toast.sendToast('LBL_DATA_SAVED', 'success');
            }
        });

    }

    /**
     * deleting the rolemodule
     * @param roleModule
     * @param viewProvider
     */
    public deleteRoleModule(roleModule: RoleModuleI, viewProvider: SystemViewProviderDirective) {
        viewProvider.view.setViewMode();
        const table = roleModule.scope == 'custom' ? 'sysuicustomrolemodules' : 'sysuirolemodules';
        this.backend.deleteRequest(`configuration/configurator/${table}/${roleModule.id}`).subscribe(() => {
            this.toast.sendToast('MSG_SUCCESSFULLY_DELETED', 'success')
        });
        this.roleModules = this.roleModules.filter(id => id.id != roleModule.id);
    }

    /**
     * creating a new rolemodule
     */
    public addRoleModule() {
        const roleModule: RoleModuleI = {
            id: '',
            sysuirole_id: this.selectedRoleId,
            module: '',
            sequence: '',
            version: '',
            package: '',
            scope: 'custom' || 'global',
        };

        this.roleModules.push(roleModule);



        // triggering change detection to find changes in order for angular to render edit view
        this.cdRef.detectChanges();

        this.viewProviders.last.view.setEditMode();
    };

    public ngOnInit(): void {
        this.loadRoles();
    }

    /**
     * load role modules
     */
    public loadRoleModules(id: string) {
        this.isLoading = true;
        this.cdRef.detectChanges();
        this.backend.getRequest(`configuration/spiceui/core/rolemodules/${id}`).subscribe({
            next: (res: RoleModuleI[]) => {
                this.isLoading = false;
                this.roleModules = res;
            }
        });
    }

    /**
     * editing mode
     * @param viewProvider
     * @param roleModule
     */
    public startEditing(viewProvider: SystemViewProviderDirective, roleModule: RoleModuleI) {
        this.roleModulesBackup[roleModule.id] = {...roleModule};
        viewProvider.view.setEditMode();
    }

    public cancelEditing(viewProvider: SystemViewProviderDirective, index: number) {

        if (!this.roleModules[index].id) {
            this.roleModules.splice(index, 1);
        } else {
            this.roleModules[index] = this.roleModulesBackup[this.roleModules[index].id];
        }

        viewProvider.view.setViewMode();
    }

    /**
     * delete the role
     * @param role
     */
    public deleteRole(id: string) {

        const role = this.roles.find(r => r.id == id);

        const table = role.scope == 'global' ? 'sysuiroles' : 'sysuicustomroles';

        this.backend.deleteRequest(`configuration/configurator/${table}/${role.id}`).subscribe(() => {
            this.toast.sendToast('MSG_SUCCESSFULLY_DELETED', 'success')
        });
        this.roles = this.roles.filter(id => id.id != role.id);
    }

    /**
     * edit the role
     * @param role
     */
    public editRole(id: string) {

        const role = this.roles.find(r => r.id == id);

        this.modal.openModal('RoleMenuManagerEditRoleModal').subscribe((modalRef: ComponentRef<RoleMenuManagerEditRoleModal>) => {
            modalRef.instance.newRole = role;
        });
    }

    /**
     * create a new role
     */
    public addRole() {
        this.modal.openModal('RoleMenuManagerEditRoleModal', true, this.injector).subscribe((modalRef: ComponentRef<RoleMenuManagerEditRoleModal>) => {
            modalRef.instance.save$.subscribe({
                next: (role: RoleI) => {
                    this.roles = [...this.roles, role];
                }
            })
        });

    }

    /**
     * load system roles
     * @private
     */
    private loadRoles() {
        this.isLoading = true;
        this.cdRef.detectChanges();
        this.backend.getRequest(`configuration/spiceui/core/roles`).subscribe({
            next: (res: RoleI[]) => {
                this.isLoading = false;
                this.roles = res.map(role => ({...role, icon: role.scope == 'custom' ? 'people' : 'world'}));
                this.selectedRoleId = res[0].id;
                this.loadRoleModules(res[0].id);
                setTimeout(() => {
                    this.customTrigger.forEach(console.log);
                    console.log(this.test);
                });
            }
        });
    }


}

