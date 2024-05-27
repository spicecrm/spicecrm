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
import {dictionarymanager} from '../services/dictionarymanager.service';
import {
    DictionaryDefinition,
    DictionaryManagerMessage,
    DictionaryType
} from "../interfaces/dictionarymanager.interfaces";
import {language} from "../../services/language.service";
import * as module from "module";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'dictionary-manager-add-definition-modal',
    templateUrl: '../templates/dictionarymanageradddefinitionmodal.html',
})
export class DictionaryManagerAddDefinitionModal {

    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * the domain definition
     */
    public dictionarydefinition: DictionaryDefinition;

    /**
     * messages collected
     * @private
     */
    public messages: DictionaryManagerMessage[] = [];

    /**
     * an emitter for the new ID
     */
    @Output() public newDefinitionID: EventEmitter<string> = new EventEmitter<string>();
    /**
     * holds the selected sys module for the type module
     * @private
     */
    private sysModule: string;

    constructor(public dictionarymanager: dictionarymanager,
                public backend: backend,
                public metadata: metadata,
                public modal: modal,
                public modelutilities: modelutilities,
                private language: language,
                private configurationService: configurationService,
                public injector: Injector) {
        this.dictionarydefinition = {
            id: this.modelutilities.generateGuid(),
            name: '',
            tablename: '',
            sysdictionary_type: undefined,
            scope: this.dictionarymanager.defaultScope,
            status: 'd'
        };
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * returns the messages for a specific field
     * @param field
     * @private
     */
    public getMessages(field) {
        return this.messages.filter(m => m.field == field);
    }

    /**
     * check if we can save
     *
     * name and fieldtype are defined and name does not exists yet
     *
     */
    get canSave() {
        this.messages = [];

        if (!this.dictionarydefinition.name) {
            this.messages.push({field: 'name', message: 'name must be entered'});
        }

        if (!this.dictionarydefinition.sysdictionary_type) {
            this.messages.push({field: 'sysdictionary_type', message: 'type must be specified'});
        } else if (this.dictionarydefinition.sysdictionary_type == 'module' && !this.sysModule) {
            this.messages.push({field: 'sysdictionary_type', message: 'module must be selected for type module'});
        }

        if (this.dictionarydefinition.sysdictionary_type != 'template' && !this.dictionarydefinition.tablename) {
            this.messages.push({field: 'tablename', message: 'tablename must be entered'});
        }

        if (this.dictionarymanager.dictionarydefinitions.find(d => d.name == this.dictionarydefinition.name)) {
            this.messages.push({field: 'name', message: 'name exists already'});
        }

        if (this.dictionarydefinition.tablename && this.dictionarymanager.dictionarydefinitions.find(d => d.tablename == this.dictionarydefinition.tablename)) {
            this.messages.push({field: 'tablename', message: 'table exists already'});
        }

        if (this.dictionarydefinition.tablename && this.dictionarymanager.reservedwords && this.dictionarymanager.reservedwords.indexOf(this.dictionarydefinition.tablename.toUpperCase()) >= 0) {
            this.messages.push({field: 'tablename', message: 'tablename cannot be used (reserved word)'});
        }

        return this.messages.length == 0;
    }

    /**
     * saves the modal
     */
    public save() {
        if (this.canSave) {
            let saveModal = this.modal.await('LBL_SAVING');
            this.dictionarydefinition.id = this.modelutilities.generateGuid();
            this.backend.postRequest(`dictionary/definition/${this.dictionarydefinition.id}`, {}, this.dictionarydefinition).subscribe({
                next: (res) => {

                    this.handleTypeModuleSave();

                    this.dictionarymanager.dictionarydefinitions.push(this.dictionarydefinition);
                    this.newDefinitionID.emit(this.dictionarydefinition.id);
                    saveModal.emit(true);
                    this.close();
                },
                error: () => {
                    saveModal.emit(true);
                }
            })
        }
    }

    /**
     * update the sys module entry
     * @private
     */
    private handleTypeModuleSave() {

        if (this.dictionarydefinition.sysdictionary_type != 'module') return;

        const module = this.metadata.getModuleDefs(this.sysModule);
        const table = module.scope == 'global' ? 'sysmodules' : 'syscustommodules';
        const body = {config: {id: module.id, sysdictionarydefinition_id: this.dictionarydefinition.id}};

        this.backend.postRequest(`configuration/configurator/${table}/${module.id}`, {}, body).subscribe(() => {
            this.configurationService.reloadTaskData('sysdictionarydefinitions');
        });
    }

    /**
     * handle type change for module display module selection
     * @param type
     */
    public handleTypeChange(type: DictionaryType) {

        if (type != 'module') return;

        const modules = this.metadata.getModules().map(m => ({value: m, display: this.language.getModuleName(m)}));
        this.modal.prompt('input', 'LBL_SELECT_MODULE', 'LBL_SELECT_MODULE', 'default', undefined, modules)
            .subscribe(answer => {
                if (!answer) return;
                this.sysModule = answer;
            });
    }
}
