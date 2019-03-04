/**
 * @module services
 */
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class view {
    private mode: string = 'view';
    public mode$ = new EventEmitter();
    public isEditable: boolean = false;
    public displayLinks: boolean = true;
    public editfieldid: string = '';

    // defines the labele .. can be value none, default, long or short
    public labels: 'default' | 'long' | 'short' = 'default';

    // set the size
    public size: 'regular' | 'small' = 'regular';

    public isEditMode() {
        if (this.mode === 'edit') {
            return true;
        } else {
            return false;
        }
    }

    public setEditMode(fieldid = '') {
        this.mode = 'edit';
        this.editfieldid = fieldid;
        this.mode$.emit(this.mode);
    }

    public setViewMode() {
        this.mode = 'view';
        this.mode$.emit(this.mode);
    }
}
