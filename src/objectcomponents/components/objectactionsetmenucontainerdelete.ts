/**
 * @module ObjectComponents
 */
import {
    Component
} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {helper} from '../../services/helper.service';

@Component({
    templateUrl: '../templates/objectactionsetmenucontainerdelete.html',
})
export class ObjectActionsetMenuContainerDelete {

    constructor(public language: language, public model: model, public helper: helper) {

    }

    public doAction() {
        if (!this.model.checkAccess('delete')) return;

        // this.showDialog = true;
        this.helper.confirm(this.language.getLabel('LBL_DELETE_RECORD'), this.language.getLabel('MSG_DELETE_CONFIRM')).subscribe(answer => {
            if (answer) {
                this.model.delete();
            }
        });
    }

}
