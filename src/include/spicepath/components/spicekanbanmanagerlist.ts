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
    // public enumValues = Array.from({length: 50}, (_, i) => 'Item ' + i);
    public spiceBeanGuideStages:SpiceBeanGuideStagesI[] = [];
    public notInKanban:SpiceBeanGuideStagesI[] = [];
    public activeStages:SpiceBeanGuideStagesI[] = [];
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

        this.saveSequence();
    }

    /**
     * saving the new sequence of beanguidestages
     */
    public saveSequence() {
        this.activeStages.forEach((entry) => {
            entry.not_in_kanban = 0;
        });
        this.notInKanban.forEach((entry) => {
            entry.not_in_kanban = 1;
        });
        this.spiceBeanGuideStages = this.activeStages.concat(this.notInKanban);

        this.spiceBeanGuideStages.forEach((entry, index) => {
            entry.stage_sequence = index;
        });

        this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null, {config:this.spiceBeanGuideStages});

    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private loadItems() {
        // todo: load beanguidestages from backend
       this.backend.getRequest(`configuration/configurator/entries/spicebeanguidestages`).subscribe(stages =>{
           this.spiceBeanGuideStages = stages;
           this.activeStages = this.spiceBeanGuideStages.filter(dis=>dis.not_in_kanban == 0);
           this.notInKanban = this.spiceBeanGuideStages.filter(dis=>dis.not_in_kanban == 1);
       })
    }

    private subscribeToSelectionChange() {
        this.subscription = this.kanbanManagerService.selectedBeanGuide$.subscribe({
            next: () => {
                // todo: load beanguidestages from backend
            }
        });
    }
}
