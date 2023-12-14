import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";
import {KanbanManagerService} from "../services/kanbanmanager.service";
import {Subscription} from "rxjs";
import {
    SpiceBeanGuideActiveStageI,
    SpiceBeanGuideInactiveStageI,
    SpiceBeanGuideStagesI
} from "../interfaces/kanbanmanager.interfaces";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'spice-kanban-manager-list',
    templateUrl: '../templates/spicekanbanmanagerlist.html'
})

export class SpiceKanbanManagerList implements OnDestroy, AfterViewInit{

    public inactiveStages:SpiceBeanGuideInactiveStageI[] = [];
    public activeStages:SpiceBeanGuideActiveStageI[] = [];

    public selected: string;
    private subscription: Subscription = new Subscription();

    @Output() public selectedStage: EventEmitter<SpiceBeanGuideStagesI> = new EventEmitter<SpiceBeanGuideStagesI>();
    @Output() public emitActiveStages: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend,
                public kanbanManagerService: KanbanManagerService) {
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.setItems();
            this.subscribeToSelectionChange();
        }, 0);
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
        this.emitActiveStages.emit(this.activeStages);
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

        if (!this.kanbanManagerService.selectedBeanGuide) return this.emitActiveStages.emit([]);

        this.activeStages = this.kanbanManagerService.currentStages.filter(dis=>dis.not_in_kanban == 0) as SpiceBeanGuideActiveStageI[];
        this.inactiveStages = this.kanbanManagerService.currentStages.filter(dis=>dis.not_in_kanban == 1) as SpiceBeanGuideInactiveStageI[];

        this.emitActiveStages.emit(this.activeStages);
    }

    public openDetails(selectedStage){
        this.selected = selectedStage.id;
        this.selectedStage.emit(selectedStage);
    }
}
