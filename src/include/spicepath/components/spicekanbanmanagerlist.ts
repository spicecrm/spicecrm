import {Component, OnDestroy} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";
import {KanbanManagerService} from "../services/kanbanmanager.service";
import {Subscription} from "rxjs";
import {SpiceBeanGuideStagesI} from "../interfaces/kanbanmanager.interfaces";

@Component({
    selector: 'spice-kanban-manager-list',
    templateUrl: '../templates/spicekanbanmanagerlist.html'
})

export class SpiceKanbanManagerList implements OnDestroy {

    public notInKanban:SpiceBeanGuideStagesI[] = [];
    public activeStages:SpiceBeanGuideStagesI[] = [];

    // public enumValues = Array.from({length: 50}, (_, i) => 'Item ' + i);
    private subscription: Subscription = new Subscription();

    constructor(public backend: backend,
                public kanbanManagerService: KanbanManagerService) {
        this.setItems();
        this.subscribeToSelectionChange();
    }

    /**
     * drag and drop for beanguidestages
     */
    public drop(event: CdkDragDrop<any[]>) {
        if(event.previousContainer === event.container){
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
        else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private subscribeToSelectionChange() {
        this.subscription = this.kanbanManagerService.selectedBeanGuide$.subscribe({
            next: () => {
                this.setItems();
               }
        });
    }

    private setItems() {

        if (!this.kanbanManagerService.selectedBeanGuide) return;

        this.activeStages = this.kanbanManagerService.stages
            .filter(dis=>dis.not_in_kanban == 0 && dis.spicebeanguide_id == this.kanbanManagerService.selectedBeanGuide.id);
        this.notInKanban = this.kanbanManagerService.stages
            .filter(dis=>dis.not_in_kanban == 1 && dis.spicebeanguide_id == this.kanbanManagerService.selectedBeanGuide.id);
    }
}
