/**
 * @module services
 */
import {EventEmitter, Injectable, OnInit, Optional} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {model} from "./model.service";

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

    /**
     * defines the default label length for the view
     */
    public labels: 'default' | 'long' | 'short' = 'default';

    /**
     * the size for the responsive design
     */
    public size: 'regular' | 'small' = 'regular';

    /**
     * set to true to link the view to the model. If set the view will link itself to the model edit mode.
     */
    public linkedToModel: boolean = false;

    constructor(@Optional() private model: model) {
        this.mode$ = new BehaviorSubject<string>(this.mode);

        if (this.model) {
            this.model.mode$.subscribe(mode => {
                if (this.linkedToModel && mode == 'display') {
                    this.setViewMode();
                }
            });
        }
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
