/**
 * @module ModuleScrum
 */
import {Component, OnInit, Input, SkipSelf} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {scrumtree} from '../services/scrum.service';
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
export class ScrumTreeEpic implements OnInit {

    /**
     * inidcates if the userstories are laoded
     */
    private userstoriesloaded: boolean = false;

    /**
     * a check to toggle expansion
     */
    private expanded: boolean = false;

    private disabled: boolean = true;

    /**
     * input of the epic
     */
    @Input() private epic: any = {};


    constructor(@SkipSelf() private epics: model, private language: language, private metadata: metadata, private model: model, private modellist: modellist, private scrum: scrumtree, private userstories: relatedmodels) {}

    /**
     * initialize the model, the parent and the related module
     */
    public ngOnInit() {
        this.model.module = 'ScrumEpics';
        this.model.initialize();
        this.model.id = this.epic.id;
        this.model.data = this.epic;

        this.userstories.module = this.model.module;
        this.userstories.id = this.model.id;
        this.userstories.relatedModule = 'ScrumUserStories';

        // parent model
        this.epics.data = this.epic;
        this.model.module = this.userstories.relatedModule;

        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }
    }

    /**
     * load the related user stories
     */
    private loadRelatedUserStories() {
        this.userstories.loaditems = -99;
        this.userstories.getData().subscribe(loaded => {
            this.userstoriesloaded = true;
        });
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
     * creates a new related user story
     */
    private newRelatedUserStory() {
        if (!this.epics.data.id) {
            this.epics.data.id = this.epics.id;
        }
        this.model.id = "";

        this.model.addModel( "", this.epics).subscribe(newRecord => {
            if (newRecord != false) {
                this.userstories.addItems([newRecord]);
            }
        });
    }

    /**
     * getter for the title attribute
     */
    get title() {
        return this.language.getLabel('LBL_ADD_USERSTORY');
    }

}
