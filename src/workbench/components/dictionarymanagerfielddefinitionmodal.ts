import {Component, ComponentRef} from '@angular/core';
import {ModalComponentI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";

@Component({
    selector: 'dictionary-manager-field-definition-modal',
    templateUrl: '../templates/dictionarymanagerfielddefinitionmodal.html',
    standalone: false
})
export class DictionaryManagerFieldDefinitionModal implements ModalComponentI {
    /**
     * reference to this component
     */
    public self: ComponentRef<this>;
    /**
     * passed definition
     */
    public definition: {
        name: string,
        type: string,
        required: 1 | 0,
        len: number,
        vname: string,
        duplicate_merge: 1 | 0,
        default: any,
        dbtype: string
        sysdomainfieldvalidation_id: string,
        sysdomaindefinition_id: string,
        sysdictionaryitem_id: string,
        sysdictionarydomainfield_id: string
    };
    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}