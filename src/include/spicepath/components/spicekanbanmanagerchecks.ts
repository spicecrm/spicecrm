import {Component, Input, SimpleChanges} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";
import {SpiceBeanGuideCheckI} from "../interfaces/kanbanmanager.interfaces";
import {KanbanManagerService} from "../services/kanbanmanager.service";
import {Subscription} from "rxjs";
import {modelutilities} from "../../../services/modelutilities.service";

@Component({
    selector: 'spice-kanban-manager-checks',
    templateUrl: '../templates/spicekanbanmanagerchecks.html'
})

export class SpiceKanbanManagerChecks {

    public stageChecks:SpiceBeanGuideCheckI[]=[];

    public selectedCheck:SpiceBeanGuideCheckI;

    private subscription: Subscription = new Subscription();

    @Input() public selectedStage: any;

    constructor(
        public backend: backend,
        public kanbanManagerService: KanbanManagerService,
        public modelutilities:modelutilities
    ) {
    }

    /**
     * check for changes in selected stage
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.loadChecks();
        this.selectedCheck = null;
    }

    /**
     * drag and drop of check labels
     */
    public dropCheckLabels(event: CdkDragDrop<any[]>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        // this.saveSequence();
    }
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * load checks according to the stage and bean guide chosen
     * @private
     */
    private loadChecks(){

        if (!this.selectedStage) return;

        this.stageChecks = this.kanbanManagerService.currentChecks.filter(check=>check.stage_id == this.selectedStage.id);
    }

    public setSelectedCheck(check: SpiceBeanGuideCheckI){

        const existing: SpiceBeanGuideCheckI = this.kanbanManagerService.currentChecks.find((currentCheck) => currentCheck.id == check.id);

        if (existing) {
            this.selectedCheck = this.kanbanManagerService.generateTrackableObject(check, 'checks');
        } else {
            const validator = obj => !!obj.check_method && !!obj.check_label;
            this.selectedCheck = this.kanbanManagerService.generateTrackableNewObject(check, 'checks', validator);
        }
    }

    /**
     * add new check stage label
     * @param e
     */
    public addCheck(e) {
        e.stopPropagation();
        const newCheck: SpiceBeanGuideCheckI = {
            id: this.modelutilities.generateGuid(),
            spicebeanguide_id: this.kanbanManagerService.selectedBeanGuide.id,
            stage_id: this.selectedStage.id,
            check_sequence: this.stageChecks.length,
            check_include: '',
            check_class: '',
            check_method: '',
            check_label: '',
            scope: this.kanbanManagerService.selectedBeanGuide.scope
        };
        this.stageChecks.push(newCheck);
        this.setSelectedCheck(newCheck);
        this.kanbanManagerService.currentChecks.push(newCheck);
    }
}