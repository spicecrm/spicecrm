/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {language} from "../../services/language.service";

/**
 * a collapsible section. the content is rendere as <ng-content> in the template
 */
@Component({
    selector: "system-section",
    templateUrl: "../templates/systemsection.html"
})
export class SystemSection {

    /**
     * a label to be used as title e.g. 'LBL_DETAILS'. this is rendered translated in teh current selected language
     */
    @Input() public titlelabel: string = "";

    /**
     * set if the panel shoudd be expanded or collabpesd by default
     */
    @Input() public expanded: boolean = true;

    /**
     * set if the panel should be always expanded (not shrinkable)
     */
    @Input() public alwaysExpanded = false;

    /**
     * an event emitter to toggle if we expand or collapse
     */
    @Output() public toggleExpanded: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public language: language) {

    }

    /**
     * toggles the panel open or closed
     */
    public togglePanel() {
        this.expanded = !this.expanded;
        // emit the expanded state
        this.toggleExpanded.emit(this.expanded);
    }

    /**
     * get the proper style for the tab if collaped or not
     */
    public getTabStyle() {
        if(!this.expanded) {
            return {
                height: "0px",
                transform: "rotateX(90deg)"
            };
        }
    }
}
