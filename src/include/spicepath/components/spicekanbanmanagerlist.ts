import {Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'spice-kanban-manager-list',
    templateUrl: '../templates/spicekanbanmanagerlist.html'
})

export class SpiceKanbanManagerList {
    public enumValues = Array.from({length: 50}, (_,i) => 'Item ' + i);


    constructor(public backend:backend) {
    }
    /**
     * drag and drop for beanguidestages
     */
    public drop(event: CdkDragDrop<any[]>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        this.saveSequence();
    }

    /**
     * saving the new sequence of beanguidestages
     */
    public saveSequence() {

        this.enumValues.forEach((entry, index) => {
            // entry.stage_sequence = index;
        });

        this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null);

    }

}
