import { Component, Input } from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    templateUrl: './src/workbench/templates/crmlogviewermodal.html',
})
export class CRMLogViewerModal {

    @Input() date = '';
    @Input() time = '';
    @Input() processId = '';
    @Input() username = '';
    @Input() level = '';
    @Input() text = '';
    private self;

    constructor( private language: language ) { }

    private close() {
        this.self.destroy();
    }

}
