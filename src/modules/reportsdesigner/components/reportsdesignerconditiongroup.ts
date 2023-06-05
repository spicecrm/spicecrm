/**
 * @module ModuleReportsDesigner
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-condition-group',
    templateUrl: '../templates/reportsdesignerconditiongroup.html',
    styles: [`
        .cdk-drop-list:hover {
            background: #fff
        }
    `]
})
export class ReportsDesignerConditionGroup {

    /**
    * @input group: object
     */
    @Input() public group: any;
    /**
    * @input canDelete: boolean
     */
    @Input() public canDelete: boolean = false;
    /**
    * @output groupDeleted: EventEmitter<string> = groupId
     */
    @Output() public treeChange: EventEmitter<any> = new EventEmitter<any>();
    public expanded: number;

    constructor(public language: language,
                public reportsDesignerService: ReportsDesignerService,
                public model: model) {
    }

    get groupType(): string {
        return this.group.type;
    }

    set groupType(value: string) {
        this.group.type = value;
        this.model.getField('wheregroups').some(group => {
            if (group.id == this.group.id) {
                group.type = value;
                return true;
            }
        });

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
    * @removePlaceHolderElement
     * @moveItemInArray? item in group.conditions
     * @addCondition?
     */
    public onDrop(dragEvent: CdkDragDrop<any>) {
        this.reportsDesignerService.removePlaceHolderElement(dragEvent.previousContainer.element.nativeElement);

        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(this.group.conditions, dragEvent.previousIndex, dragEvent.currentIndex);
        } else {
            this.addCondition(dragEvent.item.data);
        }
    }

    /**
    * @emit object = {action: string, id: string} by treeChange
     */
    public addGroup() {
        this.treeChange.emit({action: 'addGroup', id: this.group.id});
    }

    /**
    * @emit object = {action: string, id: string} by treeChange
     */
    public deleteGroup() {
        this.treeChange.emit({action: 'deleteGroup', id: this.group.id});
    }

    /**
    * @emit obj: object by treeChange
     */
    public handleTreeChange(obj) {
        this.treeChange.emit(obj);
    }

    /**
    * @set expanded = conditionId | null
     */
    public toggleExpand(conditionId) {
        if (!this.reportsDesignerService.expertMode) return;
        this.expanded = conditionId == this.expanded ? null : conditionId;
    }

    /**
    * @define condition
     * @param field: object
     * @push condition to group.conditions
     * @set whereConditions
     */
    public addCondition(field) {
        let guid = this.reportsDesignerService.generateGuid();
        let path = `${this.reportsDesignerService.getCurrentPath()}::${field.id}`;

        // replace the path with union path
        if (this.group.unionid != 'root') {
            const rootPath = this.reportsDesignerService.getCurrentPath().indexOf('link') < 0 ? 'unionroot::' : '';
            const unionPath = this.reportsDesignerService.getCurrentPath().replace('root:' , '');
            path = `${rootPath}union${this.group.unionid}:${unionPath}::${field.id}`;
        }

        let condition = {
            id: guid,
            groupid: this.group.id,
            unionid: this.group.unionid,
            fieldid: guid,
            referencefieldid: '',
            path: path,
            displaypath: this.reportsDesignerService.getCurrentPath(),
            name: field.name,
            label: field.label,
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
        this.whereConditions = this.whereConditions ? [...this.whereConditions, condition] : [condition];
    }

    /**
    * @param id: string
     * @filter whereConditions from deleted
     * @set group.conditions
     */
    public deleteCondition(id) {
        this.group.conditions = this.group.conditions.filter(condition => condition.id != id);
        this.whereConditions = this.whereConditions.filter(condition => condition.id != id);
    }


    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    public trackByFn(index, item) {
        return item.id;
    }
}
