import {Component, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import moment from "moment";

@Component({
    selector: 'kpi-history',
    templateUrl: '../templates/kpihistory.html'
})

export class KPIHistory implements OnInit {


    /**
     * loading indicator
     */
    public loading: boolean = true;

    /**
     * id of KPI related to KPITarget
     */
    public history: any[] = [];


    constructor(
        public model: model,
        private backend: backend
    ) {
    }

    ngOnInit() {
        this.loadKPIHistory()
    }

    /**
     * retrieves KPITargets for the User
     */
    public loadKPIHistory() {
        this.loading = true;
        this.backend.getRequest(`module/KPITargets/${this.model.id}/gethistory`).subscribe({
            next: (data) => {
                this.history = data.map(h => {
                    return {
                        date_entered: moment(h.date_entered).format('D.M.'),
                        kpi_value: h.kpi_value
                    }
                });
                this.loading = false;
            }, error: () => {

                this.loading = false;
            }
        });
    }

}