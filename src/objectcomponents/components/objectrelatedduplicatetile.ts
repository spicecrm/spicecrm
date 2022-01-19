/**
 * @module ObjectComponents
 */

import {Component, OnInit, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {modal} from "../../services/modal.service";

/**
 * represents an object in the duplicates search
 */
@Component({
    selector: 'object-related-duplicate-tile',
    templateUrl: '../templates/objectrelatedduplicatetile.html',
    providers: [view]
})
export class ObjectRelatedDuplicateTile implements OnInit {

    /**
     * to enable the link on the tile
     */
    @Input() public enableLink: boolean = true;

    /**
     * show a button .. used in the edit modal since the link would lead to leavin gthe modal and navigate in teh back behind the modal
     */
    @Input() public enableButtonLink: boolean = false;

    /**
     * the fieldset from the config
     */
    public fieldset: string = '';

    constructor(public model: model, public modal: modal, public view: view, public language: language, public metadata: metadata) {
        this.view.displayLabels = false;
    }

    /**
     * loads the config and the fieldset
     */
    public ngOnInit() {

        let componentconfig = this.metadata.getComponentConfig('ObjectRelatedDuplicateTile', this.model.module);
        this.fieldset = componentconfig.fieldset;

    }

    /**
     * returns the fields
     */
    public getFields() {
        return this.metadata.getFieldSetFields(this.fieldset);
    }

    /**
     *
     */
    public navigateDetails() {
        this.modal.closeAllModals();
        this.model.goDetail();
    }
}
