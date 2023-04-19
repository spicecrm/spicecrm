/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {reporterconfig} from "../services/reporterconfig";
import {Subject} from "rxjs";

@Component({
    selector: 'reporter-presentation-container',
    templateUrl: '../templates/reporterpresentationcontainer.html',
    providers: [reporterconfig]
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

    /**
     * emits info whether reload button was clicked
     */
    public refreshReport: Subject<boolean> = new Subject<boolean>();

    constructor(public model: model,
                public language: language,
                public reporterconfig: reporterconfig) {
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

    /**
     * reloading ReporterPresentationDashlet
     */
    public execute() {
        this.refreshReport.next(true);
    }
}
