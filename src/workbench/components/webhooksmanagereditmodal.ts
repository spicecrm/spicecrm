/**
 * @module WorkbenchModule
 */
import {

    Component, ComponentRef
} from '@angular/core';
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modelutilities} from "../../services/modelutilities.service";
import {WebHookI} from "../interfaces/systemui.interfaces";
import {toast} from "../../services/toast.service";
import {Subject} from "rxjs";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'web-hooks-manager-edit-modal',
    templateUrl: '../templates/webhooksmanagereditmodal.html',

})
export class WebHooksManagerEditModal {

    public self: ComponentRef<WebHooksManagerEditModal>;

    public hooks: WebHookI[] = [];
    public events: string[] = ['create', 'update', 'delete'];
    public data: any;


    /**
     * conditions for login details
     */
    public urlCondition: boolean = true;

    /**
     * Regex for password
     */
    public urlRegexp: RegExp = new RegExp("(https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*))");



    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public modelutilities: modelutilities,
        public toast: toast,
        public modal: modal,
    ) {

    }

    public newWebHook: WebHookI = {
        id: '',
        module: '',
        event: 'create',
        url: '',
        active: 1,
        send_data: false,
        modulefilter_id: '',
        fieldset_id: '',
        ssl_verifypeer: true,
        ssl_verifyhost: true,
        custom_headers : '',
    };
    public save$ = new Subject<WebHookI>();

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
    public canSave(){
        this.urlCondition = this.newWebHook.url.length > 0 && this.urlRegexp.test(this.newWebHook.url);
        if(!this.newWebHook.module || !this.newWebHook.event || !this.newWebHook.url || !this.urlCondition){
            return false;
        }
        return true;
    }
    /**
     * save web hook
     */
    public saveHook() {
            if (!this.newWebHook.id) {
                this.newWebHook.id = this.modelutilities.generateGuid();
            }

            const table = 'syswebhooks';
            let loadingModal = this.modal.await('LBL_LOADING');
            this.backend.postRequest(`configuration/configurator/${table}/${this.newWebHook.id}`, null, {config: this.newWebHook}).subscribe({
                next: () => {
                    this.save$.next(this.newWebHook);
                    this.save$.complete();
                    loadingModal.emit(true);
                    this.toast.sendToast('LBL_DATA_SAVED', 'success');
                }
            });
            this.self.destroy();
        }
    public callWebHooks(){
        this.backend.postRequest(`system/webhook`, null, this.newWebHook).subscribe((res: any) => {
            this.data = res.output;
            // loadingModal.emit(true);
            this.toast.sendToast('LBL_DATA_SAVED', 'success');
        });
    }
}
