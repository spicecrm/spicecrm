/**
 * @module ModuleReportsDesigner
 */
import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";

declare var _;

@Component({
    selector: 'reports-designer-filter',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerfilter.html'
})
export class ReportsDesignerFilter implements OnChanges, OnDestroy {

    /*
    * @input module: {module: string, unionid: string}
    */
    @Input() private module: any = {};
    private rootGroup: any = {};
    private subscription: Subscription = new Subscription();

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
     * @setDropLists
     */
    public ngOnChanges() {
        this.loadWhereGroups();
        this.setDropLists();
    }

    /*
     * @reset dropLists
     */
    public ngOnDestroy() {
        this.reportsDesignerService.dropLists = [];
        this.subscription.unsubscribe();
    }

    /*
     * @param parent: string = '-'
     * @param id: string = model.generateGuid()
     * @return group: object
     */
    protected generateGroup(parent = '-', id = this.model.generateGuid()) {
        return {
            id: id,
            groupid: id,
            unionid: this.module.unionid,
            type: 'AND',
            parent: parent,
            conditions: [],
            children: []
        };
    }

    /*
     * @reset rootGroup
     * @set rootGroup from existing
     * @buildTree
     * @set whereGroups
     */
    private loadWhereGroups() {
        this.rootGroup = {};

        const existingRootGroup = this.whereGroups && this.whereGroups.length && this.whereGroups
            .find(group => this.module.unionid == group.unionid && group.parent == '-');

        if (existingRootGroup) {
            this.rootGroup = {...existingRootGroup};
            this.setGroupConditions(this.rootGroup);
        } else {
            this.rootGroup = this.generateGroup('-', this.module.unionid);
            this.whereGroups = this.whereGroups && this.whereGroups.length ?
                [...this.whereGroups, {...this.rootGroup}] : [{...this.rootGroup}];
        }
        this.buildTree();
    }

    /*
     * @param obj: object
     * @set whereGroups
     * @cleanGroup
     * @buildTree
     * @setDropLists
     */
    private handleTreeChange(obj) {
        switch (obj.action) {
            case 'deleteGroup':
                this.whereGroups = this.whereGroups.filter(group => group.id != obj.id);
                this.cleanGroup(obj.id);
                this.buildTree();
                break;
            case 'addGroup':
                this.whereGroups = [...this.whereGroups, this.generateGroup(obj.id)];
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
