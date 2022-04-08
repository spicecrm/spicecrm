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
    templateUrl: '../templates/spiceimporterresult.html',
    styles: [
        ':host {height: 100%;}'
    ]
})
export class SpiceImporterResult {
    @ViewChild('fileupload', {read: ViewContainerRef, static: true}) public fileupload: ViewContainerRef;

    constructor(
        public spiceImport: SpiceImporterService,
        public toast: toast,
        public language: language,
        public session: session,
        public configurationService: configurationService,
        public model: model,
        public router: Router
    ) {
    }

    public goToRecord(id) {
        this.router.navigate([`/module/${this.model.module}/${id}`]);
    }

}
