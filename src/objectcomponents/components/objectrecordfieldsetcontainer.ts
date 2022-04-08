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
    selector: 'object-record-fieldset-container',
    templateUrl: '../templates/objectrecordfieldsetcontainer.html'
})
export class ObjectRecordFieldsetContainer {

    /**
     * the id of the fieldset to be rendered
     */
    @Input() public componentconfig: any = {};

    get fieldset() {
        return this.componentconfig.fieldset;
    }

    get direction() {
        return this.componentconfig.direction;
    }

    constructor(public metadata: metadata, public model: model, public view: view) {
    }

    /**
     * determine if the fieldset as such is hidden
     *
     * this is mainly driven by the required model state
     */
    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }
}
