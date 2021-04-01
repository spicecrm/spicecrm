/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasks.html',
})
export class WorkflowManagerDetailTasks implements OnChanges {

    /**
     * the tasks for the selected workflow
     */
    @Input() private tasks: any[] = [];

    /**
     * the curently selectd task
     */
    private selectedTask: string = '';

    constructor(private model: model, private view: view, private language: language) {
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
    private sortTasksBySequence() {
        if (this.tasks) {
            this.tasks.sort((a, b) => {
                return a.sequence > b.sequence ? 1 : -1;
            });
        }
    }

    /**
     * adds a task
     */
    private addTask() {
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
    private getNextSequence() {
        let highestSequence = 0;

        for (let task of this.tasks) {
            if (task.deleted != 1 && parseInt(task.sequence, 10) > highestSequence) {
                highestSequence = parseInt(task.sequence, 10);
            }
        }

        return highestSequence + (10 - highestSequence % 10);
    }

}
