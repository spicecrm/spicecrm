/**
 * @module ModuleReportsDesigner
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

declare var _;

@Component({
    selector: 'reports-designer-condition-group',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerconditiongroup.html',
    styles: [`
        .cdk-drop-list:hover {background: #fff}
    `]
})
export class ReportsDesignerConditionGroup implements OnInit, OnDestroy {

    public expanded: number;

    /*
     * @input group: object
     */
    @Input() private group: any;

    /*
     * @input canDelete: boolean
     */
    @Input() private canDelete: boolean = false;

    /*
     * @output groupDeleted: EventEmitter<string> = groupId
     */
    @Output() private groupDeleted: EventEmitter<string> = new EventEmitter<string>();

    constructor(private language: language,
                private reportsDesignerService: ReportsDesignerService,
                private model: model) {
    }

    /*
     * @return wheregroups: object[]
     */
    get whereGroups() {
        let groups = this.model.getField('wheregroups');
        return groups && groups.length > 0 ? JSON.parse(groups) ? JSON.parse(groups) : [] : [];
    }

    /*
     * @param value: object[]
     * @set wheregroups
     */
    set whereGroups(value) {
        this.model.setField('wheregroups', JSON.stringify(value));
    }

    /*
     * @return whereConditions: object[]
     */
    get whereConditions() {
        let conditions = this.model.getField('whereconditions');
        return conditions && conditions.length > 0 ? JSON.parse(conditions) ? JSON.parse(conditions) : [] : [];
    }

    /*
     * @param value: object[]
     * @set whereConditions
     */
    set whereConditions(value) {
        this.model.setField('whereconditions', JSON.stringify(value));
    }

    /*
     * @loadWhereGroups
     * @setDropLists
     */
    public ngOnInit() {
        if (!this.group) this.loadWhereGroups();
        this.setDropLists();
    }

    /*
     * @reset dropLists
     */
    public ngOnDestroy() {
        this.reportsDesignerService.dropLists = [];
    }

    /*
     * @set dropLists
     */
    private setDropLists() {
        this.reportsDesignerService.dropLists = this.whereGroups.map(group => group.id).reverse();
    }

    /*
     * @set group
     * @set group.children
     * @set group.conditions
     * @set whereGroups
     */
    private loadWhereGroups() {
        if (this.whereGroups.length > 0) {
            this.group = this.whereGroups.find(group => group.id == 'root');
            if (this.group) {
                this.group.children = [];
                this.group.conditions = this.whereConditions.filter(condition => condition.groupid == this.group.id);
                this.addGroupChildren(this.group);
            }
        } else {
            this.group = {
                id: 'root',
                groupid: 'root',
                unionid: 'root',
                type: 'AND',
                parent: '-',
                notexists: '',
                conditions: [],
                children: []
            };
            this.whereGroups = [this.group];
        }
    }

    /*
     * @removePlaceHolderElement
     * @moveItemInArray? item in group.conditions
     * @addCondition?
     */
    private onDrop(dragEvent: CdkDragDrop<any>) {
        this.reportsDesignerService.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);

        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(this.group.conditions, dragEvent.previousIndex, dragEvent.currentIndex);
        } else {
            this.addCondition(dragEvent.item.data);
        }
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
                group.conditions = this.whereConditions.filter(condition => condition.groupid == group.id);
                parent.children.push(group);
                this.addGroupChildren(parent.children[parent.children.length -1]);
            }
        }
    }

    /*
     * @set expanded = conditionId | null
     */
    private toggleExpand(conditionId) {
        if (!this.reportsDesignerService.expertMode) return;
        this.expanded = conditionId == this.expanded ? null : conditionId;
    }

    /*
     * @emit group.id by groupDeleted
     */
    private emitSelfDeletion() {
        this.groupDeleted.emit(this.group.id);
    }

    /*
     * @define group
     * @push group to group.children
     * @set whereGroups
     * @setDropLists
     */
    private addGroup() {
        let guid = this.model.generateGuid();
        let group = {
            id: guid,
            groupId: guid,
            unionid: guid,
            group: '',
            type: 'AND',
            parent: this.group.id,
            conditions: [],
            children: []
        };
        this.group.children.push(group);
        let groups = this.whereGroups;
        groups.push(group);
        this.whereGroups = groups;
        this.setDropLists();
    }

    /*
     * @param groupId: string
     * @set group.children
     * @set whereGroups
     * @cleanWhereConditions
     */
    private deleteGroup(groupId) {
        this.group.children = this.group.children.filter(group => group.id != groupId);
        let groups = this.whereGroups;
        groups = groups.filter(group => group.id != groupId);
        groups = groups.filter(group => group.parent == '-' || groups.some(g => group.parent == g.id));
        this.whereGroups = groups;
        this.cleanWhereConditions();
    }

    /*
     * @forEach whereConditions
     * @deleteCondition if it does not have a parent
     */
    private cleanWhereConditions() {
        this.whereConditions.forEach(condition => {
            if (!this.whereGroups.some(group => group.id == condition.groupid)) {
                this.deleteCondition(condition.id);
            }
        });
    }

    /*
     * @define condition
     * @param field: object
     * @push condition to group.conditions
     * @set whereConditions
     */
    private addCondition(field) {
        let condition = {
            id: this.model.generateGuid(),
            groupid: this.group.id,
            fieldid: field.fieldid,
            referencefieldid: '',
            path: this.reportsDesignerService.currentPath + '::' + field.id,
            displaypath: this.reportsDesignerService.currentPath,
            name: field.name,
            type: field.type,
            operator: 'ignore',
            jointype: 'required',
            usereditable: 'no',
            dashleteditable: 'no',
            exportpdf: 'no',
            value: '',
            valueto: '',
            valuekey: '',
            valuetokey: '',
        };
        this.group.conditions.push(condition);
        let conditions = this.whereConditions;
        conditions.push(condition);
        this.whereConditions = conditions;
    }

    /*
     * @param id: string
     * @filter whereConditions from id
     * @set group.conditions
     * @set whereConditions
     */
    private deleteCondition(id) {
        let conditions = this.whereConditions;
        conditions = conditions.filter(condition => condition.id != id);
        this.group.conditions = conditions;
        this.whereConditions = conditions;
    }

    /*
     * @param id: string
     * @param key: string
     * @param value: string
     * @set condition[key] = value
     * @set whereConditions
     */
    private setConditionValue(id, key, value) {
        let conditions = this.whereConditions;
        conditions.some(condition => {
            if (condition.id == id) condition[key] = value;
        });
        this.whereConditions = conditions;
    }
}
