/**
 * @module ModuleScrum
 */
import {Injectable, EventEmitter} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {backend} from "../../../services/backend.service";

interface scrumobject {
    id: string;
    type: ''|'ScrumThemes'|'ScrumEpics'|'ScrumUserStories';
}

@Injectable()
export class scrum {

    /**
     * the currently selected Object with type and ID
     */
    public _selectedObject: scrumobject;

    /**
     * emits whenever an object is loaded
     */
    public selectedObject$: EventEmitter<scrumobject> = new EventEmitter<scrumobject>();


    constructor(
        public backend: backend,
    ) {
        this._selectedObject = {id: undefined, type: ''};

    }

    /**
     * getter for the object
     */
    get selectedObject() {
        return this._selectedObject;
    }

    /**
     * sets the current object and also emits the change
     *
     * @param selectedObject
     */
    set selectedObject(selectedObject: scrumobject) {
        this._selectedObject = selectedObject;
        this.selectedObject$.emit(this._selectedObject);
    }

    /**
     * handle drop and reassign the array sequence
     * @param event: CdkDragDrop
     * @param module: string
     * @param relatedModel
     */
    public onDrop(event: CdkDragDrop<any>, module: string, relatedModel) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        const sequencedItems = event.container.data.map((item, index) => ({id: item.id, sequence: index}));
        this.backend.postRequest('module/' + module, {}, sequencedItems).subscribe(res => {
            if (!res || !res.length) return;
            relatedModel.items = relatedModel.items.map((item, index) => {
                item.sequence = index;
                return item;
            });
        });
    }

}
