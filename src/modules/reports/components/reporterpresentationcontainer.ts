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
    templateUrl: '../templates/reporterpresentationcontainer.html'
})
export class ReporterPresentationContainer {

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * holds the title as emitted fromt eh container
     */
    public dashletTitle: string;

    /**
     * status to have the component hidden
     */
    public isHidden: boolean = false;

    constructor(public model: model, public language: language) {
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
    public noAccess(event) {
        this.isHidden = event;
    }
}
