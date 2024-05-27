/**
 * @module WorkbenchModule
 */
import {
    Component, ComponentRef, Injector,
} from '@angular/core';
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modelutilities} from "../../services/modelutilities.service";
import {LogicHookI} from "../interfaces/systemui.interfaces";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {HooksManagerHooksEditModal} from "./hooksmanagerhookseditmodal";
import {HooksManager} from "./hooksmanager";

@Component({
    selector: 'hooks-manager-hooks',
    templateUrl: '../templates/hooksmanagerhooks.html',
})
export class HooksManagerHooks {


    public loading: boolean = false;
    public hooks: LogicHookI[] = [];


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
        this.getLogicHooks();
    }

    /**
     * get all logic hooks from tables
     */
    public getLogicHooks() {
        this.loading = true;
        this.backend.getRequest('configuration/spiceui/core/module/hooks').subscribe(hooks => {
            this.hooks = hooks;
            this.loading = false;
        });
    }

    /**
     * display hooks depending on the chosen module
     */
    get allModuleHooks() {
        if (this.hooksManager._module == '*') {
            return this.hooks;
        }
        return this.hooks.filter(hook =>hook.module == this.hooksManager.module );
    }

    /**
     * delete logic hook
     * @param id
     */
    public deleteHook(id: string) {
        this.modal.confirm('MSG_DELETE_RECORD', 'MSG_DELETE_RECORD').subscribe({
            next: (res) => {
                if (res) {
                    const hook = this.hooks.find(h => h.id == id);

                    const table = hook.type == 'global' ? 'syshooks' : 'syscustomhooks';
                    this.backend.deleteRequest(`configuration/configurator/${table}/${hook.id}`).subscribe(() => {
                        this.toast.sendToast('MSG_SUCCESSFULLY_DELETED', 'success')
                    });
                    this.hooks = this.hooks.filter(id => id.id != hook.id);
                }
            }
        })
    }

    /**
     * edit hook
     * @param id
     */
    public editHook(id: string){
        const hook = this.hooks.find(h => h.id == id);
        this.openEditHookModal(hook);

    }

    /**
     * open editing modal and replace hook at editing
     * @param hook
     * @private
     */
    private openEditHookModal(hook?:LogicHookI){
        this.modal.openModal('HooksManagerHooksEditModal', true, this.injector).subscribe((modalRef: ComponentRef<HooksManagerHooksEditModal>) => {
            modalRef.instance.newLogicHook.module = this.hooksManager.module;
            const index = this.hooks.indexOf(hook);
            if (hook) {
                modalRef.instance.newLogicHook = {...hook};
            }
            modalRef.instance.save$.subscribe({
                next: (newHook: LogicHookI) => {
                   if(hook){
                    this.hooks.splice(index,1,newHook);
                }
                   else {
                       this.hooks.push(newHook);
                   }
                }
            })
        });
    }

    /**
     * add logic hook
     */
    public addLogicHook(){
      this.openEditHookModal();
    }

    /**
     * get colour of the light bulb depending on activity status
     * @param hook
     */
    public getStatusColor(hook: LogicHookI) {
        if (hook.hook_active == 1) {
            return 'slds-icon-text-success';
        }
        if (hook.hook_active == 0) {
            return 'slds-icon-text-light';
        }
    }

    /**
     * change activity status and icon colour
     * @param $e
     * @param hook
     */
    public toggleValue($e: MouseEvent, hook: LogicHookI) {
        $e.stopPropagation();
        const message = hook.hook_active == 1 ? 'MSG_DEACTIVATE' : 'MSG_ACTIVATE';
        const toast = hook.hook_active == 1 ? 'LBL_DEACTIVATED' : 'LBL_ACTIVATED';

        this.modal.confirm(message, message).subscribe({
            next: (res) => {
                if (res) {
                    hook.hook_active = hook.hook_active == 1 ? 0 : 1;
                    const table = hook.type == 'global' ? 'syshooks' : 'syscustomhooks';

                    const data = {...hook};
                    delete data.type;

                    this.backend.postRequest(`configuration/configurator/${table}/${hook.id}`, null, {config: data}).subscribe({
                        next: () => {
                            this.toast.sendToast(toast, 'success');
                        }
                    });
                }
            }
        })
    }

}
