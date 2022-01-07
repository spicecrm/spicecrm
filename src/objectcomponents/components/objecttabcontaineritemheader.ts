/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
    ViewContainerRef, OnDestroy, OnInit, EventEmitter, Output
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

/**
 * renders the tab header. Depending on the configuration this is either a simple label or can be a component that is rendered.
 * The component can render information on the tab itself
 */
@Component({
    selector: 'object-tab-container-item-header',
    templateUrl: '../templates/objecttabcontaineritemheader.html'
})
export class ObjectTabContainerItemHeader{

    /**
     * the inpout from teh tab embedding the header
     */
    @Input() public tab: any = [];

    constructor(public metadata: metadata, public language: language) {

    }

    /**
     * returns the name for the tab if no component is rendered
     */
    get displayName() {
        return !this.tab.headercomponent && this.tab.name && this.tab.name != '';
    }

}

