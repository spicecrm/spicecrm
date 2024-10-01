import {Component, ComponentRef, Injector, OnInit} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';

import {SpiceBeanGuidesI, SpiceBeanGuideStageI} from "../interfaces/kanbanmanager.interfaces";

import {KanbanManagerService} from "../services/kanbanmanager.service";
import {SpiceKanbanManagerAddModal} from "./spicekanbanmanageraddmodal";
import {modelutilities} from "../../../services/modelutilities.service";
import {ChangeHistoryService} from "../../../workbench/services/changehistory.service";
import {backend} from "../../../services/backend.service";


@Component({
    selector: 'spice-kanban-manager',
    templateUrl: '../templates/spicekanbanmanager.html',
    providers: [KanbanManagerService, ChangeHistoryService]
})


export class SpiceKanbanManager implements OnInit{


    public loading: boolean;

    /**
     * module name
     */
    public _moduleName: string = '';


    public beanGuides: SpiceBeanGuidesI[] = [];
    public beanGuidesCustom: SpiceBeanGuidesI[] = [];

    public moduleBeanGuides: SpiceBeanGuidesI[] = [];
    public moduleBeanGuidesCustom: SpiceBeanGuidesI[] = [];

    public preview: boolean = false;

    public activeStages: any;

    public kanbansToMigrate: any[];

    public migrateBtnDisabled: boolean = true;

    constructor(
        public modal: modal,
        public injector: Injector,
        public metadata: metadata,
        public modelUtilities: modelutilities,
        public kanbanManagerService: KanbanManagerService,
        public backend: backend
    ) {
    }

    set selectedStage(val: SpiceBeanGuideStageI) {
        this.kanbanManagerService.selectedStage = val;
    }

    get selectedStage() {
        return this.kanbanManagerService.selectedStage;
    }

    set selectedBeanGuide(val: SpiceBeanGuidesI) {
        // todo reset the value after rejection
        this.kanbanManagerService.selectedBeanGuide = val;
    }

    get selectedBeanGuide(): SpiceBeanGuidesI {
        return this.kanbanManagerService.selectedBeanGuide;
    }

    get moduleName() {
        return this._moduleName;
    }

    set moduleName(val: string) {
        this._moduleName = val;
        this.moduleBeanGuides = this.beanGuides.filter(res => res.module == val);
        this.moduleBeanGuidesCustom = this.beanGuidesCustom.filter(res => res.module == val);
    }

    public ngOnInit() {
        this.loading = true;
        this.kanbanManagerService.getBeanGuides().subscribe(res => {
            this.beanGuides = res.filter(r => r.scope == 'global');
            this.beanGuidesCustom = res.filter(r => r.scope == 'custom');
            this.checkMigrateKanbans();

            this.loading = false;
        });
    }

    openAddModal() {
        this.modal.openModal('SpiceKanbanManagerAddModal', true, this.injector).subscribe((modalRef: ComponentRef<SpiceKanbanManagerAddModal>)  => {
            modalRef.instance.selectedBeanGuide  = {
                id: this.modelUtilities.generateGuid(),
                module: this.moduleName,
                status_field: '',
                name: '',
                scope: '',
                systextid: `kanban_${this.moduleName.toLowerCase()}_`
            };
            modalRef.instance.emitSelectedBeanGuide.subscribe(selected => {
                selected.scope == 'global' ? this.beanGuides.push(selected) : this.beanGuidesCustom.push(selected);
                this.moduleName = selected.module;
                this.kanbanManagerService.loadItems(selected);
            });
        });
    }

    public togglePreview () {
        this.preview = !this.preview;
    }

    public openEditModal(selectedBeanGuide) {
        this.modal.openModal('SpiceKanbanManagerAddModal', true, this.injector).subscribe((modalRef)  => {
            modalRef.instance.selectedBeanGuide = selectedBeanGuide;
            modalRef.instance.isEditing = true;
        });
    }

    public checkMigrateKanbans() {

        const modulesObj = window._.groupBy(this.beanGuides.filter(g => !g.name || !g.systextid).concat(this.beanGuidesCustom.filter(g => !g.name || !g.systextid)), 'module');

        this.kanbansToMigrate = Object.keys(modulesObj).map(module => ({
            module,
            countGlobal: modulesObj[module].filter(g => g.scope == 'global').length,
            countCustom: modulesObj[module].filter(g => g.scope == 'custom').length
        }));

        this.migrateBtnDisabled = this.kanbansToMigrate.length == 0;
    }

    public migrate() {
        this.modal.openModal('SpiceKanbanManagerMigrateModal', true, this.injector).subscribe((modalRef) => {
            modalRef.instance.migrateKanbans = this.kanbansToMigrate;
            modalRef.instance.migrated.subscribe({
                next: (migrated) => { if (migrated) this.migrateBtnDisabled = true; }
            })
        })
    }

    /**
     * set selected kanban to default and the other default kanban to false
     */
    public setDefault() {

        if (!this.kanbanManagerService.editMode || this.kanbanManagerService.editMode == 'none' || (this.kanbanManagerService.selectedBeanGuide.scope == 'global' && this.kanbanManagerService.editMode != 'all')) return;

        const reqCustom = [];
        const reqGlobal = [];

        const oldCustomDefault = this.moduleBeanGuidesCustom.find(g => g.is_default == 1 && g.module == this.moduleName);
        if (oldCustomDefault) reqCustom.push({...oldCustomDefault, scope: undefined, is_default: 0});

        if (this.kanbanManagerService.editMode == 'all') {
            const oldGlobalDefault = this.moduleBeanGuides.find(g => g.is_default == 1 && g.module == this.moduleName);
            if (oldGlobalDefault) reqGlobal.push({...oldGlobalDefault, scope: undefined, is_default: 0});
        }

        this.kanbanManagerService.selectedBeanGuide.is_default = 1;

        if (this.kanbanManagerService.selectedBeanGuide.scope == 'custom') {
            reqCustom.push({...this.kanbanManagerService.selectedBeanGuide, scope: undefined});

        } else {
            reqGlobal.push({...this.kanbanManagerService.selectedBeanGuide, scope: undefined});
        }

        this.backend.postRequest('configuration/configurator/spicebeanguides', null, { config: reqGlobal });
        this.backend.postRequest('configuration/configurator/spicebeancustomguides', null, { config: reqCustom });
    }

}
