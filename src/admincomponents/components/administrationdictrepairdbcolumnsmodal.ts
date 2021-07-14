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
import {Component} from '@angular/core';
import {Md5} from "ts-md5";
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";
import {metadata} from "../../services/metadata.service";
import {helper} from "../../services/helper.service";

@Component({
    selector: 'administration-dict-repair-db-columns-modal',
    templateUrl: './src/admincomponents/templates/administrationdictrepairdbcolumnsmodal.html'
})
export class AdministrationDictRepairDbColumnsModal {

    /**
     * reference to the modal
     * @private
     */
    private self: any = {};

    /**
     * the module selected
     * @private
     */
    private _module: string = '';

    /**
     * the list of modules
     */
    public modules: string[];

    /**
     * list of all fields in teh module
     * @private
     */
    private allFields: any = [];

    constructor(
        private backend: backend,
        private toast: toast,
        private language: language,
        private modal: modal,
        private metadata: metadata,
        private helper: helper
    ) {
        this.modules = this.metadata.getModules();
        this.modules.sort();
    }

    get module() {
        return this._module;
    }

    set module(module) {
        if (module != this._module) {
            this._module = module;
            this.mergeColumns();
        }
    }

    /**
     * get all the db columns for one module
     */
    private mergeColumns() {
        this.allFields = [];
        // get all db columns from the backend
        this.backend.getRequest('dictionary/browser/' + this.module + '/dbcolumns').subscribe((result: any) => {

            // get all module fields (vardefs)
            const moduleFields = this.metadata.getModuleFields(this.module);

            // Step 1: Set all the vardef fields into a new array
            for (let field in moduleFields) {
                if (moduleFields[field].source != 'non-db') {
                    this.allFields.unshift({
                        name: moduleFields[field].name,
                        vardef_available: true
                    });
                }
            }

            // Step 2: Check if the db field is already in the list
            // yes -> set db_available = true
            // not -> add new object with vardef_available = false
            for (let dbfield in result) {
                let dbname = result[dbfield].name;
                let withvardef = false;

                for (let allfield in this.allFields) {
                    if (this.allFields[allfield].name == dbname) {

                        this.allFields[allfield].db_available = true;

                        // Fields with both should be moved to the end of the list (these are not interesting)
                        this.allFields.push(this.allFields[allfield]);
                        this.allFields.splice(allfield, 1);

                        withvardef = true;
                    }
                }

                // if there is a db field without vardef
                if (!withvardef) {
                    this.allFields.unshift({
                        name: dbname,
                        db_available: true
                    });
                }

            }
        });
    }

    /**
     * select all that can be deleted
     *
     * @private
     */
    private selectAll() {
        for (let field of this.allFields.filter(f => f.db_available && !f.vardef_available)) {
            field.todelete = true;
        }
    }

    /**
     * getter if we can select all
     */
    get canSelectAll() {
        return this.allFields && this.allFields.filter(f => f.db_available && !f.vardef_available && !f.todelete).length > 0;
    }

    /**
     * getter if we can select all
     */
    get canDelete() {
        return this.allFields && this.allFields.filter(f => f.todelete).length > 0;
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * execute db repair
     */
    private doRepair() {

        // build the list of selected columns and set it into the helper message
        let todeleteString = '';
        for (let selfield of this.allFields.filter(f => f.todelete)) {
            todeleteString += '- ' + selfield.name + '\r\n';
        }
        this.helper.confirm(this.language.getLabel('LBL_CLEAN_DB_COLUMNS'), this.language.getLabel('MSG_DELETE_COLUMNS', 'long') + '\r\n\r\n' + todeleteString)
            .subscribe(answer => {
                if (answer) {
                    this.delete();
                }
            });
    }

    /**
     * after the answer the delete is executed
     */
    private delete() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            let postData = {
                dbcolumns: this.allFields.filter(f => f.todelete),
                module: this.module
            };
            this.backend.postRequest('admin/repair/dbcolumns', {}, postData).subscribe((result: any) => {
                if (result) {
                    this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                    this.mergeColumns();
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                    this.mergeColumns();
                }
                loadingRef.instance.self.destroy();
            });
        });
    }

}
