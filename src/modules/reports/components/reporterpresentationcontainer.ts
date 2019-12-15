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

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * holds the title as emitted fromt eh container
     */
    private dashletTitle: string;

    /**
     * status to have the component hidden
     */
    private isHidden: boolean = false;

    constructor(private model: model, private language: language) {
    }

    /**
     * a simple getter that either returns the module name or the name of the report once emited from the container
     */
    get title() {
        return this.dashletTitle ? this.dashletTitle : this.language.getModuleName('KReports');
    }

    /**
     * called when the container canot load the report
     * @param event
     */
    private noAccess(event) {
        this.isHidden = event;
    }
}
