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
    templateUrl: '../templates/scrumtreedetail.html',
    providers: [model, view]
})
export class ScrumTreeDetail implements OnChanges {

    /**
     * inputs of the id and the type of the focused object
     */
    @Input() public focusid: string = '';
    @Input() public focustype: string = '';


    /**
     * the componentset to be rendered
     */
    public componentset: string;

    constructor(public scrum: scrum, public metadata: metadata, public model: model, public view: view, public modal: modal, public language: language) {

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
    public renderComponent(id) {
        this.model.id = id;
        this.model.module = this.focustype;
        this.model.getData();
        let config = this.metadata.getComponentConfig('ScrumTreeDetail', this.model.module);
        this.componentset = config.componentset;
    }

    /**
     * destroy the componentset and reset the model
     */
    public destroyContainer() {
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
