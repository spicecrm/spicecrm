import {Component, Injector, OnInit} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';

import {KanbanManagerService, IBeanGuides} from "../services/kanbanmanager.service";

@Component({
    selector: 'spice-kanban-manager',
    templateUrl: '../templates/spicekanbanmanager.html',
    providers: [KanbanManagerService]
})


export class SpiceKanbanManager implements OnInit{


    /**
     * module name
     */
    public moduleName: string = '';

    public beanGuides: IBeanGuides[] = [];

    public preview: boolean = false;
    public kanBanName: string = '';

    constructor(
        public modal: modal,
        public injector: Injector,
        public metadata: metadata,
        public kanbanManagerService: KanbanManagerService
    ) {
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


    public getBeanGuidesNames(module) {
        return this.beanGuides.filter(res => res.module == module);
    }


}
