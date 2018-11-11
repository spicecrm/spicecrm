import {Component, Input} from "@angular/core";
import {language} from "../../services/language.service";

@Component({
    selector: "system-section",
    templateUrl: "./src/systemcomponents/templates/systemsection.html"
})
export class SystemSection {

    @Input() private titlelabel: string = "";
    @Input() private expanded: boolean = true;

    constructor(private language: language) {

    }

    private togglePanel() {
        this.expanded = !this.expanded;
    }

    private getTabStyle() {
        if(!this.expanded) {
            return {
                height: "0px",
                transform: "rotateX(90deg)"
            };
        }
    }
}
