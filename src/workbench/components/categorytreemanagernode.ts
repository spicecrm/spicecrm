/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, OnInit,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {configurationService} from "../../services/configuration.service";

import {modal} from '../../services/modal.service';
import {SelectTreeAddDialog} from "./selecttreeadddialog";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'categgory-tree-manager-node',
    templateUrl: '../templates/categorytreemanagernode.html',
})
export class CategoryTreeManagerNode implements OnInit {


    /**
     * the modal itself
     *
     * @private
     */
    public self: any;

    /**
     * the node
     *
     * @private
     */
    public node: any = {};

    /**
     * an array of all current nodes to ensure it is unique
     *
     * @private
     */
    public nodes: any[] = [];

    /**
     * the add params component
     *
     * @private
     */
    public addParamsComponent: string;

    /**
     * the additonal params
     * @private
     */
    public addParams: any;

    /**
     * an emitter for the action
     *
     * @private
     */
    public action: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * checks that we can save
     */
    get canSave() {
        // regex for numeric check
        let lkey = new RegExp(/([1-9][0-9]*)|0/);

        return this.node.node_name && this.node.node_key && lkey.test(this.node.node_key) && this.keyUnique;
    }

    /**
     * checks that the key is unique
     */
    get keyUnique() {
        return this.node.node_key && this.nodes.filter(n => n.node_key == this.node.node_key && n.id != this.node.id).length == 0;
    }

    public ngOnInit() {
        this.addParams = this.node.add_params ?? {};

        // initialize the data
        this.node.valid_from = moment(this.node.valid_from);
        this.node.valid_to = moment(this.node.valid_to);

    }

    /**
     * closes the modal
     *
     * @private
     */
    public save() {
        this.node.add_params = this.addParams;

        // format the dates back
        this.node.valid_from = this.node.valid_from.format('YYYY-MM-DD HH:mm:ss');
        this.node.valid_to = this.node.valid_to.format('YYYY-MM-DD HH:mm:ss');
        this.action.emit(true);
        this.self.destroy();
    }

    /**
     * closes the modal
     *
     * @private
     */
    public close() {
        this.action.emit(false);
        this.self.destroy();
    }


}
