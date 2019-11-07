/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

/**
 * renders a fieldset
 *
 * requires a component that provides a model and view
 */
@Component({
    templateUrl: './src/objectcomponents/templates/objectrecordfieldsetcontainer.html'
})
export class ObjectRecordFieldsetContainer {

    /**
     * the id of the fieldset to be rendered
     */
    @Input() private componentconfig: any = {};

    get fieldset() {
        return this.componentconfig.fieldset;
    }

    get direction() {
        return this.componentconfig.direction;
    }

    constructor(private metadata: metadata, private model: model, private view: view) {
    }
}
