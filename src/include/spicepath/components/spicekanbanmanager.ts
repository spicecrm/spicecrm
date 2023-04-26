import {Component, Injector} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';

import {KanbanManagerService} from "../services/kanbanmanager.service";

@Component({
    selector: 'spice-kanban-manager',
    templateUrl: '../templates/spicekanbanmanager.html',
    providers: [KanbanManagerService]
})

export class SpiceKanbanManager {


    /**
     * module name
     */
    public moduleName: string = '';

    public preview: boolean = false;

    constructor(
        public modal: modal,
        public injector: Injector,
        public metadata: metadata,
        public kanbanManagerService: KanbanManagerService
    ) {
    }



    openAddModal() {
        this.modal.openModal('SpiceKanbanManagerAddModal', true, this.injector).subscribe(modalRef  => modalRef.instance.moduleName = this.moduleName);
    }

    public togglePreview () {
        this.preview = !this.preview;
    }


}
