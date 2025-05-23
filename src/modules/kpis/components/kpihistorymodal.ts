import {Component} from '@angular/core';

@Component({
    selector: 'kpi-history-modal',
    templateUrl: '../templates/kpihistorymodal.html',
    standalone: false
})

export class KPIHistoryModal {

    /**
     * reference to the modal
     */
    public self: any;


    public close(){
        this.self.destroy();
    }


}