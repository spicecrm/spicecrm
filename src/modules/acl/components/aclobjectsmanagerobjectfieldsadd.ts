/**
 * @module ModuleACL
 */
import {
    Component, EventEmitter, Output,
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {view} from "../../../services/view.service";

/**
 * manages the fisl control settings on an ACL Object
 */
@Component({
    selector: 'aclobjects-manager-object-fields-add',
    templateUrl: '../templates/aclobjectsmanagerobjectfieldsadd.html'
})
export class ACLObjectsManagerObjectFieldsAdd {

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     * the fieldname to be added
     */
    public fieldname: string;

    @Output() public addfield: EventEmitter<string> = new EventEmitter<string>();

    constructor(public model: model) {

    }

    public add(){
        this.addfield.emit(this.fieldname);
        this.close();
    }

    public close(){
        this.self.destroy();
    }
}
