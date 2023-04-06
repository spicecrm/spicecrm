import {Component} from '@angular/core';

@Component({
    selector: 'spice-kanban-manager-add-modal',
    templateUrl: '../templates/spicekanbanmanageraddmodal.html'
})

export class SpiceKanbanManagerAddModal {

    /**
     * reference to the modal to close it
     */
    public self: any;


    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }
}

