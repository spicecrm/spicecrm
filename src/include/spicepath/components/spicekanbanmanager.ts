import {Component, Injector, OnInit} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';

import {SpiceBeanGuidesI} from "../interfaces/kanbanmanager.interfaces";

import {KanbanManagerService} from "../services/kanbanmanager.service";


@Component({
    selector: 'spice-kanban-manager',
    templateUrl: '../templates/spicekanbanmanager.html',
    providers: [KanbanManagerService]
})


export class SpiceKanbanManager implements OnInit{


    /**
     * module name
     */
    public _moduleName: string = '';

    public beanGuides: SpiceBeanGuidesI[] = [];

    public moduleBeanGuides: SpiceBeanGuidesI[] = [];

    public preview: boolean = false;

    constructor(
        public modal: modal,
        public injector: Injector,
        public metadata: metadata,
        public kanbanManagerService: KanbanManagerService
    ) {
    }

    get moduleName() {
        return this._moduleName;
    }

    set moduleName(val: string) {
        this._moduleName = val;
        this.moduleBeanGuides = this.beanGuides.filter(res => res.module == val);
    }

    public ngOnInit() {
        this.kanbanManagerService.getBeanGuides().subscribe(res => {
            this.beanGuides = res;
        })
    }


    openAddModal() {
        this.modal.openModal('SpiceKanbanManagerAddModal', true, this.injector).subscribe(modalRef  => modalRef.instance.moduleName = this.moduleName);
    }

    public togglePreview () {
        this.preview = !this.preview;
    }

    public openEditModal(selectedBeanGuide) {
        this.modal.openModal('SpiceKanbanManagerAddModal', true, this.injector).subscribe((modalRef)  => {
            modalRef.instance.selectedBeanGuide = selectedBeanGuide;
            modalRef.instance.moduleName = selectedBeanGuide.module;
        });
    }
}
