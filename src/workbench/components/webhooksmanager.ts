/**
 * @module WorkbenchModule
 */
import {
    Component, ComponentRef, Injector
} from '@angular/core';
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modelutilities} from "../../services/modelutilities.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {HooksManager} from "./hooksmanager";
import {WebHookI} from "../interfaces/systemui.interfaces";
import {WebHooksManagerEditModal} from "./webhooksmanagereditmodal";
import {Subscription} from "rxjs";


@Component({
    selector: 'web-hooks-manager',
    templateUrl: '../templates/webhooksmanager.html',
})
export class WebHooksManager {

    public loading: boolean = false;
    public webHooks: WebHookI[] = [];
    public subscriptions: Subscription = new Subscription();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public modelutilities: modelutilities,
        public toast: toast,
        public modal: modal,
        public hooksManager: HooksManager,
        public injector: Injector
    ) {
    }

    public ngOnInit() {
        this.getWebHooks();
    }

    /**
     * get all web hooks from tables
     */
    public getWebHooks() {
        this.loading = true;
        this.backend.getRequest('configuration/spiceui/core/module/syswebhooks').subscribe(webhooks => {
            this.webHooks = webhooks;
            this.loading = false;
        });
    }

    /**
     * display hooks depending on the chosen module
     */
    get allWebHooks() {
        if (this.hooksManager._module == '*') {
            return this.webHooks;
        }
        return this.webHooks.filter(webHook => webHook.module == this.hooksManager._module);
    }

    /**
     * delete web hook
     * @param id
     */
    public deleteWebHook(id: string) {
        this.modal.confirm('MSG_DELETE_RECORD', 'MSG_DELETE_RECORD').subscribe({
            next: (res) => {
                if (res) {
                    const webHook = this.webHooks.find(h => h.id == id);

                    this.backend.deleteRequest(`configuration/configurator/syswebhooks/${webHook.id}`).subscribe(() => {
                        this.toast.sendToast('MSG_SUCCESSFULLY_DELETED', 'success')
                    });
                    this.webHooks = this.webHooks.filter(id => id.id != webHook.id);
                }
            }
        })
    }

    /**
     * edit web hook
     * @param id
     */
    public editWebHook(id: string) {
        const webHook = this.webHooks.find(h => h.id == id);
        this.openEditWebHookModal(webHook);

    }

    /**
     * open editing modal and replace hook at editing
     * @param hook
     * @private
     */
    private openEditWebHookModal(webHook?: WebHookI) {
        this.modal.openModal('WebHooksManagerEditModal', true, this.injector).subscribe((modalRef: ComponentRef<WebHooksManagerEditModal>) => {
            modalRef.instance.newWebHook.module = this.hooksManager.module;
            const index = this.webHooks.indexOf(webHook);
            if (webHook) {
                modalRef.instance.newWebHook = {...webHook};
            }
            modalRef.instance.save$.subscribe({
                next: (newWebHook: WebHookI) => {
                    if (webHook) {
                        this.webHooks.splice(index, 1, newWebHook);
                    } else {
                        this.webHooks.push(newWebHook);
                    }
                }
            })
        });
    }

    /**
     * add web hook
     */
    public addWebHook() {
        this.openEditWebHookModal();
    }

    /**
     * get color status for active status bulb
     * @param webHook
     */

    public getStatusColor(webHook: WebHookI) {
        if (webHook.active == 1) {
            return 'slds-icon-text-success';
        }
        if (webHook.active == 0) {
            return 'slds-icon-text-light';
        }
    }

    /**
     * change activity status and icon colour
     * @param $e
     * @param hook
     */
    public toggleValue($e: MouseEvent, webHook: WebHookI) {
        $e.stopPropagation();
        const message = webHook.active == 1 ? 'MSG_DEACTIVATE' : 'MSG_ACTIVATE';
        const toast = webHook.active == 1 ? 'LBL_DEACTIVATED' : 'LBL_ACTIVATED';

        this.modal.confirm(message, message).subscribe({
            next: (res) => {
                if (res) {
                    webHook.active = webHook.active == 1 ? 0 : 1;
                    const table = 'syswebhooks';

                    this.backend.postRequest(`configuration/configurator/${table}/${webHook.id}`, null, {config: webHook}).subscribe({
                        next: () => {
                            this.toast.sendToast(toast, 'success');
                        }
                    });
                }
            }
        })
    }

    /**
     * call webhook
     * @param webhook
     */
    public callWebHooks(webhook: WebHookI) {
        let loadingModal = this.modal.await('LBL_SENDING');
        this.backend.postRequest(`system/webhook`, null, webhook).subscribe((res: any) => {
            let headerText = res.result.success == true ? 'MSG_SUCCESSFULLY_EXECUTED' : 'LBL_ERROR';
            let text = 'Status Code: ' + res.result.output.toString();
            loadingModal.emit(true);
            this.modal.info(text, headerText);
        });
    }

    /**
     * search for entry in Module to send
     * @param webHook
     */
    public searchWithModal(webHook) {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = webHook.module;
            selectModal.instance.multiselect = false;

            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    webHook = {
                        webHook: webHook,
                        id: items[0].id,
                    }
                    // this.selectedItem = {
                    //     id: items[0].id,
                    //     module: items[0].module,
                    //     data: items[0]
                    // };
                    this.callWebHooks(webHook);
                }
            })
        });
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
