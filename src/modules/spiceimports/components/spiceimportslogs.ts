/**
 * @module ModuleSpiceImports
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';

import {spiceimportsservice} from '../services/spiceimports.service';

@Component({
    selector: 'spice-imports-logs',
    templateUrl: '../templates/spiceimportslogs.html',
})
export class Spiceimportslogs {
    @ViewChild('logscontainer', {read: ViewContainerRef, static: true}) logscontainer: ViewContainerRef;

    itemHeader: Array<any> = undefined;
    activeLogId: string = undefined;
    activelogname: string = undefined;
    opened: boolean = false;

    constructor(public language: language,
                public modal: modal,
                public backend: backend,
                public toast: toast,
                public spiceimportsservice: spiceimportsservice) {
        this.spiceimportsservice.activeimportdata$.subscribe(data => {
            if (data) {
                this.activeLogName = data.name;
                this.spiceimportsservice.getItemLogs();
                this.setItemHeader(data.id);
            }
            this.opened = false;

        });
    }

    get itemLogs() {
        return this.spiceimportsservice.activeItemLogs;
    }

    get activeLogName() {
        return this.activelogname;
    }

    set activeLogName(name) {
        this.activelogname = name;
    }

    getButtonicon(id) {
        return (this.opened && this.activeLogId == id) ? 'chevronup' : 'chevrondown';
    }

    setItemHeader(id) {
        this.spiceimportsservice.items.some(item => {
            let data = JSON.parse(item.data);
            if (item.id == id)
                this.itemHeader = data.fileHeader;
            return true;
        });
    }

    mainStyle() {
        let rect = this.logscontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + (rect.top) + 'px)',
            'overflow': 'auto'
        }
    }

    toggleOpen(id) {
        if (this.opened && id != this.activeLogId) {
            this.activeLogId = id;
            return;
        }

        this.opened = !this.opened;
        this.activeLogId = id;
    }

    delete() {
        this.modal.confirm(
            this.language.getLabel('MSG_DELETE_RECORD', '', 'long'),
            this.language.getLabel('MSG_DELETE_RECORD'))
            .subscribe((answer) => {
                if (answer) {
                    this.backend.deleteRequest(`module/SpiceImports/${this.spiceimportsservice.activeImportData.id}`)
                        .subscribe(res => {
                            if (res) {
                                this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_DELETED'), 'success');
                                this.spiceimportsservice.deleteImport();
                                this.resetData();
                            } else
                                this.toast.sendToast(this.language.getLabel('ERR_CANT_DELETE'), 'error');
                        });
                }
            });
    }

    resetData() {
        this.spiceimportsservice.activeImportData = undefined;
        this.spiceimportsservice.activeItemLogs = undefined;
        this.activeLogName = undefined;
    }

}
