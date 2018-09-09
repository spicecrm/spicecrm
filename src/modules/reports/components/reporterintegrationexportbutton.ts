import {
    Component,
    Input,
    OnInit,
    OnChanges,
    OnDestroy,
    Renderer2,
    ElementRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-integration-export-button',
    templateUrl: './app/modules/reports/templates/reporterintegrationexportbutton.html'
})
export class ReporterIntegrationExportButton implements OnChanges, OnDestroy {

    @ViewChild('actionitems', {read: ViewContainerRef}) actionitems: ViewContainerRef;

    @Input() integrationParams: any = {};

    clickListener: any;
    opened: boolean = false;
    actionComponents: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private model: model, private footer: footer, private reporterconfig: reporterconfig, private renderer: Renderer2, private elementRef: ElementRef) {
    }

    ngOnChanges() {
        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                switch (plugin) {
                    case 'ktargetlistexport':
                        this.metadata.addComponent('ReporterIntegrationTargetlistexportButton', this.actionitems).subscribe(object => {
                            this.actionComponents.push(object);
                        })
                        break;
                    case 'kcsvexport':
                        this.metadata.addComponent('ReporterIntegrationCSVexportButton', this.actionitems).subscribe(object => {
                            this.actionComponents.push(object);
                        })
                        break;
                    case 'kexcelexport':
                        this.metadata.addComponent('ReporterIntegrationXLSexportButton', this.actionitems).subscribe(object => {
                            this.actionComponents.push(object);
                        })
                        break;
                    case 'kpdfexport':
                        this.metadata.addComponent('ReporterIntegrationPDFexportButton', this.actionitems).subscribe(object => {
                            this.actionComponents.push(object);
                        })
                        break;
                }
            }
        }
    }

    ngOnDestroy() {
        if (this.clickListener)
            this.clickListener();
    }

    get isDisabled() {
        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                switch (plugin) {
                    case 'ktargetlistexport':
                    case 'kcsvexport':
                    case 'kexcelexport':
                    case 'kpdfexport':
                        return false;
                }
            }
        }

        return true;
    }

    toggleOpen() {
        this.opened = !this.opened;

        if (this.opened) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }

    public onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.opened = false;
            this.clickListener();
        }
    }
}