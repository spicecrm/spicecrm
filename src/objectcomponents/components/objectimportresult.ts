import {Component, ViewChild, ViewContainerRef, Renderer} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';

import {objectimport} from '../services/objectimport.service';

@Component({
    selector: 'object-import-result',
    templateUrl: './src/objectcomponents/templates/objectimportresult.html',
    styles: [
        ':host {height: 100%;}'
    ]
})
export class ObjectImportResult {
    @ViewChild('fileupload', {read: ViewContainerRef}) fileupload: ViewContainerRef;

    showErrorModal: boolean = false;
    theProgress: number = 0;


    constructor(
        private objectimport: objectimport,
        private toast: toast,
        private language: language,
        private session: session,
        private configurationService: configurationService,
        private model: model,
        private renderer: Renderer,
        private router: Router
    ) {}

    goToRecord(id){
        this.router.navigate([`/module/${this.model.module}/${id}`]);
    }

}
