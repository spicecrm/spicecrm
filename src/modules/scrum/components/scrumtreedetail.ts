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
 * @module ModuleScrum
 */
import {Component, Input, OnChanges} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {scrum} from '../services/scrum.service';
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'scrum-tree-detail',
    templateUrl: './src/modules/scrum/templates/scrumtreedetail.html',
    providers: [model, view]
})
export class ScrumTreeDetail implements OnChanges {

    /**
     * inputs of the id and the type of the focused object
     */
    @Input() private focusid: string = '';
    @Input() private focustype: string = '';


    /**
     * the componentset to be rendered
     */
    private componentset: string;

    constructor(private scrum: scrum, private metadata: metadata, private model: model, private view: view, private modal: modal, private language: language) {

    }

    /**
     * reacts on changes and if required destroy the view, reloads it and also load the model
     * if the rendered model is dirty and the focusid changes, then a navigation change detected prompt will be executed
     * upon cancelling the selected object is the current model otherwise the next model will be rendered
     */
    public ngOnChanges() {
        if (this.focusid && this.focusid != this.model.id) {
            if(this.model.isDirty()) {
                this.modal.confirm(this.language.getLabel('MSG_NAVIGATIONSTOP', '', 'long'), this.language.getLabel('MSG_NAVIGATIONSTOP'))
                    .subscribe(response => {
                        if(!response) {
                            this.scrum.selectedObject.id = this.model.id;
                            return;
                        } else {
                            this.model.cancelEdit();
                            this.renderComponent(this.focusid);
                        }
                    });
            } else {
                this.renderComponent(this.focusid);
            }
        } else if(!this.focusid) {
            this.destroyContainer();
        }

    }

    /**
     * render the component for the corresponding id
     */
    private renderComponent(id) {
        this.model.id = id;
        this.model.module = this.focustype;
        this.model.getData();
        let config = this.metadata.getComponentConfig('ScrumTreeDetail', this.model.module);
        this.componentset = config.componentset;
    }

    /**
     * destroy the componentset and reset the model
     */
    private destroyContainer() {
        if (this.componentset) {
            this.componentset = null;
            this.model.reset();
        }

    }

    /**
     * permission to edit
     */
    get canEdit() {
        try {
            return this.model.checkAccess('edit');
        } catch (e) {
            return false;
        }
    }


}
