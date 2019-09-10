/**
 * @module services
 */
import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class view {
    /**
     * the mode of the view
     */
    private mode: 'view' | 'edit' = 'view';

    /**
     * an event emitter that fires when the mode changes
     */
    public mode$: BehaviorSubject<string>;

    /**
     * defines if the view can be set to edit mode or not
     */
    public isEditable: boolean = false;

    /**
     * prevent displaing links in fields when this is set to true
     */
    public displayLinks: boolean = true;

    /**
     * prevents label from displaying when this is set to false
     */
    public displayLabels: boolean = true;

    /**
     * the edit field ID that is passed in when the edit mode is set
     *
     * the field can query that to gain focus
     */
    public editfieldid: string = '';

    // defines the labele .. can be value none, default, long or short
    public labels: 'default' | 'long' | 'short' = 'default';

    // set the size
    public size: 'regular' | 'small' = 'regular';

    constructor() {
        this.mode$ = new BehaviorSubject<string>(this.mode);
    }

    /**
     * allows qeurying the current mode
     */
    public getMode() {
        return this.mode;
    }

    /**
     * checks if the view is in edit mode
     */
    public isEditMode() {
        if (this.mode === 'edit') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * sets the edit mode
     *
     * @param fieldid passes over a field ID .. that alows the field to gain focus
     */
    public setEditMode(fieldid = '') {
        this.mode = 'edit';
        this.editfieldid = fieldid;
        this.mode$.next(this.mode);
    }

    /**
     * sets the view mode
     */
    public setViewMode() {
        this.mode = 'view';
        this.mode$.next(this.mode);
    }
}
