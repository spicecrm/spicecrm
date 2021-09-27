/**
 * @module WorkbenchModule
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
    selector: '[login-restriction-ip-addresses-row]',
    templateUrl: './src/admincomponents/templates/loginrestrictionipaddressesrow.html'
})
export class LoginRestrictionIpAddressesRow {

    @Input() private ipAddress: any;
    @Output() private editing = new EventEmitter<boolean>();
    @Input() private otherEditing: boolean;

    private isEditing = false;
    private backup: string;

    constructor(private backend: backend, private toast: toast, private language: language ) { }

    private editDescription() {
        this.backup = this.ipAddress.description;
        this.isEditing = true;
        this.editing.emit(true);
    }

    private save() {
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

    private cancel() {
        this.isEditing = false;
        this.editing.emit(false);
        this.ipAddress.description = this.backup;
    }

}
