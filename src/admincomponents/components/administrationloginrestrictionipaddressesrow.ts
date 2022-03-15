/**
 * @module AdminComponentsModule
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';
import { take } from 'rxjs/operators';
import { language } from '../../services/language.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: '[administration-login-restriction-ip-addresses-row]',
    templateUrl: '../templates/administrationloginrestrictionipaddressesrow.html'
})
export class AdministrationLoginRestrictionIpAddressesRow {

    @Input() public ipAddress: any;
    @Output() public editing = new EventEmitter<boolean>();
    @Input() public otherEditing: boolean;

    public isEditing = false;
    public backup: string;

    constructor(public backend: backend, public toast: toast, public language: language ) { }

    public editDescription() {
        this.backup = this.ipAddress.description;
        this.isEditing = true;
        this.editing.emit(true);
    }

    public save() {
        this.isEditing = false;
        this.backend.putRequest('authentication/ipAddress/'+this.ipAddress.address, null, { description: this.ipAddress.description })
            .pipe(take(1))
            .subscribe( response => {
                this.isEditing = false;
                this.editing.emit(false);
            },
        error => {
                this.ipAddress.description = this.backup;
                this.isEditing = false;
                this.editing.emit(false);
                this.toast.sendToast('Error saving Description of IP Address.','error');
            });
    }

    public cancel() {
        this.isEditing = false;
        this.editing.emit(false);
        this.ipAddress.description = this.backup;
    }

}
