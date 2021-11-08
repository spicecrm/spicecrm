/**
 * @module WorkbenchModule
 */
import {
    Component,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {configurationService} from "../../services/configuration.service";

import {modal} from '../../services/modal.service';
import {SelectTreeAddDialog} from "./selecttreeadddialog";

declare var _:any;

@Component({
    selector: 'categgory-tree-manager',
    templateUrl: './src/workbench/templates/categorytreemanager.html',
})
export class CategoryTreeManager {

    /**
     * indicator that we are loading
     *
     * @private
     */
    private loading: boolean = false;

    /**
     * the active tree
     * @private
     */
    private _activeTree: string;

    /**
     * the current tree nodes
     *
     * @private
     */
    private activeTreeNodes: any[] = [];

    /**
     * a backup of thetree nodes to determine if the data is dirty or not
     *
     * @private
     */
    private activeTreeNodesBackup: string;

    /**
     * the list of category trees
     * @private
     */
    private categoryTrees = [];

    /**
     * holds the selected tree nodes on any of the levels
     *
     * @private
     */
    private selectedTreeNodes = [null, null, null, null];

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private config: configurationService,
        private utils: modelutilities,
        private toast: toast,
        private modal: modal
    ) {
        this.loadTrees();
    }

    /**
     * adds a tree
     *
     * @private
     */
    private addTree() {
        this.modal.prompt("input", 'MSG_ENTER_TREE_NAME', 'MSG_ENTER_TREE_NAME').subscribe(
            name => {
                if (name) {
                    let newId = this.utils.generateGuid();
                    this.backend.postRequest(`configuration/spiceui/core/categorytrees/${newId}`, {}, {name}).subscribe(
                        res => {
                            this.categoryTrees.push({
                                id: newId,
                                name: name
                            });
                            this.activeTree = newId;
                        }
                    )
                }
            }
        )
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
    private hasChildren(id){
        return this.activeTreeNodes.filter(n => n.parent_id == id).length > 0
    }

    /**
     * retrieves the list of trees available
     *
     * @private
     */
    private loadTrees() {
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
    private loadActiveTree() {
        this.loading = true;
        this.activeTreeNodes = [];
        this.selectedTreeNodes = [null, null, null, null];
        this.backend.getRequest(`configuration/spiceui/core/categorytrees/${this.activeTree}/categorytreenodes`).subscribe(
            (treenodes: any) => {
                //  this.config.setData('select_tree', treenodes);
                this.activeTreeNodes = treenodes;
                this.activeTreeNodesBackup= JSON.stringify(treenodes);
                this.loading = false;
            },
            err => {
                this.loading = false;
                this.toast.sendToast('Error Loading Data', 'error');
            }
        );
    }

    /**
     * set the selected node
     *
     * @param level
     * @param id
     * @private
     */
    private setSelectedNodeID(level, id) {
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
    private addEnabled(level) {
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
    private getNodes(level: number) {
        switch (level) {
            case 0:
                return this.activeTreeNodes.filter(l => !l.parent_id).sort((a, b) => parseFloat(a.node_key) > parseFloat(b.node_key) ? 1 : -1);
                break;
            default:
                return this.selectedTreeNodes[level - 1] ? this.activeTreeNodes.filter(l => l.parent_id == this.selectedTreeNodes[level - 1]).sort((a, b) => parseFloat(a.node_key) > parseFloat(b.node_key) ? 1 : -1) : [];
                break;
        }
    }

    /**
     * edits the node
     * @param node
     * @private
     */
    private editNode(node) {
        let upd = {...node};
        this.modal.openModal('CategoryTreeManagerNode').subscribe(modalref => {
            modalref.instance.node = upd;
            modalref.instance.nodes = this.activeTreeNodes.filter(n => n.parent_id == upd.parent_id);
            modalref.instance.action.subscribe(add => {
                if (add) {
                    node.node_name = upd.node_name;
                    node.node_key = upd.node_key;
                    node.selectable = upd.selectable;
                    node.favorite = upd.favorite;
                }
            })
        })
    }

    /**
     * adds a new node on a given level
     *
     * @param level
     * @private
     */
    private addNode(level) {
        let node = {
            id: this.utils.generateGuid(),
            node_name: null,
            node_key: null,
            parent_id: level == 0 ? null : this.selectedTreeNodes[level - 1],
            syscategorytree_id: this.activeTree,
            selectable: true,
            favorite: false
        }

        this.modal.openModal('CategoryTreeManagerNode').subscribe(modalref => {
            // pass through the node
            modalref.instance.node = node;

            // pass through the other nodes
            modalref.instance.nodes = this.activeTreeNodes.filter(n => n.parent_id == node.parent_id);

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
    get isDirty(){
        return this.changedNodes.length > 0;
    }

    /**
     * returns an array of changed nodes
     */
    get changedNodes(): any[]{
        // get the delta
        let delta = [];
        let back = JSON.parse(this.activeTreeNodesBackup);
        for(let node of this.activeTreeNodes){
            let backNode = back.find(b => b.id == node.id);
            if(!backNode || (backNode && !_.isEqual(backNode, node))){
                delta.push(node);
            }
        }

        return delta;
    }

    /**
     * reverts the changes and reloads the tree
     *
     * @private
     */
    private revertChanges(){
        this.loadActiveTree();
    }

    /**
     * saves all the data
     *
     * @private
     */
    private save() {
        let delta = this.changedNodes;
        if(delta.length > 0){
            this.backend.postRequest(`configuration/spiceui/core/categorytrees/${this.activeTree}/categorytreenodes`, null, delta).subscribe(
                (success) => {
                    this.toast.sendToast('changes saved');
                    this.activeTreeNodesBackup= JSON.stringify(this.activeTreeNodes);
                },
                (error) => {
                    this.toast.sendAlert('saving failed!', 'error');
                    console.error(error);
                }
            );
        }
    }
}
