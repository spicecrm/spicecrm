/*
SpiceUI 2021.01.001

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
    ViewContainerRef,
    OnInit,
    EventEmitter
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {userpreferences} from '../../services/userpreferences.service';
import {toast} from '../../services/toast.service';


/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: './src/admincomponents/templates/administrationsystrashcanrecover.html'
})
export class AdministrationSysTrashcanRecover implements OnInit {

    @Input() record: any = {};
    self: any = {};
    relatedRecords: Array<any> = [];
    loading: boolean = true;
    recoverrelated: boolean = false;
    recovering: boolean = false;
    recovered: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private metadata: metadata, private backend: backend, private language: language, private toast: toast) {
    }

    public ngOnInit() {
        this.backend.getRequest('systrashcan/related/' + this.record.transactionid + '/' + this.record.recordid).subscribe(related => {
                this.relatedRecords = related;

                if (this.relatedRecords.length > 0) {
                    this.recoverrelated = true;
                }

                this.loading = false;
            },
            error => {
                this.loading = false;
            });
    }

    private close() {
        this.recovered.emit(false);
        this.self.destroy();
    }

    private getModule(singular) {
        return this.metadata.getModuleFromSingular(singular)
    }

    get recorverDisabled() {
        return this.relatedRecords.length == 0
    }

    private doRecover() {
        this.recovering = true;
        this.backend.postRequest('systrashcan/recover/' + this.record.id, {recoverrelated: this.recoverrelated}).subscribe(result => {
            this.toast.sendToast('record ' + this.record.recordname + ' recovered')
            this.recovered.emit(true);
            this.self.destroy();
        });
    }
}
