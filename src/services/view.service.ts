/**
 * @module services
 */
import {EventEmitter, Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {model} from './model.service';

@Injectable()
export class view {
    private mode: string = 'view';
    public mode$ = new EventEmitter();
    public isEditable: boolean = false;
    public displayLinks: boolean = true;
    public displayLabels: boolean = true;
    public editfieldid: string = '';

    public form: FormGroup;

    // defines the labele .. can be value none, default, long or short
    public labels: 'default' | 'long' | 'short' = 'default';

    // set the size
    public size: 'regular' | 'small' = 'regular';

    constructor(private model: model) {
        this.form = new FormGroup({});

        this.model.data$.subscribe(data => {
            this.form.patchValue(data, {emitEvent: false});
        });

        // register the change event
        this.form.valueChanges.subscribe(changes => {
            this.model.setFields(changes);
        });
    }

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
