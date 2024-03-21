import {Component, ComponentRef, Injector, OnInit} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';

import {SpiceBeanGuidesI, SpiceBeanGuideStageI} from "../interfaces/kanbanmanager.interfaces";

import {KanbanManagerService} from "../services/kanbanmanager.service";
import {SpiceKanbanManagerAddModal} from "./spicekanbanmanageraddmodal";
import {modelutilities} from "../../../services/modelutilities.service";
import {ChangeHistoryService} from "../../../workbench/services/changehistory.service";


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

    constructor(
        public modal: modal,
        public injector: Injector,
        public metadata: metadata,
        public modelUtilities: modelutilities,
        public kanbanManagerService: KanbanManagerService,
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
            this.loading = false;
        })
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
}
