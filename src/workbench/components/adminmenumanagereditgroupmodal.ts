/**
 * @module WorkbenchModule
 */
import {Component, ComponentRef} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {modelutilities} from "../../services/modelutilities.service";
import {AdminGroupI} from "../interfaces/systemui.interfaces";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {Subject} from "rxjs";
import {modal} from "../../services/modal.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'admin-menu-manager-edit-group-modal',
    templateUrl: '../templates/adminmenumanagereditgroupmodal.html',
})
export class AdminMenuManagerEditGroupModal {

    public self: ComponentRef<AdminMenuManagerEditGroupModal>;

    public newGroup: AdminGroupI = {
        id: '',
        name: '',
        label: '',
        version: '',
        package: '',
        scope: 'custom',
        scope_icon: '',
    };
    public save$ = new Subject<AdminGroupI>();
    public radioOptions = [
        {label: 'custom', value: 'custom'},
        {label: 'global', value: 'global'},
    ];
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
        if(!this.newGroup.name || !this.newGroup.label) {
            return false;
        }
        return true;
    }

    public saveGroup() {
        if (!this.newGroup.id) {
            this.newGroup.id = this.modelutilities.generateGuid();
        }

        const table = this.newGroup.scope == 'custom' ? 'sysuicustomadmingroups' : 'sysuiadmingroups';
        const data: any = {...this.newGroup};
        delete data.scope;
        delete data.scope_icon;

        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.postRequest(`configuration/configurator/${table}/${this.newGroup.id}`, null, {config: data}).subscribe({
            next: () => {
                this.newGroup.scope_icon = this.newGroup.scope == 'custom' ? 'people' : 'world';
                this.save$.next(this.newGroup);
                this.save$.complete();
                loadingModal.emit(true);
                this.toast.sendToast('LBL_DATA_SAVED', 'success');
            }
        });
        this.self.destroy();
    }
}