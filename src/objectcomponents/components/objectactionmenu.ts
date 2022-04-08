/**
 * @module ObjectComponents
 */
import {
    Component,
    ElementRef,
    Renderer2,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    OnInit,
    AfterViewInit, NgZone
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';

import {view} from '../../services/view.service';
import {broadcast} from '../../services/broadcast.service';
import {helper} from '../../services/helper.service';
import {layout} from '../../services/layout.service';
import {ObjectActionContainer} from "./objectactioncontainer";

@Component({
    selector: 'object-action-menu',
    templateUrl: '../templates/objectactionmenu.html',
    providers: [helper]
})
export class ObjectActionMenu extends ObjectActionContainer implements OnInit {

    @Input() public buttonsize: string = '';

    @Input() public actionset: string = '';

    /**
     * an array with the action items.
     */
    public actionitems: any[] = [];

    public componentconfig: any = {};

    constructor(public language: language,
                public broadcast: broadcast,
                public model: model,
                public view: view,
                public metadata: metadata,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public helper: helper,
                public layout: layout,
                public cdRef: ChangeDetectorRef,
                public ngZone: NgZone) {
        super(language, metadata, model,  ngZone, cdRef);
    }

    public ngOnInit() {
        if(this.actionset == "") {
            this.componentconfig = this.metadata.getComponentConfig('ObjectActionMenu', this.model.module);
            this.actionset = this.componentconfig.actionset_default;
            this.setActionsets();
        }
    }

    public ngOnChanges() {
        this.setActionsets();
    }

    public setActionsets() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);
        this.actionitems = [];
        let initial = true;

        for (let actionitem of actionitems) {
            this.actionitems.push({
                disabled: true,
                id: actionitem.id,
                sequence: actionitem.sequence,
                action: actionitem.action,
                component: actionitem.component,
                actionconfig: actionitem.actionconfig
            });
        }

        // trigger Change detection to ensure the changes are renderd if cdref is on push mode on the parent component
        // happens amongst other scenarios in the list view
        this.cdRef.detectChanges();
    }

    get isSmall() {
        return this.layout.screenwidth == 'small';
    }

    get hasNoActions() {
        // because of custom actions can't be checked if they are enabled... return false
        if (this.actionitems.length > 0) return false;

        return true;
    }

    public getButtonSizeClass() {
        if (this.buttonsize !== '') {
            return 'slds-button--icon-' + this.buttonsize;
        }
    }
}
