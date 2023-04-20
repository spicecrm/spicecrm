import {Component, Injector} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {KanbanManagerService} from "../services/kanbanmanager.service";

@Component({
    selector: 'spice-kanban-manager',
    templateUrl: '../templates/spicekanbanmanager.html',
    providers: [KanbanManagerService]
})

export class SpiceKanbanManager {


    public preview: boolean = false;

    constructor(
        public modal: modal,
        public injector: Injector,
        public kanbanManagerService: KanbanManagerService
    ) {
    }

    openAddModal() {
        this.modal.openModal('SpiceKanbanManagerAddModal', true, this.injector);
    }

    public togglePreview () {
        this.preview = !this.preview;
    }


}
