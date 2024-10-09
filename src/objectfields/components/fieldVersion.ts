import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {fieldGeneric} from "./fieldgeneric";
import {Router} from "@angular/router";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {configurationService} from "../../services/configuration.service";

import _ from "underscore";

@Component({
    selector: 'field-version',
    templateUrl: '../templates/fieldversion.html',
    providers: [model]
})

/**
 * displays value of release version
 */
export class fieldVersion extends fieldGeneric implements OnInit {

    /**
     * holds currently selected version
     */
    @Input() version: string = '';

    /**
     * emit selected version
     */
    @Output() public versionSelected: EventEmitter<any> = new EventEmitter<any>();

    /**
     * holds all versions
     */
    public versions: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public configuration: configurationService,
        public cdRef: ChangeDetectorRef) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.loadVersions();
    }

    /**
     * load versions from cache
     * @private
     */
    private loadVersions() {
        this.versions = _.toArray(this.configuration.getData('domainvalidations')['spicecrmversion_dom']?.validationvalues);
    }

    /**
     * select version to be emitted
     * @param version
     */
    public selectVersion(version: any) {
        this.versionSelected.emit(version);
    }
}