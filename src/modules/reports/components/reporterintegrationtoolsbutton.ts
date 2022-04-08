/**
 * @module ModuleReports
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

/**
 * buttons group to render the report integration tools plugin action items
 */
@Component({
    selector: 'reporter-integration-tools-button',
    templateUrl: '../templates/reporterintegrationtoolsbutton.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterIntegrationToolsButton implements OnChanges, AfterViewInit {
    /**
     * container reference to render the action items inside
     */
    @ViewChild('actionItemsContainer', {
        read: ViewContainerRef,
        static: false
    }) public actionItemsContainer: ViewContainerRef;
    /**
     * integration params of the report to handle the plugins
     */
    @Input() public integrationParams: any = {};
    /**
     * to save the action component references
     */
    public actionComponentRefs: any[] = [];

    constructor(public language: language,
                public metadata: metadata) {
    }

    /**
     * return disabled if there is no active plugins or user has no permission to export
     */
    get isDisabled() {
        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                if (!this.integrationParams.activePlugins.hasOwnProperty(plugin)) continue;
                switch (plugin) {
                    case 'kqueryanalizer':
                        if (this.integrationParams.activePlugins.kqueryanalizer == 1) return false;
                }
            }
        }

        return true;
    }

    /**
     * render the action items
     */
    public ngOnChanges() {
        this.renderActionItems();
    }

    /**
     * render the action items
     */
    public ngAfterViewInit() {
        this.renderActionItems();
    }

    /**
     * rerender the action items and push the component reference to array
     */
    public renderActionItems() {
        this.actionComponentRefs.forEach(ref => ref.destroy());
        this.actionComponentRefs = [];

        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                if (!this.integrationParams.activePlugins.hasOwnProperty(plugin)) continue;

                switch (plugin) {
                    case 'kqueryanalizer':
                        if (this.integrationParams.activePlugins.kqueryanalizer == 1) {
                            this.metadata.addComponent('ReporterIntegrationQueryanalyzerButton', this.actionItemsContainer).subscribe(object => {
                                this.actionComponentRefs.push(object);
                            });
                        }
                        break;
                }
            }
        }

    }
}
