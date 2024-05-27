/**
 * @module ModuleUsers
 */
import {Component, OnDestroy, ViewChild} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {broadcast} from '../../../services/broadcast.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {currency} from '../../../services/currency.service';
import {Subject, Subscription} from 'rxjs';
import {session} from '../../../services/session.service';
import {model} from '../../../services/model.service';
import {configurationService} from '../../../services/configuration.service';
import {metadata} from "../../../services/metadata.service";
import {
    AdministrationLoginRestrictionIpAddresses
} from '../../../admincomponents/components/administrationloginrestrictionipaddresses';
import {SystemPreferencesPanel} from '../../../systemcomponents/components/systempreferencespanel';
import {modal} from "../../../services/modal.service";

/** @ignore */
declare var _: any;

/**
 * render the user preferences
 */
@Component({
    selector: 'user-signature-modal',
    templateUrl: '../templates/usersignaturemodal.html'
})
export class UserSignatureModal{
    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     * the signature
     */
    public signature: string;

    constructor(
        public backend: backend,
        public session: session,
        public modal: modal
    ) {

        this.signature = this.session.authData.user.email_signature;

    }

    get canSave(){
        return this.signature != this.session.authData.user.email_signature;
    }

    public save(){
        let saveModal = this.modal.await('LBL_SAVING');
        this.backend.postRequest(`module/Users/${this.session.authData.userId}/signature`,{}, {signature: this.signature}).subscribe({
            next: () => {
                this.session.authData.user.email_signature = this.signature;
                this.close();
                saveModal.emit(true);
            }
        })
    }

    public close() {
        this.self.destroy();
    }

}
