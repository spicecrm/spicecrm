import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {libloader} from '../../../services/libloader.service';

declare var google: any;

/**
 * gets the statistics of a mailing / campaigntask
 */
@Component({
    templateUrl: './src/include/cleverreach/templates/mailingstatspanel.html',
})
export class MailingStatsPanel implements OnInit {
    public mailingStats: any = {};
    private isLoading: boolean = false;
    private chart: any;
    private options: {};
    public data: any;
    private res: any[] = [];


    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private backend: backend,
        private libloader: libloader
    ) {

    }

    /**
     * reloads mailing activity from backend
     */

    public reloadData() {
        this.isLoading = true;
        this.backend.getRequest(`/CleverReach/CampaignTasks/${this.model.id}/stats`)
            .subscribe(response => {
                this.mailingStats = response;
                this.isLoading = false;
            });
    }

    // public drawChart() {
    //     this.isLoading = true;
    //     this.backend.getRequest(`/CleverReach/CampaignTasks/${this.model.id}/stats`)
    //         .subscribe(response => {
    //             this.mailingStats = response.basic;
    //             for (let i in this.mailingStats) {
    //                 this.res.push([i, this.mailingStats [i]]);
    //             }
    //             this.data = new google.visualization.DataTable();
    //             this.data.addColumn('string', 'Metric');
    //             this.data.addColumn('number', 'Value');
    //             this.data.addRows(this.res);
    //             window.console.log(this.data);
    //             this.chart = new google.visualization.PieChart(document.getElementById('piechart'));
    //             this.options = {
    //                 pieHole: 0.4,
    //             };
    //             this.chart.draw(this.data, this.options);
    //             this.isLoading = false;
    //         });
    // }

    /**
     * loads mailing activity from backend when the application first starts
     */

    public ngOnInit(): void {
        this.backend.getRequest(`/CleverReach/CampaignTasks/${this.model.id}/stats`)
        .subscribe(response => {
            this.mailingStats = response;
            this.isLoading = false;
        });
        // this.libloader.loadLib('googlecharts').subscribe((next) => {
        //     google.charts.load('current', {packages: ['corechart']});
        //     google.charts.setOnLoadCallback(() => {
        //         this.drawChart();
        //     });
        // });

    }

}


