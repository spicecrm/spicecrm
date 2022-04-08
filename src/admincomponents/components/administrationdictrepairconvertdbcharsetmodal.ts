/**
 * @module AdminComponentsModule
 */
import {Component, OnInit} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";

@Component({
    selector: 'administration-dict-repair-convert-db-charset-modal',
    templateUrl: '../templates/administrationdictrepairconvertdbcharsetmodal.html'
})
export class AdministrationDictRepairConvertDBCharsetModal implements OnInit {
    /**
     * holds the convert to charset
     */
    public convertToCharset: string;
    /**
     * holds the database charset
     */
    public databaseData: { charset: string, collation: string, database: string };
    /**
     * holds the db tables
     */
    public tables: Array<{ table_name: string, character_set_name: string, collation_name: string, selected?: boolean }> = [];
    /**
     * holds the db tables
     */
    public filteredTables: Array<{ table_name: string, character_set_name: string, collation_name: string, selected?: boolean }> = [];
    /**
     * holds the db tables
     */
    public selectedTables: string[] = [];
    /**
     * holds a reference to this component
     */
    public self: any;

    constructor(public backend: backend, public toast: toast, public language: language) {
    }

    /**
     * holds the tables list filter term
     */
    public _listFilterTerm: string;

    /**
     * @return string the list filter term
     */
    get listFilterTerm() {
        return this._listFilterTerm;
    }

    /**
     *  set the list filter term
     * @param value
     */
    set listFilterTerm(value: string) {
        this._listFilterTerm = value;
        this.filteredTables = this.tables.filter(table => table.table_name.indexOf(value) > -1);
    }

    /**
     * load the db tables
     */
    public ngOnInit() {
        this.loadDBTables();
    }

    /**
     * destroy the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * send the selected tables to the backend to be converted
     */
    public convertTables() {

        this.close();

        const body = {
            tables: this.filteredTables.filter(table => !!table.selected).map(t => t.table_name),
            charset: this.convertToCharset,
        };
        this.backend.postRequest('admin/convert/tables', {}, body).subscribe(res => {
            if (res) {
                this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
            }
        });
    }

    /**
     * send the selected tables to the backend to be converted
     */
    public convertDatabase() {

        this.close();

        const body = {
            charset: this.convertToCharset,
        };
        this.backend.postRequest('admin/convert/database', {}, body).subscribe(res => {
            if (res) {
                this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
            }
        });
    }

    /**
     * toggle select all table
     */
    public toggleSelectAll(bool: boolean) {
        this.selectedTables = !bool ? [] : this.filteredTables.map(t => t.table_name);
        this.filteredTables.forEach(table => table.selected = bool);
    }

    /**
     * push the selected table to the array
     * @param bool
     * @param tableName
     */
    public selectTable(bool: boolean, tableName: string) {
        if (bool && !this.selectedTables.some(t => t == tableName)) {
            this.selectedTables.push(tableName);
        } else if (!bool) {
            this.selectedTables = this.selectedTables.filter(t => t != tableName);
        }
    }

    /**
     * load the database tables data from backend
     * @private
     */
    public loadDBTables() {
        this.backend.getRequest('admin/charset/database').subscribe(res => {
            this.tables = res.tables;
            this.filteredTables = this.tables;
            this.databaseData = res.database;
        });
    }
}

