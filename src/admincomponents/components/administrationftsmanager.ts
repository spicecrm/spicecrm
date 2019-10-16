/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {modal} from "../../services/modal.service";




@Component({
    selector: '[administration-ftsmanager]',
    templateUrl: './src/admincomponents/templates/administrationftsmanager.html',
    providers: [ftsconfiguration]
})
export class AdministrationFTSManager {

    public activeTab: string = 'fields';
    public selected_module;

    constructor(
        private metadata: metadata,
        private language: language,
        private modal: modal,
        private ftsconfiguration: ftsconfiguration
    ) {

    }

    get modules() {
        return this.metadata.getModules().sort();
    }

    get module(){
        return this.ftsconfiguration.module;
    }

    set module(module){
        this.ftsconfiguration.setModule(module);
    }

    public setActiveTab(tab){
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

    public initialize() {
        this.modal
            .confirm('Are you sure you want to initialize your FTS? It recreates new indices, so indexed data will be lost and have to be rebuild!', 'Initialize')
            .subscribe(res => {
                if (res) {
                    this.ftsconfiguration.executeAction('init');
                }
            });
    }

}

