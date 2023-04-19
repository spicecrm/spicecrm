/**
 * @module WorkbenchModule
 */
import {
    Component, ComponentRef, EventEmitter, OnDestroy, OnInit, Output, SkipSelf,
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
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {Subscription} from "rxjs";


@Component({
    selector: 'web-hooks-manager',
    templateUrl: '../templates/webhooksmanager.html',
    providers:[model, relatedmodels],
})
export class WebHooksManager implements OnInit, OnDestroy{


    public loading: boolean = false;
    public webHooks: WebHookI[] = [];
    public subscriptions: Subscription = new Subscription();
    @Output() public webhook: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public modelutilities: modelutilities,
        public toast: toast,
        public modal: modal,
        public hooksManager: HooksManager,
        public model: model,
        public relatedmodels: relatedmodels

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
        this.backend.getRequest('configuration/spiceui/core/module/webhooks').subscribe(webhooks => {
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
        return this.webHooks.filter(webHook =>webHook.module == this.hooksManager._module );
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

                    this.backend.deleteRequest(`configuration/configurator/webhooks/${webHook.id}`).subscribe(() => {
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
    public editWebHook(id: string){
        const webHook = this.webHooks.find(h => h.id == id);
        this.openEditWebHookModal(webHook);

    }

    /**
     * open editing modal and replace hook at editing
     * @param hook
     * @private
     */
    private openEditWebHookModal(webHook?:WebHookI){
        this.modal.openModal('WebHooksManagerEditModal').subscribe((modalRef: ComponentRef<WebHooksManagerEditModal>) => {
            const index = this.webHooks.indexOf(webHook);
            if (webHook) {
                modalRef.instance.newWebHook = {...webHook};
            }
            modalRef.instance.save$.subscribe({
                next: (newWebHook: WebHookI) => {
                    if(webHook) {
                        this.webHooks.splice(index, 1, newWebHook);
                    }
                    else {
                        this.webHooks.push(newWebHook);
                    }
                }
            })
        });
    }

    /**
     * add web hook
     */
    public addWebHook(){
        this.openEditWebHookModal();
    }


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
        const message = webHook.active == 1 ? 'LBL_DEACTIVATE' : 'LBL_ACTIVATE'

        this.modal.confirm(message, message).subscribe({
            next: (res) => {
                if (res) {
                    webHook.active = webHook.active == 1 ? 0 : 1;
                    const table = 'syswebhooks';

                    this.backend.postRequest(`configuration/configurator/${table}/${webHook.id}`, null, {config: webHook}).subscribe({
                        next: () => {
                            this.toast.sendToast('LBL_STATUS_CHANGED', 'success');
                        }
                    });
                }
            }
        })
    }

    public openResultModal(webhook:any){
        this.webhook.emit(webhook);
        this.modal.openModal('WebHooksManagerResultModal').subscribe();
    }
    public callWebHooks(webHook: WebHookI){

        // this.backend.postRequest(`system/webhook`, null, webHook).subscribe((res: any) => {
        //     // this.data = res.result;
        //     // loadingModal.emit(true);
        // });
    }

    public searchWithModal(webHook:WebHookI) {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = webHook.module;
            selectModal.instance.multiselect = true;

            selectModal.instance.selectedItems.subscribe(items => {
                this.addSelectedItems(items);
            });
        });
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @call relatedmodels.addItems
    * @pass event: any[]
    */
    public addSelectedItems(event) {
        this.relatedmodels.addItems(event);
    }

}
