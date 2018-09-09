import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ElementRef,
    Renderer,
    ViewChild,
    ViewContainerRef,
    OnDestroy, OnChanges
} from '@angular/core';

import {Router}   from '@angular/router';

import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';
import {dashboardlayout} from '../services/dashboardlayout.service';


@Component({
    selector: 'dashboard-container-homeheader',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerhomeheader.html',
})
export class DashboardContainerHomeHeader  {

    @Input() dashboardid: string = '';

    constructor(private dashboardlayout: dashboardlayout, private language: language, private renderer: Renderer, private elementRef: ElementRef, private router: Router) {
    }

    get dashboardname(){
        return this.dashboardlayout.model.getFieldValue('name');
    }

    goDashboards(){
        this.router.navigate(['/module/Dashboards']);
    }
}