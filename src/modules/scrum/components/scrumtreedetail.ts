/**
 * @module ModuleScrum
 */
import {Component, ViewChild, ViewContainerRef, Input, OnChanges, OnDestroy, HostListener} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {scrum} from '../services/scrum.service';
import {Subscription} from "rxjs";
import {modellist} from "../../../services/modellist.service";

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

    constructor(private scrum: scrum, private metadata: metadata, private model: model, private modellist: modellist) {

    }

    /**
     * reacts on changes and if required destroy the view, reloads it and also load the model
     */
    public ngOnChanges() {

        if (this.focusid && this.focusid != this.model.id) {
            this.model.id = this.focusid;
            this.model.module = this.focustype;
            this.model.getData();
            let config = this.metadata.getComponentConfig('ScrumTreeDetail', this.model.module);
            this.componentset = config.componentset;

        } else if(!this.focusid) {
            this.destroyContainer();
        }

    }

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
