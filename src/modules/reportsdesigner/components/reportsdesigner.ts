/**
 * @module ModuleReportsDesigner
 */
import {ChangeDetectorRef, Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {reporterconfig} from "../../reports/services/reporterconfig";

@Component({
    selector: 'reports-designer',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesigner.html',
    providers: [ReportsDesignerService, reporterconfig]
})
export class ReportsDesigner {

    private activeTab: string = 'manipulate';

    constructor(private language: language,
                private cdr: ChangeDetectorRef,
                private reportsDesignerService: ReportsDesignerService) {
    }

    /*
    * force detect changes to prevent angular change detection error
    */
    public ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    /*
    * @set activeTab
    */
    private setActiveTab(tab) {
        this.activeTab = tab;
    }

}
