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
    selector: '[workflow-manager-detail-taskdecisions-line]',
    templateUrl: './src/modules/workflow/templates/workflowmanagerdetailtaskdecisionsline.html',
    providers: [model, view]
})
export class WorkflowManagerDetailTaskDecisionsLine {

    @Input() private decision: any = {};
    @Input() private decisions: any = {};
    @Input() private tasks: any[] = [];

    constructor(private metadata: metadata, private model: model, private view: view, private language: language, private modelutilities: modelutilities, private footer: footer) {
        this.model.module = 'WorkflowTaskDecisions';

        // set the view to edit mode
        this.view.isEditable = true;
        this.view.displayLabels = false;
        this.view.setEditMode();
    }

    public ngOnChanges() {
        this.model.id = this.decision.id;
        this.model.data = this.modelutilities.backendModel2spice(this.model.module, this.decision);
    }

    private removeDecision() {
        this.metadata.addComponent('SystemConfirmDialog', this.footer.footercontainer).subscribe(componenRef => {
            componenRef.instance.title = 'Delete Decision';
            componenRef.instance.message = 'are you sure you want to delete the decision option?';
            componenRef.instance.answer.subscribe(decision => {
                if (decision) {
                    let index = 0;
                    this.decisions.some(decision => {
                        if (decision.id == this.model.id) {
                            decision.deleted = 1;
                            return true;
                        }
                        index++;
                    });
                    // this.decisions.splice(index, 1);
                }
            });
        });
    }

}
