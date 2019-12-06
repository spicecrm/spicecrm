/**
 * @module ObjectComponents
 */
import {Component, Directive, OnInit, ViewChild} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {relatedmodels} from "../../services/relatedmodels.service";


/**
 * a helper component used in ObjectActionNewCopyRuleBeanButton
 *
 * does nothing but provide a model
 */
@Directive({
    selector: "object-action-edit-related-button-helper",
    providers: [model]
})
export class ObjectActionEditRelatedButtonHelper {
    constructor(public model: model) {
    }
}

@Component({
    selector: 'object-action-edit-related-button',
    templateUrl: './src/objectcomponents/templates/objectactioneditrelatedbutton.html'
})
export class ObjectActionEditRelatedButton implements OnInit {

    /**
     * this is a helper so we have a subcomponent that can provide a new model
     *
     * this model is detected via teh component and then addressed
     */
    @ViewChild(ObjectActionEditRelatedButtonHelper, {static: true}) private child;

    public disabled: boolean = true;

    /**
     * the action config from the actionset
     */
    public actionconfig: any = {};

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
    ) {

    }

    public ngOnInit() {
        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    public execute() {

        // Set the module of the new model and open a modal with copy rules
        this.child.model.module = this.actionconfig.module;
        this.child.model.id = this.model.getFieldValue(this.actionconfig.parent_field);
        this.child.model.getData(false);

        this.child.model.edit();
    }

    private handleDisabled(mode) {
        if (this.model.data.acl && !this.model.checkAccess('edit')) {

            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit' ? true : false;
    }

}
