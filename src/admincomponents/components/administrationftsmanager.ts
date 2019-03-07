/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';




@Component({
    selector: '[administration-ftsmanager]',
    templateUrl: './src/admincomponents/templates/administrationftsmanager.html',
    providers: [ftsconfiguration]
})
export class AdministrationFTSManager {

    activeTab: string = 'fields';
    selected_module;

    constructor(
        private metadata: metadata,
        private language: language,
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

    setActiveTab(tab){
        this.activeTab = tab;
    }

    save(){
        this.ftsconfiguration.save();
    }

    putIndex(){
        this.ftsconfiguration.putMapping();
    }

    indexModule(){
        this.ftsconfiguration.indexModule();
    }
    resetModule(){
        this.ftsconfiguration.resetModule();
    }

    initialize(){
        if(confirm("Are you sure you want to initialize your FTS? It recreates new indices, so indexed data will be lost and have to be rebuild!")) {
            this.ftsconfiguration.initialize();
        }
    }

}

