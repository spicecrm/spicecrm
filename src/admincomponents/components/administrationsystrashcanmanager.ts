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
 * @module AdminComponentsModule
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {userpreferences} from '../../services/userpreferences.service';
import {footer} from '../../services/footer.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'administration-systrashcan-manager',
    templateUrl: './src/admincomponents/templates/administrationsystrashcanmanager.html'
})
export class AdministrationSysTrashcanManager implements OnInit {

    private records: any[] = [];
    private loaddate: any = {};
    private loading: boolean = true;

    constructor(private metadata: metadata, private modal: modal, private backend: backend, private language: language, private userpreferences: userpreferences, private footer: footer) {
    }

    public ngOnInit() {
        this.getEntries();
    }

    private getEntries() {
        this.backend.getRequest('systrashcan').subscribe(records => {
            this.records = records;
            this.loaddate = new moment();
            this.loading = false;
        });
    }

    private reload() {
        this.loading = true;
        this.records = [];
        this.getEntries();
    }

    private getUserDate(date) {
        return this.userpreferences.formatDateTime(date);
    }

    private recoverRecord(record) {
        this.modal.openModal('AdministrationSysTrashcanRecover').subscribe(componentRef =>{
            componentRef.instance.record = record;
            // subscribe to recovered event and if it is treu remove from the list
            componentRef.instance.recovered.subscribe(recovered => {
                if (recovered) {
                    this.records.some((thisRecord, thisIndex) => {
                        if (thisRecord.id == record.id) {
                            this.records.splice(thisIndex, 1);
                            return true;
                        }
                    });
                }
            });
        });
    }

    private getModule(singular) {
        return this.metadata.getModuleFromSingular(singular)
    }

    get loadDate() {
        if (this.loaddate) {
            return this.getUserDate(this.loaddate);
        } else {
            return '---';
        }
    }
}
