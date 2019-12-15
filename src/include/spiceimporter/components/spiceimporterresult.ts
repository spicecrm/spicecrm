/**
 * @module SpiceImporterModule
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {configurationService} from '../../../services/configuration.service';
import {session} from '../../../services/session.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';

import {SpiceImporterService} from '../services/spiceimporter.service';

@Component({
    selector: 'spice-importer-result',
    templateUrl: './src/include/spiceimporter/templates/spiceimporterresult.html',
    styles: [
        ':host {height: 100%;}'
    ]
})
export class SpiceImporterResult {
    @ViewChild('fileupload', {read: ViewContainerRef, static: true}) private fileupload: ViewContainerRef;

    constructor(
        private spiceImport: SpiceImporterService,
        private toast: toast,
        private language: language,
        private session: session,
        private configurationService: configurationService,
        private model: model,
        private router: Router
    ) {
    }

    private goToRecord(id) {
        this.router.navigate([`/module/${this.model.module}/${id}`]);
    }

}
