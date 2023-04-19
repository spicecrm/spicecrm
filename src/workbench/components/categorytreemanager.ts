/**
 * @module WorkbenchModule
 */
import {Component, Injector} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {configurationService} from "../../services/configuration.service";

import {modal} from '../../services/modal.service';
import {CategoryTreeAddModal} from "./categorytreeaddmodal";

declare var _: any;
declare var moment: any;

@Component({
    selector: 'categgory-tree-manager',
    templateUrl: '../templates/categorytreemanager.html',
})
export class CategoryTreeManager {

    /**
     * indicator that we are loading
     *
     * @private
     */
    public loading: boolean = false;

    /**
     * the active tree
     * @private
     */
    public _activeTree: string;

    /**
     * the current tree nodes
     *
     * @private
     */
    public activeTreeNodes: any[] = [];

    /**
     * a backup of thetree nodes to determine if the data is dirty or not
     *
     * @private
     */
    public activeTreeNodesBackup: string;

    /**
     * the list of category trees
     * @private
     */
    public categoryTrees = [];

    /**
     * holds the selected tree nodes on any of the levels
     *
     * @private
     */
    public selectedTreeNodes = [null, null, null, null];

    constructor(
        public backend: backend,
        public metadata: metadata,
        public language: language,
        public config: configurationService,
        public utils: modelutilities,
        public toast: toast,
        public modal: modal,
        public injector: Injector
    ) {
        this.loadTrees();
    }

    /**
     * adds a tree
     */
    public addTree() {
        this.modal.openModal('CategoryTreeAddModal', true, this.injector).subscribe(selectModal => {
            selectModal.instance.categoryTrees = this.categoryTrees;

            selectModal.instance.action.subscribe(action => {
                if (action == 'save') {
                    this.activeTree = selectModal.instance.newActiveTreeId;
                }
            });
        });
    }

    /**
     * opens a modal to allow linking the tree and storing the values in table syscategorytreelinks
     */
    public linkTree() {
        this.modal.openModal('CategoryTreeManagerLinkModal',true, this.injector).subscribe(selectModal => {
            selectModal.instance.activeTreeId = this.activeTree;
        });

    }

    /**
     * a getter for the active tree
     */
    get activeTree() {
        return this._activeTree;
    }

    /**
     * setter for the ative tree - used to also load the tree nodes
     *
     * @param treeid
     */
    set activeTree(treeid) {
        this._activeTree = treeid;

        this.loadActiveTree();
    }

    /**
     * simple function to check if the current node has children
     *
     * @param id
     * @private
     */
    public hasChildren(id) {
        return this.activeTreeNodes.filter(n => n.parent_id == id).length > 0
    }

    /**
     * retrieves the list of trees available
     *
     * @private
     */
    public loadTrees() {
        this.loading = true;
        if (!this.config.getData('select_trees')) {
            this.backend.getRequest('configuration/spiceui/core/categorytrees').subscribe(
                (res: any) => {
                    this.loading = false;

                    // this.config.setData('select_trees', res);
                    this.categoryTrees = res;

                    if (this.categoryTrees.length > 0) {
                        this.activeTree = this.categoryTrees[0].id;
                    }
                },
                err => {
                    this.loading = false;
                    this.toast.sendToast('Error Loading Data', 'error');
                }
            );
        }
    }

    /**
     * loads the active tree
     *
     * @private
     */
    public loadActiveTree() {
        this.loading = true;
        this.activeTreeNodes = [];
        this.selectedTreeNodes = [null, null, null, null];
        this.backend.getRequest(`configuration/spiceui/core/categorytrees/${this.activeTree}/categorytreenodes`, {all: true}).subscribe(
            (treenodes: any) => {
                //  this.config.setData('select_tree', treenodes);
                this.activeTreeNodes = treenodes;
                this.activeTreeNodesBackup = JSON.stringify(treenodes);
                this.loading = false;
            },
            err => {
                this.loading = false;
                this.toast.sendToast('Error Loading Data', 'error');
            }
        );
    }

    /**
     * returns a color class for the node dpending on status and dates
     *
     * @param node
     */
    public getNodeStyle(node) {
        // created to be displayed green
        if (node.node_status == 'c') {
            return 'slds-text-color_success';
        }

        // inactive or not in date range to be displayed red
        let now = new moment();
        if (node.node_status == 'i' || now.isBefore(node.valid_from) || now.isAfter(node.valid_to)) {
            return 'slds-text-color_error';
        }

        return '';
    }

    /**
     * set the selected node
     *
     * @param level
     * @param id
     * @private
     */
    public setSelectedNodeID(level, id) {
        if (this.selectedTreeNodes[level] != id) {
            this.selectedTreeNodes[level] = id;

            // reset all higher level
            level++;
            while (level <= 3) {
                this.selectedTreeNodes[level] = null;
                level++;
            }

        }
    }

    /**
     * returns if the add for the level can be enabled
     *
     * @param level
     * @private
     */
    public addEnabled(level) {
        switch (level) {
            case 0:
                return !!this.activeTree
                break;
            default:
                return !!this.selectedTreeNodes[level - 1]
                break;
        }
    }

    /**
     * returns the nodes for a given level
     *
     * @param level
     * @private
     */
    public getNodes(level: number) {
        switch (level) {
            case 0:
                return this.activeTreeNodes.filter(l => l.deleted == 0 && !l.parent_id).sort((a, b) => parseFloat(a.node_key) > parseFloat(b.node_key) ? 1 : -1);
                break;
            default:
                return this.selectedTreeNodes[level - 1] ? this.activeTreeNodes.filter(l => l.deleted == 0 && l.parent_id == this.selectedTreeNodes[level - 1]).sort((a, b) => parseFloat(a.node_key) > parseFloat(b.node_key) ? 1 : -1) : [];
                break;
        }
    }

    /**
     * edits the node
     * @param node
     * @private
     */
    public editNode(node) {
        let upd = {...node};
        this.modal.openModal('CategoryTreeManagerNode').subscribe(modalref => {

            // pass the node
            modalref.instance.node = upd;

            // pass all other nodes
            modalref.instance.nodes = this.activeTreeNodes.filter(n => (!node.parent_id && !n.parent_id) || (node.parent_id && n.parent_id == node.parent_id));

            // pass a component if set
            modalref.instance.addParamsComponent = this.categoryTrees.find(t => t.id == this.activeTree).add_params_component;

            modalref.instance.action.subscribe(add => {
                if (add) {
                    node.node_name = upd.node_name;
                    node.node_description = upd.node_description;
                    node.node_key = upd.node_key;
                    node.selectable = upd.selectable;
                    node.favorite = upd.favorite;
                    node.add_params = upd.add_params;
                    node.valid_from = upd.valid_from;
                    node.valid_to = upd.valid_to;
                    node.node_status = upd.node_status;
                    node.deleted = 0;
                }
            })
        })
    }

    /**
     * deletes a node
     *
     * @param node
     */
    public deleteNode(node) {
        this.modal.confirm('MSG_DELETE_NODE', 'MSG_DELETE_NODE').subscribe(
            answer => {
                if (answer) {
                    node.deleted = 1;
                    this.deleteChildren(node);
                }
            }
        )
    }

    /**
     * deletes children recursively
     *
     * @param node
     * @private
     */
    private deleteChildren(node) {
        let children = this.activeTreeNodes.filter(n => n.parent_id == node.id && n.deleted == 0);
        for (let child of children) {
            child.deleted = 1;
            this.deleteChildren(child);
        }
    }

    // retrieves the next number for the tree
    private getNextNumber(parent_id) {
        let highest = 0;
        let nodes = this.activeTreeNodes.filter(n => (!parent_id && !n.parent_id) || (parent_id && n.parent_id == parent_id));
        for (let node of nodes) {
            let keyInt = parseInt(node.node_key, 10);
            if (keyInt > highest) highest = keyInt;
        }
        return highest + 1;
    }

    /**
     * adds a new node on a given level
     *
     * @param level
     * @private
     */
    public addNode(level) {

        // get the next number
        let node = {
            id: this.utils.generateGuid(),
            node_name: null,
            node_description: null,
            node_key: this.getNextNumber(this.selectedTreeNodes[level - 1]),
            parent_id: level == 0 ? null : this.selectedTreeNodes[level - 1],
            syscategorytree_id: this.activeTree,
            selectable: true,
            node_status: 'c',
            favorite: false,
            deleted: 0
        }

        this.modal.openModal('CategoryTreeManagerNode').subscribe(modalref => {
            // pass through the node
            modalref.instance.node = node;

            // pass through the other nodes
            modalref.instance.nodes = this.activeTreeNodes.filter(n => (!node.parent_id && !n.parent_id) || (node.parent_id && n.parent_id == node.parent_id))

            // pass a component if set
            modalref.instance.addParamsComponent = this.categoryTrees.find(t => t.id == this.activeTree).add_params_component;

            // wait for the response
            modalref.instance.action.subscribe(add => {
                if (add) {
                    this.activeTreeNodes.push(node);
                }
            })
        })
    }

    /**
     * returns if we have dirty records
     */
    get isDirty() {
        return this.changedNodes.length > 0;
    }

    /**
     * returns an array of changed nodes
     */
    get changedNodes()
        :
        any[] {
        // get the delta
        let delta = [];
        if (this.activeTreeNodesBackup) {
            let back = JSON.parse(this.activeTreeNodesBackup);
            for (let node of this.activeTreeNodes) {
                let backNode = back.find(b => b.id == node.id);
                if (!backNode || (backNode && !_.isEqual(backNode, node))) {
                    delta.push(node);
                }
            }
        }

        return delta;
    }

    /**
     * reverts the changes and reloads the tree
     *
     * @private
     */
    public revertChanges() {
        this.loadActiveTree();
    }

    /**
     * saves all the data
     *
     * @private
     */
    public  save() {
        let delta = this.changedNodes;
        if (delta.length > 0) {
            this.backend.postRequest(`configuration/spiceui/core/categorytrees/${this.activeTree}/categorytreenodes`, null, delta).subscribe(
                (success) => {
                    this.toast.sendToast('changes saved');
                    this.activeTreeNodesBackup = JSON.stringify(this.activeTreeNodes);
                },
                (error) => {
                    this.toast.sendAlert('saving failed!', 'error');
                    console.error(error);
                }
            );
        }
    }
}
