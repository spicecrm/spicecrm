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
    private _selectedObject: scrumobject;

    /**
     * emits whenever an object is loaded
     */
    public selectedObject$: EventEmitter<scrumobject> = new EventEmitter<scrumobject>();


    constructor(
        private backend: backend,
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
