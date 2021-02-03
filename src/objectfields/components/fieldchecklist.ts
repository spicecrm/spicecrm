/**
 * @module ObjectFields
 */
import {Component, OnInit, Injector} from '@angular/core';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {language} from "../../services/language.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

/**
 * renders a checklist
 */
@Component({
    selector: 'field-gdpr',
    templateUrl: './src/objectfields/templates/fieldchecklist.html'
})
export class fieldChecklist extends fieldGeneric implements OnInit {

    public showAddItem: boolean = false;
    public showAddChecklist: boolean = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private modal: modal, private injector: Injector) {
        super(model, view, language, metadata, router);
        this.subscribeToModelChanges();
    }

    private subscribeToModelChanges() {
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                this.initializeValue(data);
            })
        );

    }

    private initializeValue(data) {
        if (!!data[this.fieldname] && Array.isArray(data[this.fieldname])) return;
        this.value = [];
    }

    public addChecklist(name: string) {
        if (!this.value) this.value = [];
        if (!name) return;
        const newItem = {
            name,
            showCompleted: true,
            items: []
        };
        this.value = [...this.value, newItem];
        this.showAddChecklist = false;
    }

    public addChecklistItem(inputItemContainer: HTMLInputElement, checklist) {
        if (!inputItemContainer.value) return;
        checklist.items.push({
            isCompleted: false,
            text: inputItemContainer.value
        });
        inputItemContainer.value = '';
    }

    public deleteChecklist(checklist) {
        this.value = this.value.filter(item => item != checklist);
    }

    public deleteChecklistItem(item, checklist) {
        checklist.items = checklist.items.filter(checklistItem => checklistItem != item);
    }

    /**
     * handle drag and drop event
     */

    private onDrop(event: CdkDragDrop<any>) {

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }
}
