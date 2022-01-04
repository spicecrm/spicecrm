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
    templateUrl: '../templates/scrumtreeepic.html',
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
    public userstoriesloaded: boolean = false;

    /**
     * a check to toggle expansion
     */
    public expanded: boolean = false;

    /**
     * a check to hide and disable the expansion button
     */
    public has_stories: boolean;

    /**
     * acl
     */
    public disabled: boolean = true;

    /**
     * input of the epic
     */
    @Input() public epic: any = {};


    constructor(public language: language, public metadata: metadata, public model: model, public modellist: modellist, public scrum: scrum, public userstories: relatedmodels) {}

    /**
     * initialize the model and the related module
     */
    public ngOnInit() {
        this.model.module = 'ScrumEpics';
        this.model.initialize();
        this.model.id = this.epic.id;
        this.model.setData(this.epic);

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
    public loadRelatedUserStories() {
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
    public toggleExpand() {
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
    public selectEpic(e) {
        e.stopPropagation();
        this.scrum.selectedObject = {id: this.epic.id, type: 'ScrumEpics'};
    }

    /**
     * set has_stories to true
     * reload the user stories
     * @param event
     */
    public loadChanges(event) {
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
