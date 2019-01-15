import {
    Component,
    OnInit, ElementRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {dashboardlayout} from '../services/dashboardlayout.service';

@Component({
    selector: 'dashboard-view',
    templateUrl: './src/modules/dashboard/templates/dashboardview.html',
    providers: [model, modellist, dashboardlayout]
})
export class DashboardView implements OnInit {

    private panelwidth = 250;
    private showpanel: boolean = false;

    constructor(private navigation: navigation, private language: language, private dashboardlayout: dashboardlayout, private userpreferences: userpreferences, private model: model, private modellist: modellist, private elementRef: ElementRef) {

    }

    public ngOnInit() {
        // load for the selector
        let lastDashboard = this.userpreferences.getPreference('last_dashboard');
        this.model.module = 'Dashboards';
        this.modellist.module = 'Dashboards';
        this.modellist.getListData(['name', 'global']).subscribe(listdata => {
            if (lastDashboard) {
                this.modellist.listData.list.some(dashboard => {
                    if (dashboard.id == lastDashboard) {
                        this.dashboardlayout.loadDashboard(lastDashboard);
                        return true;
                    }
                });
            }
        });

        this.navigation.setActiveModule('Dashbords');
    }

    get ismobile() {
        return window.innerWidth < 1024;
    }

    get dashboardstyle() {
        return {
            width: 'calc(100% - ' + (this.ismobile ? 0 : this.panelwidth) + 'px)'
        };
    }

    private tooglepanel() {
        this.showpanel = !this.showpanel;
    }

    get panelstyle() {
        return {
            'width': this.panelwidth + 'px',
            'z-index': 1,
            'left': this.ismobile && !this.showpanel ? '-250px' : '0px'
        };
    }
}
