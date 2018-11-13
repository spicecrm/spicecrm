import {Component, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-action-import-button',
    templateUrl: './src/objectcomponents/templates/objectactionimportbutton.html'
})
export class ObjectActionImportButton implements OnInit {

    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router) {

    }

    public ngOnInit() {
        this.disabled = this.metadata.checkModuleAcl(this.model.module, 'import') ? false : true;
    }

    public execute() {
        this.router.navigate(['/module/' + this.model.module + '/import']);
    }

}
