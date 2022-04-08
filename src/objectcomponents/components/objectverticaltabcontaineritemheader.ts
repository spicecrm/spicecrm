/**
 * @module ObjectComponents
 */
import {
    Component,
    Input
} from '@angular/core';
import {language} from '../../services/language.service';

/**
 * a simple component to render the tab item header
 */
@Component({
    selector: 'object-vertical-tab-container-item-header',
    templateUrl: '../templates/objectverticaltabcontaineritemheader.html'
})
export class ObjectVerticalTabContainerItemHeader {

    /**
     * the tab to be rendered
     */
    @Input() public tab: any = [];

    constructor(public language: language) {}

    /**
     * simple getter if the name is to be displayed
     */
    get displayName() {
        return this.tab.name && this.tab.name != '';
    }
}

