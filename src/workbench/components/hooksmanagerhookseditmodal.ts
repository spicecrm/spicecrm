/**
 * @module WorkbenchModule
 */
import {
    Component, ComponentRef, OnInit
} from '@angular/core';
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modelutilities} from "../../services/modelutilities.service";
import {LogicHookI} from "../interfaces/systemui.interfaces";
import {toast} from "../../services/toast.service";
import {Subject} from "rxjs";
import {modal} from "../../services/modal.service";


@Component({
    selector: 'hooks-manager-hooks-edit-modal',
    templateUrl: '../templates/hooksmanagerhookseditmodal.html',

})
export class HooksManagerHooksEditModal implements OnInit {

    public self: ComponentRef<HooksManagerHooksEditModal>;

    public hooks: LogicHookI[] = [];
    public events: string[] = ['before_relationship_add', 'after_relationship_add', 'before_relationship_delete', 'after_relationship_delete', 'before_save', 'after_save', 'before_retrieve', 'after_retrieve', 'before_delete', 'after_delete', 'before_restore', 'after_restore', 'after_save_completed', 'before_logout'];

    public classMethod: string = '';


    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public modelutilities: modelutilities,
        public toast: toast,
        public modal:modal,
    ) {

    }

    ngOnInit() {
        if (!!this.newLogicHook.hook_class && !!this.newLogicHook.hook_method) {
            this.classMethod = `${this.newLogicHook.hook_class}->${this.newLogicHook.hook_method}`;
        }
    }

    public newLogicHook: LogicHookI = {
        id: '',
        module: '',
        type: 'custom',
        event: 'before_relationship_add',
        hook_include: '',
        hook_index: 0,
        hook_class: '',
        hook_method: '',
        hook_active: 1,
        description: '',
        version: '',
        package: '',
    };
    public save$ = new Subject<LogicHookI>();
    public radioOptions = [
        {label: "custom", value: 'custom'},
        {label: 'global', value: 'global'},
    ];

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    public canSave() {
        if (!this.newLogicHook.module || !this.newLogicHook.event || !this.newLogicHook.package || !this.newLogicHook.version || !this.classMethod) {
            return false;
        }
        return true;
    }

    /**
     * save hook
     * split the class and method for separate saving
     * delete type before sending
     */
    public saveHook() {

        if (!this.newLogicHook.id) {
            this.newLogicHook.id = this.modelutilities.generateGuid();
        }
        if (!this.newLogicHook.type) {
            this.newLogicHook.type = 'custom';
        }
        const table = this.newLogicHook.type == 'custom' ? 'syscustomhooks' : 'syshooks';

        [this.newLogicHook.hook_class, this.newLogicHook.hook_method] = this.classMethod.split('->');
        if (!this.newLogicHook.hook_method) {
            this.toast.sendToast('LBL_METHOD_EMPTY', 'warning');
        } else {
            const data = {...this.newLogicHook};
            delete data.type;
            let loadingModal = this.modal.await('LBL_LOADING');
            this.backend.postRequest(`configuration/configurator/${table}/${this.newLogicHook.id}`, null, {config: data}).subscribe({
                next: () => {
                    this.save$.next(this.newLogicHook);
                    this.save$.complete();
                    loadingModal.emit(true);
                    this.toast.sendToast('LBL_DATA_SAVED', 'success');
                }
            });
            this.self.destroy();
        }
    }
}