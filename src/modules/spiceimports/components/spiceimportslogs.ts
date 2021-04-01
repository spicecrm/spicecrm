/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/spiceimports/templates/spiceimportslogs.html',
})
export class Spiceimportslogs {
    @ViewChild('logscontainer', {read: ViewContainerRef, static: true}) logscontainer: ViewContainerRef;

    itemHeader: Array<any> = undefined;
    activeLogId: string = undefined;
    activelogname: string = undefined;
    opened: boolean = false;

    constructor(private language: language,
                private modal: modal,
                private backend: backend,
                private toast: toast,
                private spiceimportsservice: spiceimportsservice) {
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