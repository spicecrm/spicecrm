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
    templateUrl: './src/objectcomponents/templates/objectrelatedduplicatetile.html',
    providers: [view]
})
export class ObjectRelatedDuplicateTile implements OnInit {

    /**
     * to enable the link on the tile
     */
    @Input() private enableLink: boolean = true;
    @Input() private enableButtonLink: boolean = false;

    /**
     * the fieldset from the config
     */
    private fieldset: string = '';

    constructor(private model: model, private modal: modal, private view: view, private language: language, private metadata: metadata) {
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
    private getFields() {
        return this.metadata.getFieldSetFields(this.fieldset);
    }

    /**
     *
     */
    private navigateDetails() {
        this.modal.closeAllModals();
        this.model.goDetail();
    }
}
