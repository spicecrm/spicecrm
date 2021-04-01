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
import {Component, Input, OnDestroy} from '@angular/core';

import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modellist} from "../../../services/modellist.service";
import {language} from '../../../services/language.service';
import {scrum} from '../services/scrum.service';
import {relatedmodels} from "../../../services/relatedmodels.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: '[scrum-tree-theme]',
    templateUrl: './src/modules/scrum/templates/scrumtreetheme.html',
    providers: [model, relatedmodels],
    host: {
        '(click)': "selectTheme()",
        "[attr.aria-expanded]": "expanded"
    }
})
export class ScrumTreeTheme implements OnDestroy {

    /**
     * inidcates if the epics are laoded for this node
     */
    private epicsloaded: boolean = false;

    /**
     * input for the theme
     */
    @Input() private theme: any = {};

    /**
     * property for permission
     */
    private disabled: boolean = true;
    /**
     * a check to toggle expansion
     */
    private expanded: boolean = false;

    /**
     * a check to hide and disable the expansion button
     */
    private has_epics: boolean;

    constructor(private scrum: scrum,
                private language: language,
                private modellist: modellist,
                private metadata: metadata,
                private model: model,
                private backend: backend,
                private epics: relatedmodels) {
    }

    /**
     * getter for the title attribute
     */
    get title() {
        return this.language.getLabel('LBL_ADD_EPIC');
    }

    /**
     * initialize the model and the related module
     */
    public ngOnInit() {
        this.model.module = 'ScrumThemes';
        this.model.initialize();
        this.model.id = this.theme.id;
        this.model.data = this.theme;

        this.epics.module = this.model.module;
        this.epics.id = this.model.id;
        this.epics.relatedModule = 'ScrumEpics';

        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }

        this.has_epics = this.model.getField('has_epics');
    }

    /**
     * unset the selected object
     * then the component is destroyed
     */
    public ngOnDestroy(): void {
        if (this.scrum.selectedObject.id == this.theme.id && this.scrum.selectedObject.type == 'ScrumThemes') {
            this.scrum.selectedObject = {id: undefined, type: ''};
        }
    }

    /**
     * send the id and the type of the selected object
     */
    private selectTheme() {
        this.scrum.selectedObject = {id: this.theme.id, type: 'ScrumThemes'};
    }

    /**
     * load all of the related scrum epics sorted by sequence
     */
    private loadRelatedEpics() {
        this.epics.sort.sortfield = 'sequence';
        this.epics.loaditems = -99;
        this.epics.getData().subscribe(loaded => {
            this.epicsloaded = true;
        });
    }

    /**
     * expand if the epics are loaded
     */
    private toggleExpand() {
        if (!this.epicsloaded) {
            this.loadRelatedEpics();
        }
        this.expanded = !this.expanded;
    }

    /**
     * set has_epics to true
     * reload the epics
     * @param event
     */
    private loadChanges(event) {
        this.has_epics = true;
        this.loadRelatedEpics();
    }


}
