/**
 * @module ObjectFields
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';
import {Router} from "@angular/router";
import {backend} from "../../services/backend.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";
import {model} from "../../services/model.service";

/**
 * renders an icon based on the module filter match/mismatch if defined, otherwise renders the default icon
 */
@Component({
    selector: 'field-icon-condition',
    templateUrl: '../templates/fieldiconcondition.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class fieldIconCondition extends fieldGeneric {
    /**
     * holds the timeout for the setter to be handled
     */
    public setterTimeout: number;
    /**
     * holds the icon name to be rendered
     */
    public icon: string;
    /**
     * holds the title label to be rendered
     */
    public label: string;
    /**
     * holds the color class to be rendered
     */
    public colorClass: 'slds-icon-text-default'|'slds-icon-text-success'|'slds-icon-text-warning'|'slds-icon-text-error'|'slds-icon-text-light' | string = 'slds-icon-text-default';
    /**
     * holds the field config set in the fieldset configuration
     */
    @Input() public fieldconfig: {
        modulefilter?: string,
        icon?: string,
        label?: string,
        size?: 'large' | 'small' | 'x-small' | 'xx-small',
        colorTheme?: 'default' | 'success' | 'warning' | 'error' | 'light',
        matchIcon?: string,
        matchLabel?: string,
        matchColorTheme?: 'default' | 'success' | 'warning' | 'error' | 'light',
        mismatchIcon?: string,
        mismatchLabel?: string,
        mismatchColorTheme?: 'default' | 'success' | 'warning' | 'error' | 'light',
    } = {};

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public router: Router,
                public cdRef: ChangeDetectorRef) {
        super(model, view, language, metadata, router);
        this.subscriptions.add(
            this.subscribeToModelChanges()
        );
    }

    /**
     * call the initialize on the parent and set the local values
     */
    public ngOnInit() {
        super.ngOnInit();
        this.setValues();
    }

    /**
     * subscribe to model data changes the call set values
     * @private
     */
    public subscribeToModelChanges() {
        return this.model.data$.subscribe(() => {
            this.setValues();
        });
    }

    /**
     * set the icon, the color class and the label based on the module filter match
     * @private
     */
    public setValues() {

        window.clearTimeout(this.setterTimeout);

        this.setterTimeout = window.setTimeout(() => {

                if (!this.fieldconfig.modulefilter) {
                    this.icon = this.fieldconfig.icon;
                    this.label = this.fieldconfig.label;
                    if (!!this.fieldconfig.colorTheme) {
                        this.colorClass = 'slds-icon-text-' + this.fieldconfig.colorTheme;
                    }
                } else if (this.model.checkModuleFilterMatch(this.fieldconfig.modulefilter)) {
                    this.icon = this.fieldconfig.matchIcon;
                    this.label = this.fieldconfig.matchLabel;
                    if (!!this.fieldconfig.matchColorTheme) {
                        this.colorClass = 'slds-icon-text-' + this.fieldconfig.matchColorTheme;
                    }
                } else {
                    this.icon = this.fieldconfig.mismatchIcon;
                    this.label = this.fieldconfig.mismatchLabel;
                    if (!!this.fieldconfig.mismatchColorTheme) {
                        this.colorClass = 'slds-icon-text-' + this.fieldconfig.mismatchColorTheme;
                    }
                }
                this.cdRef.detectChanges();
            },
            1000
        );
    }
}
