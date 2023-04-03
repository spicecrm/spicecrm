import {Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'spice-kanban-manager-checks',
    templateUrl: '../templates/spicekanbanmanagerchecks.html'
})

export class SpiceKanbanManagerChecks {

    /**
     * holds all check labels defined for the Bean
     */
    public checkLabels: any[] = Array.from({length: 5}, (_,i) => 'Check Label ' + i);

    /**
     * holds the sequence of the label
     */
    public labelSequence: any;

    /**
     * check label from the spicebeanguidestages_checks table
     * i.e. CHECK_QUALIFICATION_ACTIVITY
     */
    public checkLabel: string = 'CHECK_LABEL_...';

    /**
     * holds the backend method
     */
    public checkMethod: string = 'standardOpportunityGuideChecks';

    constructor(
        public backend: backend
    ) {
    }

    /**
     * drag and drop of check labels
     */
    public dropCheckLabels(event: CdkDragDrop<any[]>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        this.saveSequence();
    }

    /**
     * saves sequence of the check label
     */
    public saveSequence() {
        this.checkLabels.forEach((entry, index) => {
            // entry.stage_sequence = index;
        });

        this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null);
    }

    /**
     * add new check stage label
     * @param e
     */
    public addCheckLabel(e) {
        const x = 'clicked';
    }

}