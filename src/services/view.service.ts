import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class view {
    mode: string = 'view';
    mode$ = new EventEmitter();
    isEditable: boolean = false;
    displayLinks: boolean = true;

    // defines the labele .. can be value none, default, long or short
    labels: string = 'default';

    constructor() {
    }

    isEditMode(){
        if(this.mode === 'edit')
            return true;
        else
            return false;
    }

    setEditMode(){
        this.mode = 'edit';
        this.mode$.emit(this.mode);
    }

    setViewMode(){
        this.mode = 'view';
        this.mode$.emit(this.mode);
    }
}
