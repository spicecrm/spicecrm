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
    templateUrl: './src/objectcomponents/templates/objectrecorddetailsfooter.html'
})
export class ObjectRecordDetailsFooter implements OnInit{

    /**
     * the actionset to be rendered
     */
    private actionset: string;

    constructor(private view: view, private model: model, private language: language, private metadata: metadata) {
    }

    public ngOnInit(): void {
        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetailsFooter', this.model.module);
        this.actionset = componentconfig.actionset;
    }

    /**
     * cancels editing and sets the view back to viewMode
     */
    private cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    /**
     * saves the model and sets the view back to view mode
     */
    private save() {
        if (this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }
}
