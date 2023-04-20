import {Component, OnDestroy} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";
import {KanbanManagerService} from "../services/kanbanmanager.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'spice-kanban-manager-list',
    templateUrl: '../templates/spicekanbanmanagerlist.html'
})

export class SpiceKanbanManagerList implements OnDestroy {
    public enumValues = Array.from({length: 50}, (_, i) => 'Item ' + i);
    private subscription: Subscription = new Subscription();

    constructor(public backend: backend,
                public kanbanManagerService: KanbanManagerService) {
        this.loadItems();
        this.subscribeToSelectionChange();
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

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private loadItems() {
        // todo: load beanguidestages from backend
    }

    private subscribeToSelectionChange() {
        this.subscription = this.kanbanManagerService.selectedBeanGuide$.subscribe({
            next: () => {
                // todo: load beanguidestages from backend
            }
        });
    }
}
