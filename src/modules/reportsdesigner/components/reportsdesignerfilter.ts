/**
 * @module ModuleReportsDesigner
 */
import {Component, OnDestroy} from '@angular/core';
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";

declare var _;

@Component({
    selector: 'reports-designer-filter',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerfilter.html'
})
export class ReportsDesignerFilter implements OnDestroy {

    private rootGroup: any = {
        id: 'root',
        groupid: 'root',
        unionid: 'root',
        type: 'AND',
        parent: '-',
        notexists: '',
        conditions: [],
        children: []
    };

    constructor(private reportsDesignerService: ReportsDesignerService, private model: model) {
    }

    /*
     * @return whereConditions: object[]
     */
    get whereConditions() {
        return this.model.getField('whereconditions');
    }

    /*
     * @param value: object[]
     * @set whereConditions
     */
    set whereConditions(value) {
        this.model.setField('whereconditions', value);
    }

    /*
     * @return wheregroups: object[]
     */
    get whereGroups() {
        return this.model.getField('wheregroups');
    }

    /*
     * @param groups: object[]
     * @set wheregroups
     */
    set whereGroups(groups) {
        groups = groups.map(group => _.omit(group, ['conditions', 'children']));
        this.model.setField('wheregroups', groups);
    }

    /*
     * @loadWhereGroups
     */
    public ngOnInit() {
        this.loadWhereGroups();
        this.setDropLists();
    }

    /*
     * @reset dropLists
     */
    public ngOnDestroy() {
        this.reportsDesignerService.dropLists = [];
    }

    /*
     * @cleanWhereGroups dropLists
     */
    private handleTreeChange(obj) {
        switch (obj.action) {
            case 'deleteGroup':
                this.whereGroups = this.whereGroups.filter(group => group.id != obj.id);
                this.cleanGroup(obj.id);
                this.buildTree();
                break;
            case 'addGroup':
                let guid = this.model.generateGuid();
                let group = {
                    id: guid,
                    groupid: guid,
                    unionid: 'root',
                    group: '',
                    type: 'AND',
                    parent: obj.id,
                    conditions: [],
                    children: []
                };
                this.whereGroups = [...this.whereGroups, group];
                this.buildTree();
        }
        this.setDropLists();
    }

    private buildTree() {
        this.rootGroup.children = [];
        this.addGroupChildren(this.rootGroup);
    }

    /*
     * @set dropLists
     */
    private setDropLists() {
        this.reportsDesignerService.dropLists = this.whereGroups.map(group => group.id).reverse();
    }

    /*
     * @set rootGroup
     * @set rootGroup.conditions
     * @reset rootGroup.children
     * @buildGroupsTree
     * @set whereGroups
     */
    private loadWhereGroups() {
        if (this.whereGroups && this.whereGroups.length > 0) {
            this.rootGroup = this.whereGroups.find(group => group.id == 'root');
            if (this.rootGroup) {
                this.setGroupConditions(this.rootGroup);
                this.buildTree();
            }
        } else {
            this.whereGroups = [this.rootGroup];
        }
    }

    /*
     * @param group
     * @set group.conditions from whereConditions
     */
    private setGroupConditions(group) {
        group.conditions = this.whereConditions ? this.whereConditions
            .filter(condition => condition.groupid == group.id) : [];
    }

    /*
    * recursive method to push a group to the parent.children array and retrieve the group conditions
    * @param parent: object
    * @push group Item to parent.children array
    * @call self and pass the group as parent
    */
    private addGroupChildren(parent) {
        for (let group of this.whereGroups) {
            if (group.parent == parent.id) {
                let newGroup = {...group};
                this.setGroupConditions(newGroup);
                newGroup.children = [];
                parent.children.push(newGroup);
                this.addGroupChildren(newGroup);
            }
        }
    }

    /*
      * @markDeletedGroupChildren
      * @filter whereGroups from deleted
      */
    private cleanGroup(parentId) {
        this.markDeletedGroupChildren(parentId);
        this.whereGroups = this.whereGroups.filter(group => !group.deleted);
        this.cleanWhereConditions();
    }

    /*
    * recursive method to mark the children of the deleted group as deleted.
    * @param parentId: string
    * @call markDeletedGroupChildren
    * @set group.deleted = true
    */
    private markDeletedGroupChildren(parentId) {
        for (let group of this.whereGroups) {
            if (group.parent == parentId) {
                this.markDeletedGroupChildren(group.id);
                group.deleted = true;
            }
        }
    }

    /*
     * @filter whereConditions by condition.groupid
     */
    private cleanWhereConditions() {
        if (!this.whereConditions) return;
        this.whereConditions = this.whereConditions
            .filter(condition => this.whereGroups.some(group => group.id == condition.groupid));
    }
}
