/**
 * @module ModuleScrum
 */
import {Injectable, EventEmitter} from '@angular/core';

interface scrumobject {
    id: string;
    type: ''|'ScrumThemes'|'ScrumEpics'|'ScrumUserStories';
}

@Injectable()
export class scrumtree {

    /**
     * the currently selected Object with type and ID
     */
    private _selectedObject: scrumobject;

    /**
     * emits whenever an object is loaded
     */
    public selectedObject$: EventEmitter<scrumobject> = new EventEmitter<scrumobject>();

    constructor() {
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
    set selectedObject(selectedObject: scrumobject){
        this._selectedObject = selectedObject;

        this.selectedObject$.emit(this._selectedObject);
    }


}
