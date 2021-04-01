/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleDashboard
 */
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';
import {Router} from "@angular/router";
import {view} from "../../../services/view.service";

@Component({
    selector: 'dashboard-container',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainer.html',
    providers: [model, view, dashboardlayout]
})
export class DashboardContainer implements OnChanges {

    @Input() private dashboardid: string = '';
    @Input() private context: string = 'Dashboard';

    constructor(private dashboardlayout: dashboardlayout, private language: language, private router: Router, private model: model) {
    }

    public loadDashboard() {
        if (this.dashboardid != this.dashboardlayout.dashboardId) {
            this.model.initialize();
            this.model.module = 'Dashboards';
            this.dashboardlayout.dashboardId = this.dashboardid;
            this.model.id = this.dashboardid;

            this.dashboardlayout.dashboardElements = [];
            this.dashboardlayout.dashboardNotFound = false;

            this.model.getData(false)
                .subscribe(() => {
                    this.dashboardlayout.dashboardElements = this.model.getField('components');

                    // sort the elements for the compact view
                    this.dashboardlayout.sortElements();

                }, err => {if (err.status == 404) this.dashboardlayout.dashboardNotFound = true;});
        }
    }

    public ngOnInit() {
        this.loadDashboard();
    }

    public ngOnChanges() {
        this.loadDashboard();
    }

    private navigate() {
        this.router.navigate(['/module/Dashboards']);
    }
}
