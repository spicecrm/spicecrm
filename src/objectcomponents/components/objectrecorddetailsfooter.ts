/**
 * @module ObjectComponents
 */
import {
    OnInit,
    ComponentFactoryResolver,
    Component,
    Renderer2
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

/**
 * renders the footer bar with a save and a cancel button
 *
 * needs to be embedded in a component providing a view and a model
 */
@Component({
    selector: 'object-record-details-footer',
    templateUrl: '../templates/objectrecorddetailsfooter.html'
})
export class ObjectRecordDetailsFooter implements OnInit{

    /**
     * the actionset to be rendered
     */
    public actionset: string;

    constructor(public view: view, public model: model, public language: language, public metadata: metadata) {
    }

    public ngOnInit(): void {
        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetailsFooter', this.model.module);
        this.actionset = componentconfig.actionset;
    }

    /**
     * cancels editing and sets the view back to viewMode
     */
    public cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    /**
     * saves the model and sets the view back to view mode
     */
    public save() {
        if (this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }
}
