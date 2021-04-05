/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

// /**
//  * @module ObjectComponents
//  */
//
// /**
//  * @ignore
//  */
// declare var moment: any;
//
// import {
//     Component
// } from '@angular/core';
// import {metadata} from '../../services/metadata.service';
// import {language} from '../../services/language.service';
// import {model} from '../../services/model.service';
// import {modal} from '../../services/modal.service';
// import {backend} from '../../services/backend.service';
// import {modellist} from '../../services/modellist.service';
//
// /**
//  * renders in the list header action menu and offers the user the oiption to download the list
//  *
//  * either downloads the full list with all entries or the selected entries
//  */
// @Component({
//     selector: 'object-list-header-actions-export-csv-button',
//     templateUrl: './src/objectcomponents/templates/objectlistheaderactionsexportcsvbutton.html',
// })
// export class ObjectListHeaderActionsExportCSVButton {
//
//     constructor(private language: language, private metadata: metadata, private modellist: modellist, private model: model, private modal: modal, private backend: backend) {
//     }
//
//     /**
//      * cheks the acl rights for the user to export
//      */
//     get exportdisabled() {
//         return !this.metadata.checkModuleAcl(this.model.module, 'export');
//     }
//
//     /**
//      * returns the number of sleected items or all in the modellist
//      */
//     get exportcount() {
//         let selectedCount = this.modellist.getSelectedCount();
//         return selectedCount ? selectedCount : this.modellist.listData.totalcount;
//     }
//
//     /**
//      * a getter for a filename with the module and the current date & time
//      */
//     get exportfilename() {
//         return this.model.module + '_' + new moment().format('YYYY_MM_DD_HH_mm') + '.csv';
//     }
//
//     /**
//      * the export action
//      */
//     private export() {
//
//         if(!this.exportdisabled) {
//             this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
//                 loadingRef.instance.messagelabel = 'LBL_EXPORTING';
//                 this.modellist.exportList().subscribe(downloadurl => {
//                     loadingRef.instance.self.destroy();
//
//                     // handle the download
//                     let a: any = document.createElement("a");
//                     document.body.appendChild(a);
//                     a.href = downloadurl;
//                     a.download = this.exportfilename;
//                     a.click();
//                     a.remove();
//
//                 });
//             });
//         }
//
//     }
// }




/**
 * @module ObjectComponents
 */

/**
 * @ignore
 */
declare var moment: any;

import {Component, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'object-list-header-actions-export-csv-button',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsexportcsvbutton.html',
})
export class ObjectListHeaderActionsExportCSVButton {

    /**
     * defautls to true and is set in ngOnInit
     */
    public hidden: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private injector: Injector
    ) {}

    /**
     * cheks the acl rights for the user to export
     */
    get disabled() {
        return !this.metadata.checkModuleAcl(this.model.module, 'export');
    }

    /**
     * returns the number of sleected items or all in the modellist
     */
    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }

    public execute() {
        if(!this.disabled) {
            this.modal.openModal('ObjectListHeaderActionsExportCSVSelectFields', true, this.injector);
            /*
            this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
                loadingRef.instance.messagelabel = 'LBL_EXPORTING';
                this.modellist.exportList().subscribe(downloadurl => {
                    loadingRef.instance.self.destroy();

                    // handle the download
                    let a: any = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = downloadurl;
                    a.download = this.model.module + '_' + new moment().format('YYYY_MM_DD_HH_mm') + '.csv';
                    a.click();
                    a.remove();

                });
            });
            */
        }
    }

}

