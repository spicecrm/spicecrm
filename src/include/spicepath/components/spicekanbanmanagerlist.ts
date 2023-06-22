import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";
import {KanbanManagerService} from "../services/kanbanmanager.service";
import {Subscription} from "rxjs";
import {SpiceBeanGuideStagesI} from "../interfaces/kanbanmanager.interfaces";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'spice-kanban-manager-list',
    templateUrl: '../templates/spicekanbanmanagerlist.html'
})

export class SpiceKanbanManagerList implements OnDestroy, AfterViewInit{

    public notInKanban:SpiceBeanGuideStagesI[] = [];
    public activeStages:SpiceBeanGuideStagesI[] = [];

    // public enumValues = Array.from({length: 50}, (_, i) => 'Item ' + i);
    private subscription: Subscription = new Subscription();

    @Output() public selectedStage: EventEmitter<any> = new EventEmitter<any>();
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

        this.activeStages = this.kanbanManagerService.stages
            .filter(dis=>dis.not_in_kanban == 0 && dis.spicebeanguide_id == this.kanbanManagerService.selectedBeanGuide.id);
        this.notInKanban = this.kanbanManagerService.stages
            .filter(dis=>dis.not_in_kanban == 1 && dis.spicebeanguide_id == this.kanbanManagerService.selectedBeanGuide.id);

        this.emitActiveStages.emit(this.activeStages);
    }

    public openDetails(selectedStage){
        this.selectedStage.emit(selectedStage)
    }
}
