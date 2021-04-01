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
import {Component, OnInit, Input, SkipSelf, OnDestroy} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {scrum} from '../services/scrum.service';
import {relatedmodels} from "../../../services/relatedmodels.service";
import {language} from "../../../services/language.service";

@Component({
    selector: '[scrum-tree-epic]',
    templateUrl: './src/modules/scrum/templates/scrumtreeepic.html',
    providers: [model, relatedmodels],
    host:{
        '(click)': "selectEpic($event)",
        "[attr.aria-expanded]": "expanded"
    }
})
export class ScrumTreeEpic implements OnInit, OnDestroy {

    /**
     * inidcates if the userstories are laoded
     */
    private userstoriesloaded: boolean = false;

    /**
     * a check to toggle expansion
     */
    private expanded: boolean = false;

    /**
     * a check to hide and disable the expansion button
     */
    private has_stories: boolean;

    /**
     * acl
     */
    private disabled: boolean = true;

    /**
     * input of the epic
     */
    @Input() private epic: any = {};


    constructor(private language: language, private metadata: metadata, private model: model, private modellist: modellist, private scrum: scrum, private userstories: relatedmodels) {}

    /**
     * initialize the model and the related module
     */
    public ngOnInit() {
        this.model.module = 'ScrumEpics';
        this.model.initialize();
        this.model.id = this.epic.id;
        this.model.data = this.epic;

        // related module
        this.userstories.module = this.model.module;
        this.userstories.id = this.model.id;
        this.userstories.relatedModule = 'ScrumUserStories';

        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }

        this.has_stories = this.model.getField('has_stories');
    }

    /**
     * load the related user stories
     */
    private loadRelatedUserStories() {
        this.userstories.sort.sortfield = 'sequence';
        this.userstories.loaditems = -99;
        this.userstories.getData().subscribe(loaded => {
            this.userstoriesloaded = true;
        });
    }

    /**
     * unset selectedObject on destroy
     */
    public ngOnDestroy(): void {
        if (this.scrum.selectedObject.id == this.epic.id && this.scrum.selectedObject.type == 'ScrumEpics') {
            this.scrum.selectedObject = {id: undefined, type: ''};
        }
    }

    /**
     * expand if the user stories are loaded
     */
    private toggleExpand() {
        if(!this.userstoriesloaded) {
            this.loadRelatedUserStories();
        }
        this.expanded = !this.expanded;
    }

    /**
     * stop propagating other objects
     * send the current object
     * @param e
     */
    private selectEpic(e) {
        e.stopPropagation();
        this.scrum.selectedObject = {id: this.epic.id, type: 'ScrumEpics'};
    }

    /**
     * set has_stories to true
     * reload the user stories
     * @param event
     */
    private loadChanges(event) {
        this.has_stories = true;
        this.loadRelatedUserStories();
    }

    /**
     * getter for the title attribute
     */
    get title() {
        return this.language.getLabel('LBL_ADD_USERSTORY');
    }

}
