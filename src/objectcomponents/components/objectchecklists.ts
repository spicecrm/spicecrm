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
 * @module ObjectFields
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from "../../services/language.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Subscription} from "rxjs";
import {ChecklistI, ChecklistItemI} from "../interfaces/objectcomponents.interfaces";
import {animate, state, style, transition, trigger} from "@angular/animations";

/**
 * renders a checklist from a json object and enable managing checklist entries
 */
@Component({
    selector: 'object-checklists',
    templateUrl: './src/objectcomponents/templates/objectchecklists.html',
    animations: [
        trigger('tabAnimation', [
            state('true', style({height: '*', opacity: 1})),
            state('false', style({height: '0px', opacity: 0})),
            transition('true => false', [
                style({overflow: 'hidden'}), animate('.5s')
            ]),
            transition('false => true', [
                animate('.5s'), style({overflow: 'inherit'})
            ])
        ])
    ]
})
export class ObjectChecklists implements OnInit, OnDestroy {
    /**
     * if true show the add item button
     */
    public currentEditingChecklist: ChecklistI;
    /**
     * if true show the add checklist button
     */
    public isAddingChecklist: boolean = false;
    /**
     * if true display loading spinner
     */
    public isSaving: boolean = false;
    /**
     * holds the checklist array of objects
     */
    public checklists: ChecklistI[] = [];
    /**
     * holds the current editing item
     */
    public currentEditingItem: ChecklistItemI;
    /**
     * holds the current editing item
     */
    public activeChecklist: ChecklistI;
    /**
     * holds subscriptions for unsubscribe
     * @private
     */
    private subscriptions = new Subscription();
    /**
     * holds the field name of checklists for saving/loading the checklist data from model service
     * @private
     */
    private fieldName: string = 'checklists';

    public panelExpanded: boolean = true;

    constructor(public model: model,
                public language: language,
                public metadata: metadata) {
    }

    /**
     * call to set the field name from the metadata service
     * call to set the local value
     * subscribe to model changes
     */
    public ngOnInit() {
        this.setFieldName();
        this.loadData();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * add a checklist
     * @param name
     */
    public addChecklist(name: string) {
        if (!this.checklists) this.checklists = [];
        if (!name) return;
        const newChecklist: ChecklistI = {
            id: this.model.generateGuid(),
            name,
            showCompleted: true,
            items: []
        };
        this.checklists = [newChecklist, ...this.checklists];
        this.isAddingChecklist = false;
        this.setActiveChecklist(newChecklist);
        this.save(newChecklist);
    }

    /**
     * add a checklist item
     * @param checklist
     * @param addItemInput
     */
    public addChecklistItem(checklist, addItemInput: HTMLInputElement) {
        if (!addItemInput.value) return;
        const newItem: ChecklistItemI = {
            id: this.model.generateGuid(),
            isCompleted: false,
            text: addItemInput.value,
            isChanged: true
        };
        checklist.items.push(newItem);
        addItemInput.value = '';
        this.save(newItem);
    }

    /**
     * delete a checklist
     * @param checklist
     */
    public deleteChecklist(checklist: ChecklistI) {
        this.checklists = this.checklists.filter(item => item != checklist);
        this.save(checklist);
    }

    /**
     * delete a checklist item
     * @param item
     * @param checklist
     */
    public deleteChecklistItem(item: ChecklistItemI, checklist: ChecklistI) {
        checklist.items = checklist.items.filter(checklistItem => checklistItem != item);
        item.isChanged = true;
        this.save(item);
    }

    /**
     * set editing to display the save, cancel buttons
     * @param item
     */
    public setCurrentEditingItem(item: ChecklistItemI) {
        if (!item.isChanged) {
            item.textBackup = item.text;
        }
        this.currentEditingItem = item;
    }

    /**
     * reset the current editing item if the click was outside the item
     * @param event
     * @param itemContainer
     */
    public onItemBlur(event: FocusEvent, itemContainer: HTMLElement) {
        if (itemContainer.contains(event.relatedTarget as Node)) return;
        this.currentEditingItem = undefined;
    }

    /**
     * reset the current editing item if the click was outside the item
     * @param checklist
     * @param event
     * @param container
     * @param input
     */
    public onChecklistBlur(checklist: ChecklistI, event: FocusEvent, container: HTMLElement, input: HTMLInputElement) {
        if (container.contains(event.relatedTarget as Node) || (!container.contains(event.relatedTarget as Node) && !!input.value)) return;
        checklist.showAddButton = true;
    }

    /**
     * set show add checklist boolean
     * @param bool
     */
    public setShowAddChecklist(bool: boolean) {
        this.isAddingChecklist = bool;
    }

    /**
     * set show add item boolean
     * @param checklist
     */
    public setCurrentEditingChecklist(checklist: ChecklistI) {
        this.currentEditingChecklist = checklist;
    }

    /**
     * save the checklist changes
     */
    public save(item: ChecklistI | ChecklistItemI) {

        if (('isChanged' in item && item?.isChanged === false) || ('items' in item && !item.name)) {
            return;
        }

        this.isSaving = true;

        if ('items' in item) {
            this.setCurrentEditingChecklist(undefined);
        }
        const saveData = this.checklists.map((list: ChecklistI) => {
            const saveList = {...list};
            saveList.items = saveList.items.map((e: ChecklistItemI) => {
                const saveItem = {...e};
                if (item != e && saveItem.isChanged) {
                    saveItem.text = e.textBackup;
                }
                delete saveItem.isChanged;
                delete saveItem.textBackup;
                return saveItem;
            });
            return saveList;
        });

        if ('isChanged' in item) delete item.isChanged;
        if ('textBackup' in item) delete item.textBackup;

        this.model.backend.save(this.model.module, this.model.id, {[this.fieldName]: saveData})
            .subscribe(() => this.isSaving = false);

        this.currentEditingItem = undefined;
    }

    /**
     * reset current editing item
     * @param item
     * @param event
     */
    public cancelItemChanges(item: ChecklistItemI, event: MouseEvent) {
        event.stopPropagation();
        item.text = item.textBackup;
        item.isChanged = false;
        this.currentEditingItem = undefined;
    }

    /**
     * set active checklist
     * @param checklist
     */
    public setActiveChecklist(checklist: ChecklistI) {

        if (checklist == this.activeChecklist) {
            return;
        }

        if (!!this.activeChecklist) {
            this.activeChecklist.showAddButton = true;
        }

        if (!!checklist) {
            this.setShowAddButton(checklist, false);
        }

        this.activeChecklist = checklist;
    }

    /**
     * set show add button to false for checklist
     * @param checklist
     * @param bool
     */
    public setShowAddButton(checklist: ChecklistI, bool: boolean) {
        checklist.showAddButton = bool;
    }

    /**
     * set checklist item text value
     * @param value
     * @param item
     */
    public setItemTextValue(value: string, item: ChecklistItemI) {
        item.isChanged = value != item.text;
        item.text = value;
    }

    /**
     * set checklist item text value
     * @param value
     * @param checklist
     */
    public setChecklistName(value: string, checklist: ChecklistI) {
        checklist.name = value;
    }

    /**
     * toggle show completed items of a checklist
     * @param checklist
     */
    public toggleShowCompleted(checklist: ChecklistI) {
        checklist.showCompleted = !checklist.showCompleted;
        this.currentEditingItem = undefined;
        this.save(checklist);
    }

    /**
     * set the field name of checklists to load/save the data to/from model service
     * @private
     */
    private setFieldName() {
        let fieldName = this.metadata.getComponentConfig('ObjectChecklists', this.model.module)?.fieldName;
        if (!!fieldName) this.fieldName = fieldName;
    }

    /**
     * set the local value from the model data
     * @private
     */
    private loadData() {
        this.model.backend.get(this.model.module, this.model.id).subscribe(data => {
            if (!data?.[this.fieldName]) return;
            this.checklists = data[this.fieldName];
        });
    }

    /**
     * handle drag and drop event
     */
    private onDrop(event: CdkDragDrop<any>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.container.data.indexOf(event.item.data), event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousContainer.data.indexOf(event.item.data),
                event.currentIndex);
        }
        event.item.data.isChanged = true;
        this.save(event.item.data);
    }

    public toggleExpansion() {
        this.panelExpanded = !this.panelExpanded;
    }
}
