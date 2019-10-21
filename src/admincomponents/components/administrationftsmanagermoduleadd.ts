/**
 * @module AdminComponentsModule
 */
import {Component, EventEmitter, OnInit} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {fts} from "../../services/fts.service";

@Component({
    templateUrl: './src/admincomponents/templates/administrationftsmanagermoduleadd.html'
})
export class AdministrationFTSManagerModuleAdd implements OnInit {

    /**
     * reference to self
     */
    public self: any;

    /**
     * the modules that can be added
     */
    private modules: any[] = [];

    /**
     * the module selected
     */
    private module: string = '';

    /**
     * Event Emtitter for the selected module
     */
    public module$: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata,
                private language: language,
                private ftsconfiguration: ftsconfiguration) {
    }

    /**
     * initializes and diffs the modules from metadata with the ones that already hav an fts configuration
     */
    public ngOnInit(): void {
        let ftsModules = this.ftsconfiguration.modules;
        let allModules = this.metadata.getModules();

        for (let module of allModules) {
            if (ftsModules.indexOf(module) == -1) this.modules.push(module);
        }

        this.modules.sort();
    }

    /**
     * adds teh selected module
     */
    private add() {
        this.module$.emit(this.module);
        this.self.destroy();
    }

    /**
     * closes the modal
     */
    private close() {
        this.module$.emit(false);
        this.self.destroy();
    }

}

