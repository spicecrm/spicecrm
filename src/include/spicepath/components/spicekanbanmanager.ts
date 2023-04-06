import {Component, Injector} from '@angular/core';

import {modal} from '../../../services/modal.service';

@Component({
    selector: 'spice-kanban-manager',
    templateUrl: '../templates/spicekanbanmanager.html'
})

export class SpiceKanbanManager {


    public preview: boolean = false;

    constructor(
        public modal: modal,
        public injector: Injector
    ) {
    }

    openAddModal() {
        this.modal.openModal('SpiceKanbanManagerAddModal', true, this.injector);
    }

    public togglePreview () {
        this.preview = !this.preview;
    }


}
