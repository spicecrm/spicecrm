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
    templateUrl: '../templates/administrationdictrepairdbcolumnsmodal.html'
})
export class AdministrationDictRepairDbColumnsModal {

    /**
     * reference to the modal
     * @private
     */
    public self: any = {};

    /**
     * the module selected
     * @private
     */
    public _module: string = '';

    /**
     * the list of modules
     */
    public modules: string[];

    /**
     * list of all fields in teh module
     * @private
     */
    public allFields: any = [];

    constructor(
        public backend: backend,
        public toast: toast,
        public language: language,
        public modal: modal,
        public metadata: metadata,
        public helper: helper
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
    public mergeColumns() {
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
    public selectAll() {
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
    public close() {
        this.self.destroy();
    }

    /**
     * execute db repair
     */
    public doRepair() {

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
    public delete() {
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

