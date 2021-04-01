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
    Input
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {footer} from "../../../services/footer.service";


@Component({
    selector: '[workflow-manager-detail-tasks-line]',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtasksline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTasksLine {

    @Input() task: any = {};
    @Input() tasks: any = {};
    @Input() fields: Array<any> = [];

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities, private footer: footer) {
        this.model.module = 'WorkflowTaskDefinitions';

        this.view.displayLabels = false;

    }

    ngOnChanges() {
        this.model.id = this.task.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.task);
    }

    getTaskName(taskID, renderMultiple = false) {
        let taskname = taskID;

        if (taskID) {
            this.tasks.some(task => {
                if (task.id == taskID) {
                    taskname = task.name;
                    return true;
                }
            })
        }

        // render the multiple next indicator
        if(renderMultiple && this.model.data.tasktype == 'decision' && this.model.data.decisions && this.model.data.decisions.length > 0){
            taskname = '[..]';
        }

        return taskname;
    }

    removeTask(){
        this.metadata.addComponent('SystemConfirmDialog', this.footer.footercontainer).subscribe(componenRef => {
            componenRef.instance.title = 'Delete Task';
            componenRef.instance.message = 'are you sure you want to delete the task?';
            componenRef.instance.answer.subscribe(decision => {
                if (decision) {
                    let index = 0;
                    this.tasks.some(task => {
                        if (task.id == this.model.id) {
                            task.deleted = 1;
                            return true;
                        }
                        index++;
                    })
                    // this.tasks.splice(index, 1);
                }
            });
        });
    }
}
