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
import {ChangeHistoryRecordI} from "../../../workbench/interfaces/workbench.interfaces";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'spice-kanban-manager-list',
    templateUrl: '../templates/spicekanbanmanagerlist.html',
    standalone: false
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

            this.kanbanManagerService.applyBulkChange(() => {
                event.container.data.forEach((stage, index) => {
                    stage.stage_sequence = index +1;
                });
            });
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

                event.item.data.not_in_kanban = event.container.id == 'notInKanbanList' ? 1 : 0;

                event.container.data.forEach((stage, index) => {
                    stage.stage_sequence = index +1;
                });
            });

        }

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
        this.subscription.add(this.kanbanManagerService.save$.subscribe({
            next: () => {
                this.setItems();
               }
        }));
        this.subscription.add(this.kanbanManagerService.newAddedStages$.subscribe({
            next: stages => this.handleNewStages(stages)
        }));

        this.subscription.add(
            this.kanbanManagerService.changeService.onHistoryChange.subscribe({
                next: change => this.handleHistoryChange(change)
            })
        );
    }

    /**
     * handle history change when list items order changes or new items are added/removed
     * @private
     * @param change
     */
    private handleHistoryChange(change: {event: 'undo' | 'redo', trackableObj: any, record: ChangeHistoryRecordI}) {

        this.activeStages = this.activeStages.filter(dis=> dis.deleted != 1 && dis.not_in_kanban == 0).concat(
            (this.inactiveStages as any).filter(dis=> dis.deleted != 1 && dis.not_in_kanban == 0)
        );

        this.inactiveStages = (this.activeStages as any).filter(dis=> dis.deleted != 1 && dis.not_in_kanban == 1).concat(
            this.inactiveStages.filter(dis=> dis.deleted != 1 && dis.not_in_kanban == 1)
        );

        const key = change.record.obj.not_in_kanban == 0 ? 'activeStages' : 'inactiveStages';

        switch (change.record.action) {
            case 'delete':

                if (change.event == 'undo') {
                    this[key].push(change.trackableObj);
                } else {
                    this[key] = this[key].filter(stage => stage.id != change.record.id) as any;
                }
                break;
            case 'new':
                if (change.event == 'redo') {
                    this[key].push(change.trackableObj);
                } else {
                    this[key] = this[key].filter(stage => stage.id != change.record.id) as any;
                }

                break;

        }


        this.activeStages.sort((a, b) => +a.stage_sequence > +b.stage_sequence ? 1 : -1);
        this.inactiveStages.sort((a, b) => +a.stage_sequence > +b.stage_sequence ? 1 : -1);

        this.cdRef.detectChanges();
    }

    private setItems() {

        if (!this.kanbanManagerService.selectedBeanGuide) return this.emitActiveStages.emit([]);

        this.activeStages = (this.kanbanManagerService.currentStages.filter(dis=> dis.deleted != 1 && dis.not_in_kanban == 0) as SpiceBeanGuideActiveStageI[])
            .map(stage => this.kanbanManagerService.generateTrackableObject(stage, 'stages'));
        this.inactiveStages = (this.kanbanManagerService.currentStages.filter(dis=> dis.deleted != 1 && dis.not_in_kanban == 1) as SpiceBeanGuideInactiveStageI[])
            .map(stage => this.kanbanManagerService.generateTrackableObject(stage, 'stages'));

        this.selected = undefined;
        this.emitActiveStages.emit(this.activeStages);
    }

    /**
     * handle newly added stages
     * @param newStages
     * @private
     */
    private handleNewStages(newStages: SpiceBeanGuideStageI[]) {

        newStages = newStages.map(stage => this.kanbanManagerService.generateTrackableNewObject(stage, 'stages', obj => obj.deleted != 1));

        const activeStages = newStages.filter(dis => dis.not_in_kanban == 0);
        const inactiveStages = newStages.filter(dis => dis.not_in_kanban == 1);

        // register a random change to push the new item to the change service history
        activeStages.forEach(stage => {
            stage.deleted = 0;
            this.activeStages.push(stage as any);
        });
        inactiveStages.forEach(stage => {
            stage.deleted = 0;
            this.inactiveStages.push(stage as any);
        });

        this.emitActiveStages.emit(this.activeStages);
    }

    public openDetails(selectedStage){
        this.selected = selectedStage.id;
        this.selectedStage.emit(selectedStage);
    }

    /**
     * delete stage
     * @param event
     * @param stage
     * @param key
     */
    public deleteStage(event: MouseEvent, stage, key: 'activeStages' | 'inactiveStages') {
        event.stopPropagation();

        this.selected = undefined;
        this.selectedStage.emit(undefined);
        stage.deleted = 1;
        this[key] = this[key].filter(dis => dis.id != stage.id) as any;

        this.cdRef.detectChanges();

        if (key == 'activeStages') {
            this.emitActiveStages.emit(this.activeStages);
        }
    }
}
