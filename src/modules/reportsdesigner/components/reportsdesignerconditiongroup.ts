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
     * @return group.type: string
     */
    get groupType() {
        return this.group.type;
    }

    /*
     * @param value: string
     * @set group.type
     * @set whereGroups
     */
    set groupType(value) {
        this.group.type = value;
        let whereGroups = this.whereGroups;
        whereGroups.some(group => {
            if (group.id == this.group.id) group.type = value;
        });
        this.whereGroups = whereGroups;
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
        this.model.setField('wheregroups', groups);
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
        if (this.whereGroups && this.whereGroups.length > 0) {
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
    private emitGroupSelfDeletion() {
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
            groupid: guid,
            unionid: 'root',
            group: '',
            type: 'AND',
            parent: this.group.id,
            conditions: [],
            children: []
        };
        this.group.children.push(group);
        this.whereGroups = [...this.whereGroups, group];
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
        this.whereGroups = this.whereGroups.filter(group => group.id != groupId);
        this.whereGroups = this.whereGroups.filter(group => group.parent == '-' || this.whereGroups.some(g => group.parent == g.id));
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
        let guid = this.model.generateGuid();
        let condition = {
            id: guid,
            groupid: this.group.id,
            unionid: this.group.id,
            fieldid: guid,
            referencefieldid: '',
            path: `root:${this.reportsDesignerService.currentPath}::${field.id}`,
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
        this.whereConditions = [...this.whereConditions, condition];
    }

    /*
     * @param id: string
     * @filter whereConditions from id
     * @set group.conditions
     * @set whereConditions
     */
    private deleteCondition(id) {
        this.whereConditions = this.whereConditions.filter(condition => condition.id != id);
        this.group.conditions = this.whereConditions.filter(condition => condition.groupid == this.group.id);
    }
}
