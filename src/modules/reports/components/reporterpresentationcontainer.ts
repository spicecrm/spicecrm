/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'reporter-presentation-container',
    templateUrl: './src/modules/reports/templates/reporterpresentationcontainer.html'
})
export class ReporterPresentationContainer {

    public componentconfig: any = {};

    constructor(private model: model, private language: language) {
    }

    get title() {
        return this.componentconfig.title ? this.language.getLabel(this.componentconfig.title) : this.language.getModuleName('KReports');
    }

}
