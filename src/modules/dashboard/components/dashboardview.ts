import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ElementRef,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    OnDestroy, OnChanges
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    selector: 'dashboard-view',
    templateUrl: './src/modules/dashboard/templates/dashboardview.html',
    providers: [model, modellist]
})
export class DashboardView implements OnInit {

    @ViewChild('dashboardcontainer', {read: ViewContainerRef}) dashboardcontainer: ViewContainerRef;

    currentDashboard: string = '';
    currentComponent: any = null;

    dashboardFilter: string = '';

    constructor(private metadata: metadata, private userpreferences: userpreferences, private navigation: navigation, private language: language, private renderer: Renderer2, private elementRef: ElementRef, private model: model, private modellist: modellist) {

    }

    ngOnInit() {
        let lastDashboard = this.userpreferences.getPreference('last_dashboard');
        if (lastDashboard)
            this.currentDashboard = lastDashboard;

        this.model.module = 'Dashboards';
        this.modellist.module = 'Dashboards';
        this.modellist.getListData(['name', 'global']).subscribe(listdata => {
            if (this.currentDashboard) {
                this.modellist.listData.list.some(dashboard => {
                    if (dashboard.id == this.currentDashboard) {
                        this.metadata.addComponent('DashboardContainer', this.dashboardcontainer).subscribe(component => {
                            this.currentComponent = component;
                            component.instance['dashboardid'] = this.currentDashboard;
                            component.instance['editable'] = true;
                        })
                        return true;
                    }
                })
            }
        });

        this.navigation.setActiveModule('Dashbords');
    }

    get dashboards(): Array<any> {
        let dashboards: Array<any> = [];
        for (let dashboard of this.modellist.listData.list) {
            if (dashboard.id == this.currentDashboard || this.dashboardFilter == '' || (this.dashboardFilter != '' && dashboard.name.toLowerCase().indexOf(this.dashboardFilter.toLowerCase()) != -1)) {
                dashboards.push(dashboard);
            }
        }
        return dashboards;
    }

    get viewStyle() {
        return {
            height: 'calc(100vh - ' + this.elementRef.nativeElement.getBoundingClientRect().top + 'px)'
        };
    }

    getActiveClass(id) {
        return id == this.currentDashboard ? 'slds-is-active' : '';
    }

    setDashboard(id) {
        this.currentDashboard = id;

        // save the preference
        this.userpreferences.setPreference('last_dashboard', id);

        if (this.currentComponent)
            this.currentComponent.destroy();

        this.metadata.addComponent('DashboardContainer', this.dashboardcontainer).subscribe(component => {
            this.currentComponent = component;
            component.instance['dashboardid'] = id;
            component.instance['editable'] = true;
        })

    }

    addDashboard() {
        this.model.module = 'Dashboards';
        this.model.addModel();
    }

}