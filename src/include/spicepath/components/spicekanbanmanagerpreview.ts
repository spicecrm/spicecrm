import {Component} from '@angular/core';

import {modellist} from '../../../services/modellist.service';
import {KanbanManagerService} from "../services/kanbanmanager.service";

@Component({
    selector: 'spice-kanban-manager-preview',
    templateUrl: '../templates/spicekanbanmanagerpreview.html',
    providers: [modellist]
})

export class SpiceKanbanManagerPreview{

    public constructor(public modellist: modellist, public kanbanManagerService: KanbanManagerService) {
    }
    /**
     * returns the name for the stage to be displayed
     *
     * @param stagedata
     */
    // public getStageLabel(stagedata) {
    //     if (stagedata.stage_label) {
    //         return stagedata.stage_label;
    //     } else {
    //         return stagedata.stage_name;
    //     }
    // }

    /**
     * Get active stages
     */
    get active(){
        return this.kanbanManagerService.stages
            .filter(dis=>dis.not_in_kanban == 0 && dis.spicebeanguide_id == this.kanbanManagerService.selectedBeanGuide.id);
    }



}
