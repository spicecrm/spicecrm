/**
 * @module ModuleActivities
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {model} from '../../../services/model.service';
import {session} from '../../../services/session.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {view} from '../../../services/view.service';

/**
 * renders a panel with the participating users and contacts in the activity
 */
@Component({
    selector: 'activity-participation-status',
    templateUrl: '../templates/activityparticipationstatus.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ActivityParticipationStatus),
            multi: true
        }
    ]
})
export class ActivityParticipationStatus implements ControlValueAccessor {

    /**
     * the parent record - Meeting or Call
     */
    @Input() public parent: model;

    /**
     * the parent record - Contact or User
     */
    @Input() public model: model;

    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;

    /**
     * for the value accessor
     */
    public onTouched: () => void;

    /**
     * the acceptance status
     */
    public status: 'none' | 'accept' | 'decline' | 'tentative' = 'none';

    /**
     * set when updating the backend
     */
    public updating: boolean = false;

    constructor(public view: view, public session: session, public cdRef: ChangeDetectorRef, public backend: backend, public toast: toast) {
    }

    /**
     * chekcs if the buttons shoudl be enabled
     * they are only enabled or the current user and if the status of the parent is 'Planned'
     */
    get disabled() {
        // check if it is the curent user and the status still allows changing the attendance
        if (!this.view.isEditMode() && !this.updating && this.model.module == 'Users' && this.model.id == this.session.authData.userId && this.parent && this.parent.getField('status') == 'Planned') {
            return false;
        }

        // in all other cases disable
        return true;
    }

    /**
     * accepts the activity
     */
    public accept() {
        this.setStatus('accept');
    }

    /**
     * declines the activity
     */
    public decline() {
        this.setStatus('decline');
    }

    /**
     * marks the acceptnace as tentative
     */
    public tentative() {
        this.setStatus('tentative');
    }

    public setStatus(status) {
        this.updating = true;
        this.backend.postRequest(`module/${this.parent.module}/${this.parent.id}/status/${this.model.id}/${status}`).subscribe(res => {
            this.status = status;
            this.onChange(this.status);
            this.updating = false;
        }, error => {
            this.toast.sendToast('Error Updating', 'error');
            this.updating = false;
        });
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {
        // this._time = value ? value : '';
        if (value) {
            this.status = value;
        } else {
            this.status = 'none';
        }

        this.cdRef.detectChanges();
    }
}
