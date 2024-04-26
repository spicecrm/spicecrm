/**
 * @module WorkbenchModule
 */
import {
    Component, ElementRef, EventEmitter, Injector, Output, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {Md5} from "ts-md5";
import {DictionaryManagerFixDBFieldsMismatchModal} from "./dictionarymanagerfixdbfieldsmismatchmodal";

@Component({
    selector: 'dictionary-manager-repair-all',
    templateUrl: '../templates/dictionarymanagerrepairall.html',
})
export class DictionaryManagerRepairAll {

    @ViewChild('scrollContainer', {read: ElementRef}) private scrollContainer: ElementRef;
    @ViewChildren('repairRow') private repairRow: QueryList<ElementRef>;

    public currentRowIndex = 0;

    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * indicates that we are loading
     */
    public loading: boolean = true;

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

    public displayDetailSetting: boolean = false;

    public itemfilters = {
        definitions: true,
        relationships: true,
        erroneousDefinitions: false,
        alteredDefinitions: false,
    }

    public actions = {
        fullreset: true,
    }

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
                this.definitions = res.SpiceDictionaryDefinitions.map(d => {
                    return {
                        id: d.id,
                        type: 'dictionarydefinition',
                        name: d.tablename,
                        status: 'n',
                        sql: '',
                        error: ''
                    }
                });

                let vardefdefinitions = res.VardefDictionaryDefinitions.map(d => {
                    return {
                        id: d.dictionaryname,
                        type: 'vardefdefinition',
                        name: d.table,
                        status: 'n',
                        sql: '',
                        error: ''
                    }
                });

                // merge the arrays
                this.definitions = this.definitions.concat(vardefdefinitions).sort((a, b) => a.name?.localeCompare(b.name));

                // build relationships
                let relationships = res.SpiceDictionaryRelationships.map(d => {
                    return {
                        id: d.id,
                        type: 'dictionaryrelationship',
                        name: d.relationship_name,
                        template_sysdictionarydefinition_id: d.template_sysdictionarydefinition_id,
                        referencing_sysdictionarydefinition_id: d.referencing_sysdictionarydefinition_id,
                        original_id: d.original_id,
                        status: 'n',
                        sql: '',
                        error: ''
                    }
                });
                // add the vardef Relationships
                relationships = relationships.concat(res.VardefDictionaryRelationships.map(d => {
                    return {
                        id: d.id,
                        type: 'vardefrelationship',
                        name: d.relationship_name,
                        dictionaryname: d.dictionaryname,
                        status: 'n',
                        sql: '',
                        error: ''
                    }
                }));

                // merge the arrays
                    this.definitions = this.definitions.concat(relationships.sort((a, b) => a.name?.localeCompare(b.name)));
                // set that we are no longer loading
                this.loading = false;
                // emit to close the loading modal
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
     * returns the filtered definitions
     */
    get filtereddefinitions(){
        return this.definitions.filter(d => {

            const alteredFilterMatch = this.itemfilters.alteredDefinitions && (!!d.sql || d.status == 'p');
            const erroneousFilterMatch = this.itemfilters.erroneousDefinitions && (d.status == 'e' || d.status == 'p');

            if ((this.itemfilters.alteredDefinitions || this.itemfilters.erroneousDefinitions) && !alteredFilterMatch && !erroneousFilterMatch) {
                return false;
            }

            switch(d.type){
                case 'dictionarydefinition':
                    return this.itemfilters.definitions;
                case 'vardefdefinition':
                    return this.itemfilters.definitions;
                case 'vardefrelationship':
                    return this.itemfilters.relationships;
                case 'dictionaryrelationship':
                    return this.itemfilters.relationships;
            }
        })
    }

    /**
     * generic trackby function to cater to the dynamic filter
     * @param index
     * @param item
     */
    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * gets all relationships that are active and belong to the item
     */
    private dictionaryrelationships(definitioId) {
        return this.dictionarymanager.dictionaryrelationships.filter(r => r.status == 'a' && (r.lhs_sysdictionarydefinition_id == definitioId || r.rhs_sysdictionarydefinition_id == definitioId || r.join_sysdictionarydefinition_id == definitioId)).sort((a, b) => a.name?.localeCompare(b.name));
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

        let f = this.filtereddefinitions;

        return Math.round(((f.length - f.filter(d => d.status == 'n').length) / f.length) * 100);
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
        if (d.status == 'e') return undefined;

        // if in process highlight the row
        if (d.status == 'p' || d.status == 'e') return 'slds-icon-text-default';

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
        this.currentRowIndex = 0;
        this.scrollContainer.nativeElement.scrollTo(0, 0);

        // close the settings in case they are open
        this.displayDetailSetting = false;
        // reset the stored SQLs on the backend
        let resetAwait = this.modal.await('LBL_RESETTING');

        let params: any = {};
        if(this.actions.fullreset) params.fullreset = true;

        this.backend.putRequest('dictionary/repair/reset', params).subscribe({
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
        if (this.actions.fullreset) {
            this.modal.confirm('MSG_WARNING_STOP_REPAIR_ALL_DICTIONARIES', 'MSG_WARNING_STOP_REPAIR_ALL_DICTIONARIES', 'warning').subscribe(answer => {
                if (!answer) return;
                this.stopped = true;
            })
        } else {
            this.stopped = true;
        }
    }

    public handleNext() {

        this.trackScroll();

        this.currentRowIndex++;

        // check if we have a stoppeed flag
        if (this.stopped) {
            this.stopped = false;
            this.repairing = false;
            return;
        };

        let d = this.filtereddefinitions.find(d => d.status == 'n');
        if (d) {
            d.status = 'p'
            switch(d.type){
                case 'dictionarydefinition':
                case 'vardefdefinition':
                    this.repairDefinition(d);
                    break;
                case 'vardefrelationship':
                case 'dictionaryrelationship':
                    this.repairRelationship(d);
                    break;
            }
        } else {

            this.repairing = false;
        }
    }

    /**
     * keep tracking of the current row scroll position
     * @private
     */
    private trackScroll() {

        if (!this.repairRow.get(this.currentRowIndex)) return;

        const margin = this.repairRow.get(this.currentRowIndex).nativeElement.getBoundingClientRect().height * 3;
        const currentOffset = this.repairRow.get(this.currentRowIndex).nativeElement.offsetTop + margin;
        const containerHeight = this.scrollContainer.nativeElement.getBoundingClientRect().height;

        if (currentOffset < containerHeight) return;

        this.scrollContainer.nativeElement.scrollTo(0, (currentOffset - containerHeight))
    }

    private repairDefinition(definiton, handleNext = true) {
        let params: any = {};
        if (this.executerSQLs) {
            params.execute = true;
        }

        // determine what type we are doing
        let routeparam = definiton.type == 'vardefdefinition' ? 'vardef' : 'definition';

        // run the request
        this.backend.putRequest(`dictionary/repair/${routeparam}/${definiton.id}`, params).subscribe({
            next: (res) => {
                if (res) {
                    definiton.status = 'c';
                    definiton.sql = res.sql;
                    definiton.sqlerror = res.sqlerror;
                    definiton.errorDetails = res.errorDetails;
                    definiton.errorCode = res.errorCode;
                } else {
                    definiton.status = 'e';
                }
                if (handleNext) this.handleNext();
            },
            error: (e) => {
                definiton.status = 'e';
                definiton.error = e.error?.error?.message;
                definiton.errorDetails = e.error?.error?.details;
                definiton.errorCode = e.error?.error?.errorCode;

                if (handleNext) this.handleNext();
            }
        })
    }

    private repairRelationship(relationship, handleNext = true) {
        let params: any = {};

        let relId = relationship.original_id ? relationship.original_id : relationship.id
        if (relationship.referencing_sysdictionarydefinition_id) {
            params.referencing_sysdictionarydefinition_id = relationship.referencing_sysdictionarydefinition_id;
            params.template_sysdictionarydefinition_id = relationship.template_sysdictionarydefinition_id;
        }

        // determine what type we are doing
        let route = relationship.type == 'dictionaryrelationship' ? `dictionary/repair/relationship/${relId}` : `dictionary/repair/relationship/${relationship.dictionaryname}/${relationship.name}`;



        // run the request
        this.backend.putRequest(route, params).subscribe({
            next: (res) => {
                if (res) {
                    relationship.status = 'c';
                } else {
                    relationship.status = 'e';
                }
                if (handleNext) this.handleNext();
            },
            error: (e) => {
                relationship.status = 'e';
                relationship.error = e.error?.error?.message;
                relationship.errorDetails = e.error?.error?.details;
                relationship.errorCode = e.error?.error?.errorCode;
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
            case 'vardefdefinition':
                return 'file';
            case 'dictionarydefinition':
                return 'database';
            case 'vardefrelationship':
                return 'knowledge_smart_link';
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
                            this.repairDefinition(definition, false);
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

    /**
     * open fix required modal
     * @param definition
     */
    public openFixRequiredModal(definition) {
        this.modal.openStaticModal(DictionaryManagerFixDBFieldsMismatchModal).subscribe(modalRef => {
            modalRef.instance.dictionaryName = Object.keys(definition.errorDetails)[0];

            modalRef.instance.mismatch = definition.errorDetails;
            modalRef.instance.response.subscribe({
                next: success => {
                    if (!success) return;

                    this.runSingleRepair(definition);
                }
            })
        });
    }

    /**
     * run single repair
     * @param definition
     */
    public runSingleRepair(definition) {
        definition.status = 'p'
        switch(definition.type){
            case 'dictionarydefinition':
            case 'vardefdefinition':
                this.repairDefinition(definition, false);
                break;
            case 'vardefrelationship':
            case 'dictionaryrelationship':
                this.repairRelationship(definition, false);
                break;
        }
    }
}
