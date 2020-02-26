/**
 * @module ModuleScrum
 */
import {Component, Input, Injector, SkipSelf, OnChanges} from '@angular/core';

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
     * property for permission
     */
    private disabled: boolean = true;
    /**
     * a check to toggle expansion
     */
    private expanded: boolean = false;

    private has_epics: boolean;

    constructor(private scrum: scrumtree, private language: language, private metadata: metadata, private model: model, private epics: relatedmodels, private injector: Injector) {
    }

    /**
     * initialize the model, the parent and the related module
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
        if(!this.epicsloaded) {
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

    /**
     * getter for the title attribute
     */
    get title() {
        return this.language.getLabel('LBL_ADD_EPIC');
    }
}
