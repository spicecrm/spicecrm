/**
 * @module ObjectComponents
 */

import {
    Component,
    Input, OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-edit-modal-dialog-container',
    templateUrl: '../templates/objecteditmodaldialogcontainer.html'
})
export class ObjectEditModalDialogContainer implements OnInit {
    /**
     * an optional input for a componentset to be rendered
     * @private
     */
    @Input() public componentSet: string = '';

    constructor(public model: model, public metadata: metadata) {

    }

    /**
     * if no componentset has been sent in use the one from the Detail View
     */
    public ngOnInit() {
        if(!this.componentSet || this.componentSet == '') {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
            this.componentSet = componentconfig.componentset;
        }
    }
}
