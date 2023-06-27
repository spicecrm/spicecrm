import {Component, Input, SimpleChanges} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";
import {SpiceBeanGuideChecksI} from "../interfaces/kanbanmanager.interfaces";
import {KanbanManagerService} from "../services/kanbanmanager.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'spice-kanban-manager-checks',
    templateUrl: '../templates/spicekanbanmanagerchecks.html'
})

export class SpiceKanbanManagerChecks {

    public checks:SpiceBeanGuideChecksI[]=[];

    public selectedCheck:SpiceBeanGuideChecksI;

    public selected: string;

    public classMethod: string = '';
    // /**
    //  * holds all check labels defined for the Bean
    //  */
    // public checkLabels: any[] = Array.from({length: 5}, (_,i) => 'Check Label ' + i);
    //
    // /**
    //  * holds the sequence of the label
    //  */
    // public labelSequence: any;
    //
    // /**
    //  * check label from the spicebeanguidestages_checks table
    //  * i.e. CHECK_QUALIFICATION_ACTIVITY
    //  */
    // public checkLabel: string = 'CHECK_LABEL_...';
    // //
    // // /**
    // //  * holds the backend method
    // //  */
    // public checkMethod: string = 'standardOpportunityGuideChecks';


    private subscription: Subscription = new Subscription();



    @Input() public selectedStage: any;


    constructor(
        public backend: backend,
        public kanbanManagerService: KanbanManagerService
    ) {
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.loadChecks();
            this.subscribeToSelectionChange();
        }, 0);
    }

    /**
     * check for changes in selected stage
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.selectedStage.previousValue === changes.selectedStage.currentValue || !(!!changes.selectedStage.currentValue)) return;
        this.loadChecks();
        // todo set back selected check
        this.selectedCheck;
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

    private subscribeToSelectionChange() {
        this.subscription = this.kanbanManagerService.selectedBeanGuide$.subscribe({
            next: () => {
                this.loadChecks();
            }
        });
    }

    /**
     * load checks according to the stage and bean guide chosen
     * @private
     */
    private loadChecks(){
        this.checks = this.kanbanManagerService.checks.filter(check=>check.stage_id == this.selectedStage.id && check.spicebeanguide_id == this.kanbanManagerService.selectedBeanGuide.id);
    }

    public openCheckDetails(check){
        this.selectedCheck = check;
        this.selected = check.id;
    }

    // /**
    //  * saves sequence of the check label
    //  */
    // public saveSequence() {
    //     this.checkLabels.forEach((entry, index) => {
    //         // entry.stage_sequence = index;
    //     });
    //
    //     this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null);
    // }

    /**
     * add new check stage label
     * @param e
     */
    public addCheckLabel(e) {
        const x = 'clicked';
    }

}