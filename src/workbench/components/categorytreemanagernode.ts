/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {configurationService} from "../../services/configuration.service";

import {modal} from '../../services/modal.service';
import {SelectTreeAddDialog} from "./selecttreeadddialog";

@Component({
    selector: 'categgory-tree-manager-node',
    templateUrl: './src/workbench/templates/categorytreemanagernode.html',
})
export class CategoryTreeManagerNode {


    /**
     * the modal itself
     *
     * @private
     */
    private self: any;

    /**
     * the node
     *
     * @private
     */
    private node: any = {};

    /**
     * an array of all current nodes to ensure it is unique
     *
     * @private
     */
    private nodes: any[] = [];

    private action: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * checks that we can save
     */
    get canSave(){
        return this.node.node_name && this.node.node_key && this.keyUnique;
    }

    /**
     * checks that the key is unique
     */
    get keyUnique(){
        return this.node.node_key && this.nodes.filter(n => n.node_key == this.node.node_key && n.id != this.node.id).length == 0;
    }

    /**
     * closes the modal
     *
     * @private
     */
    private save(){
        this.action.emit(true);
        this.self.destroy();
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close(){
        this.action.emit(false);
        this.self.destroy();
    }


}
