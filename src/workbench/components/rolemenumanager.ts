import {
    ChangeDetectorRef,
    Component,
    ComponentRef,
    Injector,
    OnInit,
    QueryList,
    ViewChildren
} from "@angular/core";
import {backend} from "../../services/backend.service";
import {RoleI, RoleModuleI} from "../interfaces/systemui.interfaces";
import {SystemViewProviderDirective} from "../../directives/directives/systemviewprovider";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {RoleMenuManagerEditRoleModal} from "./rolemenumanagereditrolemodal";
import {switchMap} from "rxjs";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";



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

    public editableRoleScope: boolean;
    public filterModules:string[] =[];

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
        if (!roleModule.id) roleModule.id = this.backend.modelutilities.generateGuid();
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
        this.saveSequence();
    }

    /**
     * creating a new rolemodule
     */
    public addRoleModule() {
        const roleModule: RoleModuleI = {
            id: '',
            sysuirole_id: this.selectedRoleId,
            module: '',
            sequence: this.roleModules.length,
            version: '',
            package: '',
            scope: 'custom',
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
                this.roleModules = res.sort((a, b) => a.sequence - b.sequence);
                this.filterModules = this.roleModules.map(rm=>rm.module);
            }
        });
    }

    public handleSelectedItemChange(id) {
        this.loadRoleModules(id);
        this.editableRoleScope = this.roles.find(r => r.id == id).scope == 'global';
        this.selectedRoleId = this.roles.find(r => r.id==id).id;
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
     * @param id
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
     * @param id
     */
    public editRole(id: string) {

        const role = this.roles.find(r => r.id == id);

        this.openEditRoleModal(role);
    }

    private openEditRoleModal(role?:RoleI){
        this.modal.openModal('RoleMenuManagerEditRoleModal').subscribe((modalRef: ComponentRef<RoleMenuManagerEditRoleModal>) => {
            const index = this.roles.indexOf(role);
            if (role) {
                modalRef.instance.newRole = {...role};
            }
            modalRef.instance.save$.subscribe({
                next: (newRole: RoleI) => {
                    if(role) {
                        this.roles.splice(index, 1, newRole);
                    }
                    else{
                        this.roles.push(newRole);
                    }
                }
            })
        });
    }

    /**
     * create a new role
     */
    public addRole() {
        // this.modal.openModal('RoleMenuManagerEditRoleModal', true, this.injector).subscribe((modalRef: ComponentRef<RoleMenuManagerEditRoleModal>) => {
        //     modalRef.instance.save$.subscribe({
        //         next: (role: RoleI) => {
        //             role.systemTreeDefs = {icon: role.scope == 'custom' ? 'people' : 'world'};
        //             this.roles = [...this.roles, role];
        //         }
        //     })
        // });
        this.openEditRoleModal();
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
                this.roles = res.map(role => ({
                    ...role
                }));

                this.handleSelectedItemChange(res[0].id);
            }
        });
    }

    /**
     * drag and drop for modules
     */
    public drop(event: CdkDragDrop<RoleModuleI[]>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        this.saveSequence();
    }

    /**
     * saving the new sequence of rolemodules
     */
    public saveSequence() {

        this.roleModules.forEach((entry, index) => {
            entry.sequence = index;
        });

        const backendArray = [];

        const globalEntries = this.roleModules.filter(e => e.scope == 'global').map(e => {
            const clonedEntry = {...e};
            delete clonedEntry.scope;
            return clonedEntry;
        });

        if (globalEntries.length > 0) {
            this.backend.postRequest(`configuration/configurator/sysuirolemodules`, null, {config: globalEntries});
        }

        const customEntries = this.roleModules.filter(e => e.scope == 'custom').map(e => {
            const clonedEntry = {...e};
            delete clonedEntry.scope;
            return clonedEntry;
        });

        if (customEntries.length > 0) {
            this.backend.postRequest(`configuration/configurator/sysuicustomrolemodules`, null, {config: customEntries});
        }
    }
}

