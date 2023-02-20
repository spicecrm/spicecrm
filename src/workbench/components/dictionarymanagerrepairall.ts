/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Injector, Output
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {Md5} from "ts-md5";

@Component({
    selector: 'dictionary-manager-repair-all',
    templateUrl: '../templates/dictionarymanagerrepairall.html',
})
export class DictionaryManagerRepairAll {

    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * the definitions loaded
     */
    public definitions: any[] = [];

    /**
     * indicates that thje user stopped the process
     */
    public stopped: boolean = false;

    /**
     * imdicates that we are reparing
     */
    public repairing: boolean = false;

    /**
     * set to true to execute SQLs when repairing
     */
    public executerSQLs: boolean = false;

    constructor(public dictionarymanager: dictionarymanager, public backend: backend, public metadata: metadata, public toast: toast, public modal: modal, public modelutilities: modelutilities, public injector: Injector) {
        this.getDefinitions();
    }

    /**
     * returns if we hav e SQL Statement
     */
    get canCopySQLs() {
        return this.definitions.filter(d => d.sql).length > 0;
    }

    /**
     * loads the definitions from teh backend
     */
    public getDefinitions() {
        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest('dictionary/repair').subscribe({
            next: (res) => {
                this.definitions = res.SpiceDictionaryDefinitions.sort((a, b) => a.name.localeCompare(b.name)).map(d => {
                    return {
                        id: d.id,
                        type: 'dictionarydefinition',
                        name: d.tablename,
                        status: 'n',
                        sql: '',
                        error: ''
                    }
                });

                // build relationships
                let relationships = res.SpiceDictionaryRelationships.sort((a, b) => a.relationship_name.localeCompare(b.relationship_name)).map(d => {
                    return {
                        id: d.id,
                        type: 'dictionaryrelationship',
                        name: d.relationship_name,
                        status: 'n',
                        sql: '',
                        error: ''
                    }
                });

                // merge the arrays
                this.definitions = this.definitions.concat(relationships);

                loadingModal.emit(true);
            },
            error: () => {
                loadingModal.emit(true);
            }
        })

        /*
        this.definitions = this.dictionarymanager.dictionarydefinitions.filter(d => d.status == 'a' && d.sysdictionary_type != 'template').sort((a, b) => a.name.localeCompare(b.name)).map(d => {
            return {
                id: d.id,
                type: 'dictionarydefinition',
                name: d.tablename,
                status: 'n',
                sql: '',
                error: ''
            }
        });
        */

    }

    /**
     * gets all relationships that a®e active and belong to the item
     */
    private dictionaryrelationships(definitioId) {

        return this.dictionarymanager.dictionaryrelationships.filter(r => r.status == 'a' && (r.lhs_sysdictionarydefinition_id == definitioId || r.rhs_sysdictionarydefinition_id == definitioId || r.join_sysdictionarydefinition_id == definitioId)).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * gets all non deleted entries sorted by name
     */
    private dictionaryRelationshipsForTemplates(definitioId): any[] {
        let relatedRelationships: any[] = [];

        for (let item of this.dictionarymanager.dictionaryitems.filter(d => d.status == 'a' && d.sysdictionary_ref_id && d.sysdictionarydefinition_id == definitioId)) {
            let relRelationships = this.dictionarymanager.dictionaryrelationships.filter(d => d.deleted == 0 && (d.lhs_sysdictionarydefinition_id == item.sysdictionary_ref_id || d.rhs_sysdictionarydefinition_id == item.sysdictionary_ref_id));
            if (relRelationships.length > 0) {
                relatedRelationships.push({
                    relatedTemplateId: item.sysdictionary_ref_id,
                    relationships: relRelationships
                });
            }
        }

        return relatedRelationships;
    }


    /**
     * gets the repair progress
     */
    public getProgress() {
        // if we do not yet have definitions return 0
        if (this.definitions.length == 0) return 0;

        return Math.round(((this.definitions.length - this.definitions.filter(d => d.status == 'n').length) / this.definitions.length) * 100);
    }

    /**
     * returns the processed count
     */
    get processedCount() {
        return this.definitions.filter(d => d.status != 'n').length
    }

    /**
     * determines a class based on the definition status and SQL
     *
     * @param d
     */
    public lineThemeClass(d) {
        // if we have an error
        if (d.status == 'e') return 'slds-theme--error';

        // if in process highlight the row
        if (d.status == 'p') return 'slds-theme--info';

        // if completed but with an sql
        if (d.status == 'c' && d.sql) return 'slds-theme--warning';

        // if completed and no action required
        if (d.status == 'c') return 'slds-theme--success';

        // if not no class is returnes
        return '';
    }

    /**
     * determines a class based on the definition status and SQL
     *
     * @param d
     */
    public iconThemeClass(d) {
        // if we have an error
        if (d.status == 'e') return 'slds-icon-text-error';

        // if in process highlight the row
        if (d.status == 'p') return 'slds-icon-text-default';

        // if completed but with an sql
        if (d.status == 'c' && d.sql) return 'slds-icon-text-warning';

        // if completed and no action required
        if (d.status == 'c') return 'slds-icon-text-success';

        // if not no class is returnes
        return 'slds-icon-text-light';
    }

    /**
     * starts the process
     */
    public start() {
        // reset the stored SQLs on the backend
        let resetAwait = this.modal.await('LBL_RESETTING');
        this.backend.putRequest('dictionary/repair/sqls/reset').subscribe({
            next: () => {
                this.definitions.forEach(d => {
                    d.status = 'n';
                    d.sql = '';
                    d.sqlerror = '';
                    d.error = '';
                })
                this.handleNext();
                this.repairing = true;
                resetAwait.emit(true);
            },
            error: () => {
                this.toast.sendToast('ERROR resetting Backend', 'error');
                resetAwait.emit(true);
            }
        })
    }

    /**
     * stops the process
     */
    public stop() {
        this.stopped = true;
    }

    public handleNext() {
        // check if we have a stoppeed flag
        if (this.stopped) {
            this.stopped = false;
            this.repairing = false;
            return;
        }
        ;

        let d = this.definitions.find(d => d.status == 'n' && d.type == 'dictionarydefinition');
        if (d) {
            d.status = 'p'
            this.repair(d);
        } else {
            this.repairing = false;
        }
    }

    private repair(definiton, handleNext = true) {
        let params: any = {};
        if (this.executerSQLs) {
            params.execute = true;
        }
        this.backend.putRequest(`dictionary/repair/definition/${definiton.id}`, params).subscribe({
            next: (res) => {
                if (res) {
                    definiton.status = 'c';
                    definiton.sql = res.sql;
                    definiton.sqlerror = res.sqlerror;
                } else {
                    definiton.status = 'e';
                }
                if (handleNext) this.handleNext();
            },
            error: (e) => {
                definiton.status = 'e';
                definiton.error = e.error?.error?.message;
                if (handleNext) this.handleNext();
            }
        })
    }

    public getIcon(status) {
        switch (status) {
            case 'p':
                return 'clock';
            case 'c':
                return 'success';
            case 'e':
                return 'error';
            default:
                return 'orders';
        }
    }

    public getTypeIcon(type) {
        switch (type) {
            case 'dictionaryrelationship':
                return 'link';
            case 'dictionarydefinition':
                return 'database';
        }
    }

    /**
     * executes a single SQL statement
     *
     * @param sql
     */
    public execute(definition) {
        this.modal.confirm(definition.sql, 'LBL_EXECUTE').subscribe({
            next: (answer) => {
                if (answer) {
                    let execAwait = this.modal.await('LBL_EXECUTING');
                    let hash = Md5.hashStr(definition.sql);
                    this.backend.postRequest(`dictionary/repair/sqls/${hash}`).subscribe({
                        next: (res) => {
                            if (res.error) {
                                this.toast.sendToast('LBL_SQL_ERROR', "error", res.error);
                            }
                            execAwait.emit(true);

                            // run a new repair for the definiiton
                            definition.status = 'p';
                            this.repair(definition, false);
                        },
                        error: (e) => {
                            this.toast.sendToast('LBL_ERROR', "error", e.error.error.message);
                            execAwait.emit(true);
                        }
                    })
                }
            }
        })
    }

    public copyToClipBoard(sql): void {
        navigator.clipboard.writeText(sql);
        this.toast.sendToast('LBL_COPIED_TO_CLIPBOARD', 'info');
    }

    /**
     * copies all SQLs to the clipboard
     * @param sql
     */
    public copyAllToClipBoard(): void {
        navigator.clipboard.writeText(this.definitions.filter(d => d.sql).map(d => d.sql).join("\r\n"));
        this.toast.sendToast('LBL_COPIED_TO_CLIPBOARD', 'info');
    }

    /**
     * close the modal
     */
    public close() {
        // set stopped if we are still repairing
        this.stopped = true;
        // close the modal
        this.self.destroy();
    }


}
