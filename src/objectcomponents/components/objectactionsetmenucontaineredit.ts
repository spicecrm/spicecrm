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
    templateUrl: './src/objectcomponents/templates/objectactionsetmenucontaineredit.html',
})
export class ObjectActionsetMenuContainerEdit {

    constructor(private language: language, private model: model) {

    }

    private doAction(){
        if(!this.model.checkAccess('edit'))            return;

        this.model.edit(true);
    }

}