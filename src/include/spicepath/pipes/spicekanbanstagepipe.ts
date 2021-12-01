/**
 * @module ModuleSpicePath
 */
import {
    Pipe
} from '@angular/core';
import {modellist} from '../../../services/modellist.service';
import {configurationService} from '../../../services/configuration.service';


@Pipe({name: 'spicekanbanstagepipe', pure: false})
export class SpiceKanbanStagePipe {
    constructor(public configuration: configurationService, public modellist: modellist) {
    }

    public transform(values, stage) {
        let retValues = [];
        let stageData = this.getStageData(stage);
        for (let value of values) {
            if (value[stageData.statusfield] && value[stageData.statusfield] == stage) {
                retValues.push(value);
            }
        }
        return retValues;
    }


    get stages() {
        return this.configuration.getData('spicebeanguides') ? this.configuration.getData('spicebeanguides')[this.modellist.module].stages : [];
    }

    public getStageData(stage): any {
        let stagedata = [];
        this.stages.some(thisStage => {
            if (stage == thisStage.stage) {
                stagedata = thisStage.stagedata;
                return;
            }
        });
        return stagedata;
    }

}
