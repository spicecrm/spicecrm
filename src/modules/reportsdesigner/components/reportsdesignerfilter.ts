/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    /**
    * @input module: {module: string, unionid: string}
    */
    @Input() private module: any = {};
    private rootGroup: any = {};
    private subscription: Subscription = new Subscription();

    constructor(private reportsDesignerService: ReportsDesignerService, private model: model) {
    }

    /**
    * @return whereConditions: object[]
     */
    get whereConditions() {
        return this.model.getField('whereconditions');
    }

    /**
    * @param value: object[]
     * @set whereConditions
     */
    set whereConditions(value) {
        this.model.setField('whereconditions', value);
    }

    /**
    * @return wheregroups: object[]
     */
    get whereGroups() {
        return this.model.getField('wheregroups');
    }

    /**
    * @param groups: object[]
     * @set wheregroups
     */
    set whereGroups(groups) {
        groups = groups.map(group => _.omit(group, ['conditions', 'children']));
        this.model.setField('wheregroups', groups);
    }

    /**
    * @loadWhereGroups
     */
    public ngOnChanges() {
        this.loadWhereGroups();
    }

    /**
    * unsubscribe from subscription
    */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
    * @param parent: string = '-'
     * @param id: string = guid
     * @return group: object
     */
    protected generateGroup(parent = '-', id = this.reportsDesignerService.generateGuid()) {
        return {
            id: id,
            groupid: id,
            unionid: this.module.unionid,
            type: 'AND',
            parent: parent,
            conditions: [],
            children: [],
            group: parent !== '-' ? null : 'root',
        };
    }

    /**
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

    /**
    * @param obj: object
     * @set whereGroups
     * @cleanGroup
     * @buildTree
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
    }

    private buildTree() {
        this.rootGroup.children = [];
        this.addGroupChildren(this.rootGroup);
    }

    /**
    * @param group
     * @set group.conditions from whereConditions
     */
    private setGroupConditions(group) {
        group.conditions = this.whereConditions ? this.whereConditions
            .filter(condition => condition.groupid == group.id) : [];
    }

    /**
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

    /**
    * @markDeletedGroupChildren
    * @filter whereGroups from deleted
    */
    private cleanGroup(parentId) {
        this.markDeletedGroupChildren(parentId);
        this.whereGroups = this.whereGroups.filter(group => !group.deleted);
        this.cleanWhereConditions();
    }

    /**
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

    /**
    * @filter whereConditions by condition.groupid
     */
    private cleanWhereConditions() {
        if (!this.whereConditions) return;
        this.whereConditions = this.whereConditions
            .filter(condition => this.whereGroups.some(group => group.id == condition.groupid));
    }
}
