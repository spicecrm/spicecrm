/**
 * @module ObjectComponents
 */
import {
    Component
} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';


@Component({
    selector: 'object-actionset-menu-container-edit',
    templateUrl: '../templates/objectactionsetmenucontaineredit.html',
})
export class ObjectActionsetMenuContainerEdit {

    constructor(public language: language, public model: model) {

    }

    public doAction(){
        if(!this.model.checkAccess('edit'))            return;

        this.model.edit(true);
    }

}
