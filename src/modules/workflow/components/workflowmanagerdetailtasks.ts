/**
 * @module ModuleWorkflow
 */
import {
    Component,
    Input,
    OnChanges
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

/**
 * renders the task details view in the workflow manager
 */
@Component({
    selector: 'workflow-manager-detail-tasks',
    templateUrl: '../templates/workflowmanagerdetailtasks.html',
})
export class WorkflowManagerDetailTasks implements OnChanges {

    /**
     * the tasks for the selected workflow
     */
    @Input() public tasks: any[] = [];

    /**
     * the curently selectd task
     */
    public selectedTask: string = '';

    constructor(public model: model, public view: view, public language: language) {
    }

    /**
     * in case of input changes (other workflow selected) this selects the first task if the workflow has any tasks
     */
    public ngOnChanges() {
        this.sortTasksBySequence();

        // select the first task
        if (this.tasks.length > 0) {
            this.selectedTask = this.tasks[0].id;
        } else {
            this.selectedTask = '';
        }

    }

    /**
     * sorts the tasks by the sequence
     */
    public sortTasksBySequence() {
        if (this.tasks) {
            this.tasks.sort((a, b) => {
                return a.sequence > b.sequence ? 1 : -1;
            });
        }
    }

    /**
     * adds a task
     */
    public addTask() {
        let newGuid = this.model.utils.generateGuid();
        this.tasks.push({
            id: newGuid,
            workflowdefinition_id: this.model.id,
            deleted: 0,
            sequence: this.getNextSequence(),
            name: 'new Task',
            tasktype: 'task',
            decisions: [],
            systemactions: [],
            primarytask: this.tasks.length == 0 ? true : false
        });
        this.selectedTask = newGuid;
    }

    /**
     * helper function that loops over the tasks and gets the next available sequence number in an incremtne of 10
     */
    public getNextSequence() {
        let highestSequence = 0;

        for (let task of this.tasks) {
            if (task.deleted != 1 && parseInt(task.sequence, 10) > highestSequence) {
                highestSequence = parseInt(task.sequence, 10);
            }
        }

        return highestSequence + (10 - highestSequence % 10);
    }

}
