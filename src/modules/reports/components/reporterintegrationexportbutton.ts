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
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

/**
 * buttons group to render the report integration plugin action items
 */
@Component({
    selector: 'reporter-integration-export-button',
    templateUrl: '../templates/reporterintegrationexportbutton.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterIntegrationExportButton implements OnChanges, AfterViewInit {
    /**
     * container reference to render the action items inside
     */
    @ViewChild('actionItemsContainer', {
        read: ViewContainerRef,
        static: true
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
                public metadata: metadata,
                public model: model) {
    }

    /**
     * return disabled if there is no active plugins or user has no permission to export
     */
    get isDisabled() {
        if (!this.model.checkAccess('export')) return false;

        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                if (!this.integrationParams.activePlugins.hasOwnProperty(plugin)) continue;
                // check if the plugin is active
                if (this.integrationParams.activePlugins[plugin] != 1) continue;

                switch (plugin) {
                    case 'ktargetlistexport':
                    case 'kcsvexport':
                    case 'kexcelexport':
                    case 'kpdfexport':
                    case 'kplannerexport':
                        if (this.integrationParams.activePlugins[plugin] == 1) return false;
                }
            }
        }

        return true;
    }

    /**
     * render the action items
     */
    public ngAfterViewInit() {
        this.renderActionItems();
    }

    /**
     * render the action items
     */
    public ngOnChanges() {
        this.renderActionItems();
    }

    /**
     * rerender the action items and push the component reference to array
     */
    public renderActionItems() {
        this.actionComponentRefs.forEach(ref => ref.destroy());
        this.actionComponentRefs = [];

        if (!this.integrationParams.activePlugins) return;

        for (let plugin in this.integrationParams.activePlugins) {

            // check if the plugin is active
            if (!this.integrationParams.activePlugins.hasOwnProperty(plugin) || this.integrationParams.activePlugins[plugin] != 1) continue;

            switch (plugin) {
                case 'ktargetlistexport':
                    if (this.integrationParams.activePlugins.ktargetlistexport == 1) {
                        this.renderActionItem('ReporterIntegrationTargetlistexportButton');
                    }
                    break;
                case 'kcsvexport':
                    if (this.integrationParams.activePlugins.kcsvexport == 1) {
                        this.renderActionItem('ReporterIntegrationCSVexportButton');
                    }
                    break;
                case 'kexcelexport':
                    if (this.integrationParams.activePlugins.kexcelexport == 1) {
                        this.renderActionItem('ReporterIntegrationXLSexportButton');
                    }
                    break;
                case 'kpdfexport':
                    if (this.integrationParams.activePlugins.kpdfexport == 1) {
                        this.renderActionItem('ReporterIntegrationPDFexportButton');
                    }

                    break;
                case 'kplannerexport':
                    if (this.integrationParams.activePlugins.kplannerexport == 1) {
                        this.renderActionItem('SalesPlanningReporterIntegrationExportButton');
                    }
                    break;
            }
        }
    }

    /**
     * render action item component by metadata service
     * @param componentName
     */
    public renderActionItem(componentName) {
        this.metadata.addComponent(componentName, this.actionItemsContainer).subscribe(object => {
            this.actionComponentRefs.push(object);
        });
    }
}
