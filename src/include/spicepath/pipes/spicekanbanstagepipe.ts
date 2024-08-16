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

    public transform(values, stage, stages: any[]) {
        let retValues = [];
        let stageData = this.getStageData(stage, stages);
        for (let value of values) {
            if (value[stageData.statusfield] && value[stageData.statusfield] == stage) {
                retValues.push(value);
            }
        }
        return retValues;
    }


    public getStageData(stage, stages): any {
        let stagedata = [];
        stages.some(thisStage => {
            if (stage == thisStage.stage) {
                stagedata = thisStage.stagedata;
                return;
            }
        });
        return stagedata;
    }

}
