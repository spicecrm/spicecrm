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
    selector: 'field-package',
    templateUrl: '../templates/fieldpackage.html',
    providers: [model]
})

/**
 * displays value of a package
 */
export class fieldPackage extends fieldGeneric implements OnInit {

    /**
     * holds currently selected package
     */
    @Input() package: string = '';

    /**
     * emit selected package
     */
    @Output() public packageSelected: EventEmitter<any> = new EventEmitter<any>();

    /**
     * holds all packages
     */
    public packages: any[] = [];

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
        this.loadPackages();
    }

    /**
     * load packages from cache
     * @private
     */
    private loadPackages() {
        this.packages = _.toArray(this.configuration.getData('domainvalidations')['spicecrmpackage_dom']?.validationvalues);
    }

    /**
     * select package to be emitted
     * @param packageData
     */
    public selectPackage(packageData: any) {
        this.packageSelected.emit(packageData);
    }
}