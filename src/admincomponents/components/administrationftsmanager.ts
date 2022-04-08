/**
 * @module AdminComponentsModule
 */
import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {modal} from "../../services/modal.service";


@Component({
    selector: '[administration-ftsmanager]',
    templateUrl: '../templates/administrationftsmanager.html',
    providers: [ftsconfiguration]
})
export class AdministrationFTSManager {

    public activeTab: string = 'fields';
    public selected_module;

    constructor(
        public metadata: metadata,
        public language: language,
        public modal: modal,
        public ftsconfiguration: ftsconfiguration,
        public injector: Injector
    ) {

    }

    get modules() {
        // return this.metadata.getModules().sort();
        return this.ftsconfiguration.modules.sort();
    }

    get module() {
        return this.ftsconfiguration.module;
    }

    set module(module) {
        this.ftsconfiguration.setModule(module);
    }

    /**
     * adds a new fts module
     */
    public add() {
        this.modal.openModal('AdministrationFTSManagerModuleAdd', true, this.injector).subscribe(addPopup => {
            addPopup.instance.module$.subscribe(newModule => {
                if (newModule) {
                    this.module = newModule;
                }
            });
        });
    }

    /**
     * deletes the current FTS config settings
     */
    public delete() {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                this.ftsconfiguration.deleteModule(this.module);
                this.module = '';
            }
        });
    }

    public setActiveTab(tab) {
        this.activeTab = tab;
    }

    public save() {
        this.ftsconfiguration.save();
    }

    public indexModule() {
        this.modal.openModal('AdministrationFtsManagerIndexModal')
            .subscribe(modalRef => {
                modalRef.instance.response.subscribe(res => {
                    if (res) {
                        this.ftsconfiguration.executeAction('bulk', res);
                    }
                });
            });
    }

    public resetModule() {
        this.ftsconfiguration.executeAction('reset');
    }

}

