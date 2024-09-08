import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";


@Component({
    selector: 'spice-kanban-manager-migrate-modal',
    templateUrl: '../templates/spicekanbanmanagermigratemodal.html'
})

export class SpiceKanbanManagerMigrateModal {

    public self :any;

    public migrateKanbans :any[] = [];

    public migrated: EventEmitter<any> = new EventEmitter<boolean>();

    constructor(
        public modal: modal,
        public metadata: metadata,
        public backend: backend,
        public language: language,
        public toast: toast
    ) {}

    public close() {
        this.self.destroy();
    }

    public migrate() {
        this.backend.postRequest('/common/spicebeanguide/kanbanMigration').subscribe({
            next: () => {
                this.toast.sendToast('LBL_KANBANS_MIGRATED', 'success');
                this.close();
                this.migrated.emit(true)
            },
            error: () => {
                this.toast.sendToast('LBL_KANBANS_MIGRATION_ERROR', 'error');
                this.close();
                this.migrated.emit(false)
            }
        })
    }
}
