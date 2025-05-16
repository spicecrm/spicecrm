/**
 * @module WorkbenchModule
 */
import {Component, ComponentRef} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {modelutilities} from "../../services/modelutilities.service";
import {AdminComponentI} from "../interfaces/systemui.interfaces";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {Subject} from "rxjs";
import {modal} from "../../services/modal.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'admin-menu-manager-edit-component-modal',
    templateUrl: '../templates/adminmenumanagereditcomponentmodal.html',
})
export class AdminMenuManagerEditComponentModal {

    public self: ComponentRef<AdminMenuManagerEditComponentModal>;

    public newComponent: AdminComponentI = {
        id: '',
        adminaction: '',
        admin_label: '',
        component: '',
        componentconfig: '',
        icon: '',
        version: '',
        package: '',
        scope: 'custom',
        scope_icon: '',
    }
    public save$ = new Subject<AdminComponentI>();
    public editMode: 'all' | 'custom' | 'none';

    constructor(public metadata: metadata,
                public modelutilities: modelutilities,
                public backend: backend,
                public toast: toast,
                public configurationService: configurationService,
                public modal: modal) {
        this.editMode = this.configurationService.getCapabilityConfig('core').edit_mode;
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    public canSave() {
        if(!this.newComponent.admingroup || !this.newComponent.adminaction) {
            return false;
        }
        return true;
    }

    public saveComponent() {
        if (!this.newComponent.id) {
            this.newComponent.id = this.modelutilities.generateGuid();
        }

        const table = this.newComponent.scope == 'custom' ? 'sysuicustomadmincomponents' : 'sysuiadmincomponents';
        const data: any = {...this.newComponent};
        delete data.scope;
        delete data.scope_icon;

        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.postRequest(`configuration/configurator/${table}/${this.newComponent.id}`, null, {config: data}).subscribe({
            next: () => {
                this.newComponent.scope_icon = this.newComponent.scope == 'custom' ? 'people' : 'world';
                this.save$.next(this.newComponent);
                this.save$.complete();
                loadingModal.emit(true);
                this.toast.sendToast('LBL_DATA_SAVE', 'success');
            }
        });
        this.self.destroy();
    }
}