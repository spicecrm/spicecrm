/**
 * @module ModuleScrum
 */
import {Component, Input, Injector, SkipSelf} from '@angular/core';

import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {scrumtree} from '../services/scrum.service';
import {relatedmodels} from "../../../services/relatedmodels.service";
import {modal} from "../../../services/modal.service";

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

    constructor(@SkipSelf() private themes: model, private scrum: scrumtree, private language: language, private metadata: metadata, private model: model, private epics: relatedmodels, private modal: modal, private injector: Injector) {
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

        // parent model
        this.themes.data = this.theme;
        this.model.module = this.epics.relatedModule;
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }
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

    /**
     * creates a new related epic
     */
    private newRelatedEpic() {
        if (!this.themes.data.id) {
            this.themes.data.id = this.themes.id;
        }
        this.model.id = "";

        this.model.addModel( "", this.themes).subscribe(newRecord => {
            if (newRecord != false) {
                this.epics.addItems([newRecord]);
            }
        });
    }


    /**
     * getter for the title attribute
     */
    get title() {
        return this.language.getLabel('LBL_ADD_EPIC');
    }
}
