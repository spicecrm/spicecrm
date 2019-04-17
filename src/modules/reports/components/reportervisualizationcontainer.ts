/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';

@Component({
    selector: 'reporter-visualization-container',
    templateUrl: './src/modules/reports/templates/reportervisualizationcontainer.html',
    styles:[
        ':host {width:100%; height: 300px;}'
    ]
})
export class ReporterVisualizationContainer {

    public componentconfig: any = {};

    constructor(private model: model) {
    }

}
