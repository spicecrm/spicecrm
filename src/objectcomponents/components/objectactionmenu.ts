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
    templateUrl: './src/objectcomponents/templates/objectactionmenu.html',
    providers: [helper]
})
export class ObjectActionMenu extends ObjectActionContainer implements OnInit {

    @Input() private buttonsize: string = '';

    @Input() public actionset: string = '';
    /**
     * an array with the action items.
     */
    public actionitems: any[] = [];

    public componentconfig: any = {};

    constructor(public language: language,
                private broadcast: broadcast,
                public model: model,
                private view: view,
                public metadata: metadata,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private helper: helper,
                private layout: layout,
                public ngZone: NgZone) {
        super(language, metadata, model,  ngZone);
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
    }

    get isSmall() {
        return this.layout.screenwidth == 'small';
    }

    get hasNoActions() {
        // because of custom actions can't be checked if they are enabled... return false
        if (this.actionitems.length > 0) return false;

        return true;
    }

    private getButtonSizeClass() {
        if (this.buttonsize !== '') {
            return 'slds-button--icon-' + this.buttonsize;
        }
    }
}
