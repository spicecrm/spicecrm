import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './src/modules/reports/templates/reporternewbutton.html'
})

export class ReporterNewButton {

    constructor(private language: language,
                private router: Router) {
    }
    /*
    *navigate to designer
    */
    public execute() {
        this.router.navigate(['/module/KReports/designer/new']);
    }
}
