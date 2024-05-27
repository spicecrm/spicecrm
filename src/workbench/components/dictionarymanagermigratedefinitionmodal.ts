/**
 * @module WorkbenchModule
 */
import {
    Component, OnInit
} from '@angular/core';
import {modal} from '../../services/modal.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {
    DictionaryDefinition, DictionaryIndex,
    DictionaryItem,
    DictionaryManagerMessage
} from "../interfaces/dictionarymanager.interfaces";
import {toast} from "../../services/toast.service";

@Component({
    selector: 'dictionary-manager-migratedefinition-modal',
    templateUrl: '../templates/dictionarymanagermigratedefinitionmodal.html',
})
export class DictionaryManagerMigrateDefinitionModal implements OnInit {

    private currentVersion = '2024.01.001';
    private currentPackage = 'system';

    public loading: boolean = true;

    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * the tables loaded
     */
    public tables: any[] = [];

    public filterterm: string;
    public filterundefined: boolean = false;

    /**
     * the field loaded
     */
    public fields: any[] = [];

    public indices: any[] = [];

    /**
     * the templates we found for the definition
     */
    public templates: any[] = [];

    /**
     * the list of the domains
     */
    public domains: any[] = [];

    /**
     * the list of templates deifned in the dictonary
     */
    public definedtemplates: any[] = [];

    /**
     * the domain definition
     */
    public dictionarydefinition: DictionaryDefinition;

    public _selectedtable: string = '';

    public view: 'tables' | 'details' | 'fields' | 'indices'|'templates' = 'tables';

    private systemdefinitions = ['audited', 'name', 'vname', 'comment', 'required', 'type', 'len', 'reportable', 'duplicate_merge', 'sysdomainfield_id', 'source'];

    constructor(public backend: backend,
                public modal: modal,
                public modelutilities: modelutilities,
                public toast: toast,
                public dictionarymanager: dictionarymanager) {
    }

    public ngOnInit() {
        let awaitModal = this.modal.await('LBL_LOADING');

        this.dictionarydefinition = {
            id: this.modelutilities.generateGuid(),
            name: '',
            tablename: '',
            sysdictionary_type: 'module',
            scope: this.dictionarymanager.defaultScope,
            status: 'd'
        };

        this.backend.getRequest('dictionary/fields').subscribe({
            next: (tables) => {
                this.tables = tables;

                this.tables.sort((a, b) => a.sysdictionarytablename.localeCompare(b.sysdictionarytablename));
                awaitModal.emit(true);
                this.loading = false;
            },
            error: () => {
                awaitModal.emit(true);
                this.close();
            }
        });

        // load the domains
        for (let domain of this.dictionarymanager.domaindefinitions) {
            this.domains.push({
                id: domain.id,
                name: domain.name
            });
        }
        // sort the domain name alphabetically
        this.domains.sort((a, b) => a.name.localeCompare(b.name) > 0 ? 1 : -1);

        // load the templates
        for (let template of this.dictionarymanager.dictionarydefinitions.filter(t => t.sysdictionary_type == 'template')) {
            this.definedtemplates.push({
                id: template.id,
                name: template.name
            });
        }
        // sort the domain name alphabetically
        this.definedtemplates.sort((a, b) => a.name.localeCompare(b.name) > 0 ? 1 : -1);
    }

    private loadVardefs(dictionaryname) {
        this.backend.getRequest(`dictionary/vardefs/${dictionaryname}`).subscribe({
            next: (data) => {

                if (data[dictionaryname].indices) {
                    let keys = Object.keys(data[dictionaryname].indices);
                    for (let key of keys) {
                        data[dictionaryname].indices[key].scope = this.dictionarydefinition.scope;
                        data[dictionaryname].indices[key].package = this.dictionarydefinition.package;
                        data[dictionaryname].indices[key].version = this.dictionarydefinition.version;
                        this.indices.push(data[dictionaryname].indices[key]);
                    }
                }

                if (data[dictionaryname].templates) {
                    let keys = Object.keys(data[dictionaryname].templates);
                    for (let key of keys) {
                        let t = this.definedtemplates.find(d => d.name == key);
                        this.templates.push({
                            name: key,
                            sysdictionary_ref_id: t ? t.id : undefined,
                            scope: this.dictionarydefinition.scope,
                            package: this.dictionarydefinition.package,
                            version: this.dictionarydefinition.version
                        });
                    }
                }
            }
        });
    }

    get _tables() {
        if (this.filterterm || this.filterundefined) {
            return this.tables.filter(t => (!this.filterterm || t.sysdictionarytablename.toLowerCase().indexOf(this.filterterm.toLowerCase()) >= 0) && (!this.filterundefined || !t.sysdictionarydefinition_id));
        }

        return this.tables;
    }

    get _fields() {
        if (this.filterundefined) {
            return this.fields.filter(f => !f.sysdomainfield_id);
        }

        return this.fields;
    }


    /**
     * translates the object into an array with objects of key and value
     * @param defs
     */
    public getFieldDefinitions(defs) {
        if (!defs) return [];

        let keys = Object.keys(defs);
        let ret = [];

        for (let key of keys) {
            // check that it is not a system definition
            if (this.systemdefinitions.indexOf(key) >= 0) continue;
            ret.push({
                key,
                value: defs[key]
            });
        }
        return ret;
    }

    get selectedtable() {
        return this._selectedtable;
    }

    set selectedtable(value) {
        this._selectedtable = value;

        let table = this.tables.find(t => t.sysdictionarytablename == value);
        if (table) {
            this.fields = table.fields;
            this.autoMapFields();

            // if we have an id already set it
            if (table.sysdictionarydefinition_id) {
                this.dictionarydefinition.id = table.sysdictionarydefinition_id;
                let def = this.dictionarymanager.dictionarydefinitions.find(d => d.id == table.sysdictionarydefinition_id);
                this.dictionarydefinition.scope = def.scope;
                this.dictionarydefinition.package = def.package;
                this.dictionarydefinition.version = def.version;
            } else {
                this.dictionarydefinition.id = this.modelutilities.generateGuid();
                this.dictionarydefinition.scope = undefined;
                this.dictionarydefinition.package = this.currentPackage;
                this.dictionarydefinition.version = this.currentVersion;
            }

            this.dictionarydefinition.name = table.sysdictionaryname;
            this.dictionarydefinition.tablename = table.sysdictionarytablename;


        }

    }

    /**
     * automatically map undefined fields
     * @private
     */
    private autoMapFields() {
        this.fields.forEach(f => {

            // match domain to field type
            if (!f.sysdomainfield_id) {
                f.sysdomaindefinition_id = this.mapFieldTypeToDomain(f);
            }

            // generate label from name if it is undefined
            if (!f.fielddefinition.vname) {
                f.fielddefinition.vname = `LBL_${f.fielddefinition.name.toUpperCase()}`;
            }

            if (!f.version) f.version = this.currentVersion;

            if (!f.package) f.package = this.currentPackage;

            if (!f.scope) f.scope = 'g';
        });
    }

    /**
     * map field type to domain and return the matched domain id
     * @return string
     * @param field
     * @private
     */
    private mapFieldTypeToDomain(field): string {

        let fieldType = field.fieldtype;

        switch (field.fieldtype) {
            case 'varchar':
                fieldType = 'varchar255';

                if (field.fielddefinition.len == 36 || field.name == 'id') {
                    fieldType = 'guid';
                } else if (field.fieldname == 'version') {
                    fieldType = 'varchar15';
                } else if (field.fieldname == 'package') {
                    fieldType = 'varchar50';
                } else if (!isNaN(field.fielddefinition.len)) {
                    fieldType = field.fieldtype + field.fielddefinition.len;
                }
                break;
            case 'id':
                fieldType = 'guid';
                break;
            case 'int':
                if (field.fielddefinition.len == 1) {
                    fieldType = 'smallint';
                }
                break;

        }

        return this.domains.find(d => d.name == fieldType)?.id;
    }

    get allExpanded() {
        return this.fields.length == this.fields.filter(f => f.showdetails === true).length;
    }

    public toggleAllDetails() {
        let allexpanded = this.allExpanded;
        for (let f of this.fields) f.showdetails = !allexpanded;
    }

    get allSelected() {
        return this.fields.filter(f => !f.sysdomainfield_id).length == this.fields.filter(f => f.selected === true && !f.sysdomainfield_id).length;
    }

    set allSelected(value) {
        for (let f of this.fields) {
            if (!!f.sysdomainfield_id) continue;
            f.selected = value;
        }
    }

    public goDetails() {

        if (!this.selectedtable) return;

        // if we have the definition skip the view
        if(this.tables.find(t => t.sysdictionarydefinition_id == this.dictionarydefinition.id)) {
            this.goFields(true);
            return;
        }

        // else go Details
        this.view = 'details';
    }

    get detailsComplete(){
        return this.dictionarydefinition.name && this.dictionarydefinition.tablename && this.dictionarydefinition.scope;
    }

    public goFields(load: boolean = false) {
        this.view = 'fields';

        if(load) {
            for (let f of this.fields.filter(f => !f.sysdomaindefinition_id)) {
                f.scope = this.dictionarydefinition.scope;
                f.package = this.dictionarydefinition.package;
                f.version = this.dictionarydefinition.version;
            }

            this.loadVardefs(this.dictionarydefinition.name);
        }

    }

    public goIndices() {
        this.view = 'indices';
    }


    public goTemplates() {
        this.view = 'templates';
    }


    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    public canAddIndex(fields: any[]){

        for(let field of fields) {
            if (!this.fields.find(f => (f.selected || !!f.sysdomainfield_id) && f.fieldname == field)) return false;
        }

        return true;
    }

    public canAddTemplate(template: string){

        let t = this.dictionarymanager.dictionarydefinitions.find(d => d.name == template && d.sysdictionary_type == 'template');

        return !!t;
    }

    get canAdd() {
        // at least one field selected and all selected fields has a selected domain
        return (this.fields.some(f => f.selected && !!f.sysdomaindefinition_id) && !this.fields.some(f => f.selected && !f.sysdomaindefinition_id)) || this.indices.some(i => i.selected) || this.templates.some(t => t.selected);
    }

    public add() {
        // if this is a new definiton
        if (!this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarydefinition.id)) {
            // push it
            this.backend.postRequest(`dictionary/definition/${this.dictionarydefinition.id}`, {}, this.dictionarydefinition).subscribe({
                next: (res) => {
                    this.toast.sendToast('added definitions', 'success');
                    this.dictionarymanager.dictionarydefinitions.push(this.dictionarydefinition);
                },
                error: () => {
                    this.toast.sendToast('error adding definitions', 'error');
                }
            });
        }

        /**
         * add the templates
         */
        let s = this.fields.filter(f => !!f.sysdomainfield_id).length;
        let newItems = [];
        for (let t of this.templates.filter(t => t.selected)) {
            let dictionaryitem: DictionaryItem = {
                id: this.modelutilities.generateGuid(),
                sysdictionarydefinition_id: this.dictionarydefinition.id,
                sysdictionary_ref_id: t.sysdictionary_ref_id,
                name: t.name,
                exclude_from_audited: 0,
                default_value: '',
                required: 0,
                scope: t.scope ? t.scope : this.dictionarydefinition.scope,
                status: 'd',
                sequence: s
            };
            s++;

            // collect the newItems
            newItems.push(dictionaryitem);
        }

        /**
         * add the items
         */

        let newitems: any = {};
        for (let f of this._fields.filter(f => f.selected)) {
            let itemId = this.modelutilities.generateGuid();
            let dictionaryitem: DictionaryItem = {
                id: itemId,
                sysdictionarydefinition_id: this.dictionarydefinition.id,
                sysdomaindefinition_id: f.sysdomaindefinition_id,
                name: f.fieldname,
                non_db: 0,
                exclude_from_audited: f.fielddefinition.audited ? 0 : 1,
                default_value: '',
                required: f.fielddefinition.required ? 1 : 0,
                scope: f.scope ? f.scope : this.dictionarydefinition.scope,
                status: 'd',
                sequence: s,
                package: f.package,
                version: f.version,
                label: f.fielddefinition.vname,
                description: f.fielddefinition.comment
            };
            s++;

            newitems[f.fieldname] = itemId;

            // collect the newItems
            newItems.push(dictionaryitem);
        }

        // add all new items in bulk
        if(newItems.length > 0){
            this.backend.postRequest('dictionary/items', {}, {items: newItems}).subscribe({
                next: () => {
                    this.toast.sendToast('added items', 'success');
                    this.dictionarymanager.dictionaryitems = this.dictionarymanager.dictionaryitems.concat(newItems);
                    this.addIndices(newitems);
                },
                error: () => {
                    this.toast.sendToast('error adding items', 'error');

                }
            });
        }
        this.close();
    }

    private addIndices(newitems) {
        /**
         * add the indices
         */
        let dictdefitems = this.dictionarymanager.getDictionaryDefinitionItems(this.dictionarydefinition.id);

        for (let i of this.indices.filter(f => f.selected)) {
            let indexId = this.modelutilities.generateGuid();
            let dictionaryindex: DictionaryIndex = {
                id: indexId,
                name: i.name,
                indextype: i.type,
                package: i.package,
                scope: i.scope,
                version: i.version,
                sysdictionarydefinition_id: this.dictionarydefinition.id,
                status: 'd'
            };

            this.dictionarymanager.dictionaryindexes.push(dictionaryindex);

            let sequence = 0;
            for (let field of i.fields) {
                this.dictionarymanager.dictionaryindexitems.push({
                    id: this.modelutilities.generateGuid(),
                    scope: i.scope,
                    status: 'd',
                    package: i.package,
                    version: i.version,
                    sysdictionaryindex_id: indexId,
                    sysdictionaryitem_id: newitems[field] ? newitems[field] : dictdefitems.find(d => d.name == field).id,
                    sequence: sequence,
                });
                sequence++;
            }

            this.backend.postRequest(`dictionary/index/${indexId}`, {}, {index: dictionaryindex, items: this.dictionarymanager.dictionaryindexitems.filter(i => i.sysdictionaryindex_id == indexId)}).subscribe({
                next: (res) => {
                    this.toast.sendToast('added indices', 'success');
                },
                error: () => {
                    this.toast.sendToast('error adding indices', 'error');
                }
            });
        }
    }
}
