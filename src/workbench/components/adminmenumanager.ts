import {ChangeDetectorRef, Component, ComponentRef, Injector, OnInit, QueryList,
    ViewChildren} from "@angular/core";
import {backend} from "../../services/backend.service";
import {AdminGroupI, AdminComponentI, RoleModuleI} from "../interfaces/systemui.interfaces";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {forkJoin} from "rxjs";
import {AdminMenuManagerEditGroupModal} from "./adminmenumanagereditgroupmodal";
import {AdminMenuManagerEditComponentModal} from "./adminmenumanagereditcomponentmodal";
import {configurationService} from "../../services/configuration.service";
import {SystemViewProviderDirective} from "../../directives/directives/systemviewprovider";


@Component({
    selector: 'admin-menu-manager',
    templateUrl: '../templates/adminmenumanager.html',
})
export class AdminMenuManager implements OnInit {
    public adminGroups: AdminGroupI[] = [];
    public selectedAdminGroup: string;
    public adminComponents: AdminComponentI[] = [];
    /**
     * loading data
     */
    public isLoading: boolean = false;

    public editableAdminGroupScope: boolean;
    public filterComponents: string[] = [];
    public radioOptions = [
        {label: 'global', value: 'global'},
        {label: 'custom', value: 'custom'},
    ];
    public  selectedScope: string = 'global';
    @ViewChildren(SystemViewProviderDirective) private viewProviders: QueryList<SystemViewProviderDirective>;
    public editMode: 'all' | 'custom' | 'none';
    private adminComponentsBackup: { [key: symbol]: AdminComponentI } = {};


    constructor(private backend: backend,
                private modal: modal,
                private toast: toast,
                private cdRef: ChangeDetectorRef,
                public configurationService: configurationService,
                public injector: Injector) {
        this.editMode = this.configurationService.getCapabilityConfig('core').edit_mode;
    }

    public saveComponentChanges(adminComponent: AdminComponentI, viewProvider: SystemViewProviderDirective) {
        viewProvider.view.setViewMode();
        delete this.adminComponentsBackup[adminComponent.id];
        const table = adminComponent.scope == 'global' ? 'sysuiadmincomponents' : 'sysuicustomadmincomponents';
        const data = {...adminComponent};
        delete data.scope;

        this.backend.postRequest(`configuration/configurator/${table}/${adminComponent.id}`, null, {config: data}).subscribe({
            next: () => {
                this.toast.sendToast('LBL_DATA_SAVED', 'success');
            }
        });
    }
    public deleteAdminComponent(id: string) {
        this.modal.confirm('MSG_DELETE_RECORD', 'MSG_DELETE_RECORD').subscribe({
            next: (res) => {
                if (res) {
                    const adminComponent = this.adminComponents.find(r => r.id == id);

                    const table = adminComponent.scope == 'global' ? 'sysuiadmincomponents' : 'sysuicustomadmincomponents';

                    this.backend.deleteRequest(`configuration/configurator/${table}/${adminComponent.id}`).subscribe(() => {
                        this.toast.sendToast('MSG_SUCCESSFULLY_DELETED', 'success');
                    });
                    this.adminComponents = this.adminComponents.filter(id => id.id != adminComponent.id);
                    this.adminComponents = [...this.adminComponents];
                    this.saveSequence('components');
                    this.cdRef.detectChanges();
                }
            }
        });
    }

    public editAdminComponent(viewProvider: SystemViewProviderDirective, adminComponent: AdminComponentI) {
        this.adminComponentsBackup[adminComponent.id] = {...adminComponent};
        viewProvider.view.setEditMode();
    }
    public cancelEditing(viewProvider: SystemViewProviderDirective, index: number) {

        if (!this.adminComponents[index].id) {
            this.adminComponents.splice(index, 1);
        } else {
            this.adminComponents[index] = this.adminComponentsBackup[this.adminComponents[index].id];
        }

        viewProvider.view.setViewMode();
    }

    private openEditComponentModal(component?:AdminComponentI){
        this.modal.openModal('AdminMenuManagerEditComponentModal').subscribe((modalRef: ComponentRef<AdminMenuManagerEditComponentModal>) => {
            const index = component ? this.adminComponents.indexOf(component) : -1;

            const newComponent: AdminComponentI = component
                ? {...component}
                : {
                    id: '',
                    admingroup: this.selectedAdminGroup,
                    adminaction: '',
                    admin_label: '',
                    component: '',
                    componentconfig: '',
                    icon: '',
                    version: '',
                    package: '',
                    scope: 'custom',
                    scope_icon: '',
                    sequence: this.adminComponents.length
                };

            modalRef.instance.newComponent = newComponent;

            modalRef.instance.save$.subscribe({
                next: (savedComponent: AdminComponentI) => {
                    if(component) {
                        this.adminComponents.splice(index, 1, savedComponent);
                    } else {
                        this.adminComponents.push(savedComponent);
                    }
                    this.cdRef.detectChanges();
                }
            })
        });
    }

    public addAdminComponent() {
        this.openEditComponentModal();
    }

    public ngOnInit(): void {
        this.loadAdminGroups();
    }

    public handleSelectedItemChange(groupName: string) {
        const selectedGroup = this.adminGroups.find(group => group.name === groupName);
        if (!selectedGroup) {
            this.toast.sendToast('Group not found!', 'error');
            return;
        }

        this.selectedAdminGroup = selectedGroup.name;
        this.editableAdminGroupScope = selectedGroup.scope === 'global';

        // Load the admin components for the selected group
        this.loadAdminComponents();
    }

    private loadAdminComponents() {
        this.isLoading = true;
        this.cdRef.detectChanges();

        forkJoin({
            globalComponents: this.backend.getRequest(`configuration/configurator/entries/sysuiadmincomponents`),
            customComponents: this.backend.getRequest(`configuration/configurator/entries/sysuicustomadmincomponents`)
        }).subscribe({
            next: ({ globalComponents, customComponents }) => {
                this.isLoading = false;

                const globalComponentsWithScope = (globalComponents || []).map(component => ({
                    ...component,
                    scope: 'global'
                }));

                const customComponentsWithScope = (customComponents || []).map(component => ({
                    ...component,
                    scope: 'custom'
                }));

                this.adminComponents = [...globalComponentsWithScope, ...customComponentsWithScope]
                    .filter(component => component.admingroup === this.selectedAdminGroup)
                    .sort((a, b) => a.sequence - b.sequence);

                this.filterComponents = this.adminComponents.map(ac => ac.component);
            },
            error: () => {
                this.isLoading = false;
                this.toast.sendToast('Failed to load components!', 'error');
            }
        });
    }

    public deleteAdminGroup(id: string) {
        this.modal.confirm('MSG_DELETE_RECORD', 'MSG_DELETE_RECORD').subscribe({
            next: (res) => {
                if (res) {
                    const adminGroup = this.adminGroups.find(r => r.id == id);

                    const groupTable = adminGroup.scope == 'global' ? 'sysuiadmingroups' : 'sysuicustomadmingroups';
                    const componentsTable = adminGroup.scope == 'global' ? 'sysuiadmincomponents' : 'sysuicustomadmincomponents';

                    const componentDeletionObservables = this.adminComponents
                        .filter(component => component.admingroup === adminGroup.name)
                        .map(component =>
                            this.backend.deleteRequest(`configuration/configurator/${componentsTable}/${component.id}`)
                        );

                    if (componentDeletionObservables.length > 0) {
                        forkJoin(componentDeletionObservables).subscribe({
                            next: () => {
                                this.adminComponents = this.adminComponents.filter(
                                    component => component.admingroup !== adminGroup.name
                                );

                                this.backend.deleteRequest(`configuration/configurator/${groupTable}/${adminGroup.id}`).subscribe(() => {
                                    this.toast.sendToast('MSG_SUCCESSFULLY_DELETED', 'success');
                                });

                                this.adminGroups = this.adminGroups.filter(group => group.id !== adminGroup.id);
                                this.adminGroups = [...this.adminGroups];
                                this.saveSequence('groups');
                                this.cdRef.detectChanges();
                            },
                            error: (err) => {
                                this.toast.sendToast('Failed to delete related components', 'error');
                                console.error('Error deleting components:', err);
                            }
                        });
                    } else {
                        this.backend.deleteRequest(`configuration/configurator/${groupTable}/${adminGroup.id}`).subscribe(() => {
                            this.toast.sendToast('MSG_SUCCESSFULLY_DELETED', 'success');
                            this.adminGroups = this.adminGroups.filter(group => group.id !== adminGroup.id);
                            this.adminGroups = [...this.adminGroups];
                            this.saveSequence('groups');
                            this.cdRef.detectChanges();
                        });
                    }
                }
            }
        });
    }

    public editAdminGroup(id: string) {
        const adminGroup = this.adminGroups.find(ag => ag.id == id);
        this.openEditGroupModal(adminGroup);
    }

    private openEditGroupModal(group?:AdminGroupI){
        this.modal.openModal('AdminMenuManagerEditGroupModal').subscribe((modalRef: ComponentRef<AdminMenuManagerEditGroupModal>) => {
            const index = group ? this.adminGroups.indexOf(group) : -1;
            const newGroup: AdminGroupI = group
            ? {...group}
                : {
                id: '',
                name: '',
                label: '',
                version: '',
                package: '',
                scope: 'custom',
                scope_icon: '',
                sequence: this.adminGroups.length,
            };

            modalRef.instance.newGroup = newGroup;

            modalRef.instance.save$.subscribe({
                next: (newGroup: AdminGroupI) => {
                    if(group) {
                        this.adminGroups.splice(index, 1, newGroup);
                    }else {
                        this.adminGroups.push(newGroup);
                    }
                    this.cdRef.detectChanges();
                }
            })
        });
    }

    public addAdminGroup() {
        this.openEditGroupModal();
    }

    private loadAdminGroups() {
        this.isLoading = true;
        this.cdRef.detectChanges();

        const groupObservable = this.selectedScope === 'global'
            ? this.backend.getRequest('configuration/configurator/entries/sysuiadmingroups')
            : this.backend.getRequest('configuration/configurator/entries/sysuicustomadmingroups');

        groupObservable.subscribe({
            next: (groups) => {
                this.isLoading = false;

                const groupsWithScope = (groups || []).map(group => ({
                    ...group,
                    scope: this.selectedScope
                }));

                this.adminGroups = groupsWithScope.sort((a, b) => a.sequence - b.sequence);
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Error loading admin groups:', err);
            }
        });
    }
    public onScopeChange(scope: string) {
        this.selectedScope = scope;
        this.selectedAdminGroup = null;
        this.adminComponents = [];
        this.loadAdminGroups();
    }

    public drop(event: CdkDragDrop<any[]>, type: 'components' | 'groups') {
        let dataArray: any[];

        if (type === 'components') {
            dataArray = this.adminComponents;
        } else {
            dataArray = this.adminGroups;
        }

        moveItemInArray(dataArray, event.previousIndex, event.currentIndex);

        this.saveSequence(type);
    }

    public saveSequence(type: 'components' | 'groups') {
        let dataArray: (AdminComponentI | AdminGroupI)[];
        let globalTable: string;
        let customTable: string;

        if (type === 'components') {
            dataArray = this.adminComponents;
            globalTable = 'sysuiadmincomponents';
            customTable = 'sysuicustomadmincomponents';
        } else {
            dataArray = this.adminGroups;
            globalTable = 'sysuiadmingroups';
            customTable = 'sysuicustomadmingroups';
        }

        dataArray.forEach((entry, index) => {
            entry.sequence = index;
        });

        const globalEntries = dataArray
            .filter(e => e.scope === 'global')
            .map(e => {
                const clonedEntry = {...e};
                delete clonedEntry.scope;
                return clonedEntry;
            });

        const customEntries = dataArray
            .filter(e => e.scope === 'custom')
            .map(e => {
                const clonedEntry = {...e};
                delete clonedEntry.scope;
                return clonedEntry;
            });

        if (globalEntries.length > 0) {
            this.backend.postRequest(`configuration/configurator/${globalTable}`, null, {config: globalEntries}).subscribe();
        }

        if (customEntries.length > 0) {
            this.backend.postRequest(`configuration/configurator/${customTable}`, null, {config: customEntries}).subscribe();
        }
    }
}