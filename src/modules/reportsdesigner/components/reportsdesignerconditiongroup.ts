/*
SpiceUI 2018.10.001

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
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ReportsDesignerService} from "../services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-condition-group',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerconditiongroup.html',
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
    @Input() private group: any;
    /**
    * @input canDelete: boolean
     */
    @Input() private canDelete: boolean = false;
    /**
    * @output groupDeleted: EventEmitter<string> = groupId
     */
    @Output() private treeChange: EventEmitter<any> = new EventEmitter<any>();
    private expanded: number;

    constructor(private language: language,
                private reportsDesignerService: ReportsDesignerService,
                private model: model) {
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
    private onDrop(dragEvent: CdkDragDrop<any>) {
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
    private addGroup() {
        this.treeChange.emit({action: 'addGroup', id: this.group.id});
    }

    /**
    * @emit object = {action: string, id: string} by treeChange
     */
    private deleteGroup() {
        this.treeChange.emit({action: 'deleteGroup', id: this.group.id});
    }

    /**
    * @emit obj: object by treeChange
     */
    private handleTreeChange(obj) {
        this.treeChange.emit(obj);
    }

    /**
    * @set expanded = conditionId | null
     */
    private toggleExpand(conditionId) {
        if (!this.reportsDesignerService.expertMode) return;
        this.expanded = conditionId == this.expanded ? null : conditionId;
    }

    /**
    * @define condition
     * @param field: object
     * @push condition to group.conditions
     * @set whereConditions
     */
    private addCondition(field) {
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
    private deleteCondition(id) {
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
    private trackByFn(index, item) {
        return item.id;
    }
}
