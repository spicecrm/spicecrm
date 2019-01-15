import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';

@Component({
    selector: 'dashboard-container',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainer.html',
    providers: [model, dashboardlayout]
})
export class DashboardContainer implements OnChanges, OnInit {

    @Input() dashboardid: string = '';
    @Input() context: string = 'Dashboard';

    constructor(private dashboardlayout: dashboardlayout, private language: language) {
    }


    public ngOnInit(): void {
        this.dashboardlayout.loadDashboard(this.dashboardid);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.dashboardlayout.loadDashboard(this.dashboardid);
    }
}