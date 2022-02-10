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
    templateUrl: '../templates/scrumtreetheme.html',
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
    public epicsloaded: boolean = false;

    /**
     * input for the theme
     */
    @Input() public theme: any = {};

    /**
     * property for permission
     */
    public disabled: boolean = true;
    /**
     * a check to toggle expansion
     */
    public expanded: boolean = false;

    /**
     * a check to hide and disable the expansion button
     */
    public has_epics: boolean;

    constructor(public scrum: scrum,
                public language: language,
                public modellist: modellist,
                public metadata: metadata,
                public model: model,
                public backend: backend,
                public epics: relatedmodels) {
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
        this.model.setData(this.theme);

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
    public selectTheme() {
        this.scrum.selectedObject = {id: this.theme.id, type: 'ScrumThemes'};
    }

    /**
     * load all of the related scrum epics sorted by sequence
     */
    public loadRelatedEpics() {
        this.epics.sort.sortfield = 'sequence';
        this.epics.loaditems = -99;
        this.epics.getData().subscribe(loaded => {
            this.epicsloaded = true;
        });
    }

    /**
     * expand if the epics are loaded
     */
    public toggleExpand() {
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
    public loadChanges(event) {
        this.has_epics = true;
        this.loadRelatedEpics();
    }


}
