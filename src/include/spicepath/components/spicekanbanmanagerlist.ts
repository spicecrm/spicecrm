import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    Output
} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";
import {KanbanManagerService} from "../services/kanbanmanager.service";
import {Subscription} from "rxjs";
import {
    SpiceBeanGuideActiveStageI,
    SpiceBeanGuideInactiveStageI,
    SpiceBeanGuideStageI
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

    @Output() public selectedStage: EventEmitter<SpiceBeanGuideStageI> = new EventEmitter<SpiceBeanGuideStageI>();
    @Output() public emitActiveStages: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend,
                private cdRef: ChangeDetectorRef,
                public kanbanManagerService: KanbanManagerService) {
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.setItems();
            this.subscribeToServiceChanges();
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

            this.kanbanManagerService.applyBulkChange(() => {
                event.previousContainer.data.forEach((stage, index) => {
                    stage.stage_sequence = index +1;
                });
            });

            event.item.data.not_in_kanban = event.container.id == 'notInKanbanList' ? 1 : 0;
        }

        this.kanbanManagerService.applyBulkChange(() => {
            event.container.data.forEach((stage, index) => {
                stage.stage_sequence = index +1;
            });
        });

        this.emitActiveStages.emit(this.activeStages);
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private subscribeToServiceChanges() {
        this.subscription.add(this.kanbanManagerService.selectedBeanGuide$.subscribe({
            next: () => {
                this.setItems();
               }
        }));

        this.subscription.add(
            this.kanbanManagerService.changeService.onHistoryChange.subscribe({
                next: () => {
                    this.activeStages = this.activeStages.sort((a, b) => +a.stage_sequence > +b.stage_sequence ? 1 : -1);
                    this.inactiveStages = this.inactiveStages.sort((a, b) => +a.stage_sequence > +b.stage_sequence ? 1 : -1);
                    this.cdRef.detectChanges();
                }
            })
        );
    }

    private setItems() {

        if (!this.kanbanManagerService.selectedBeanGuide) return this.emitActiveStages.emit([]);

        this.activeStages = (this.kanbanManagerService.currentStages.filter(dis=>dis.not_in_kanban == 0) as SpiceBeanGuideActiveStageI[])
            .map(stage => this.kanbanManagerService.generateTrackableObject(stage, 'stages'));
        this.inactiveStages = (this.kanbanManagerService.currentStages.filter(dis=>dis.not_in_kanban == 1) as SpiceBeanGuideInactiveStageI[])
            .map(stage => this.kanbanManagerService.generateTrackableObject(stage, 'stages'));

        this.selected = undefined;
        this.emitActiveStages.emit(this.activeStages);
    }

    public openDetails(selectedStage){
        this.selected = selectedStage.id;
        this.selectedStage.emit(selectedStage);
    }
}
