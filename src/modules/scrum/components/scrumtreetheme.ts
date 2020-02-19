/**
 * @module ModuleScrum
 */
import {Component, Input} from '@angular/core';

import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {scrumtree} from '../services/scrum.service';
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: '[scrum-tree-theme]',
    templateUrl: './src/modules/scrum/templates/scrumtreetheme.html',
    providers: [model, relatedmodels],
    host:{
        '(click)': "selectTheme()",
        "[attr.aria-expanded]": "expanded"
    }
})
export class ScrumTreeTheme {

    /**
     * inidcates if the epics are laoded for this node
     */
    private epicsloaded: boolean = false;

    /**
     * input for the theme
     */
    @Input() private theme: any = {};

    /**
     * a check to toggle expansion
     */
    private expanded: boolean = false;

    constructor(private scrum: scrumtree, private language: language, private metadata: metadata, private model: model, private epics: relatedmodels) {
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
    }

    /**
     * send the id and the type of the selected object
     */
    private selectTheme() {
        this.scrum.selectedObject = {id: this.theme.id, type: 'ScrumThemes'};
    }

    /**
     * load all of the related scrum epics
     */
    private loadRelatedEpics() {
        this.epics.loaditems = -99;
        this.epics.getData().subscribe(loaded => {
            this.epicsloaded = true;
        });

    }

    /**
     * expand if the epics are loaded
     */
    private toggleExpand() {
        if(!this.epicsloaded) {
            this.loadRelatedEpics();
        }
        this.expanded = !this.expanded;
    }

}
