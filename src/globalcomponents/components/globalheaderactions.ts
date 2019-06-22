/**
 * @module GlobalComponents
 */
import {AfterViewInit, Component, ViewChild, ViewContainerRef, Renderer2, ElementRef} from '@angular/core';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'global-header-actions',
    templateUrl: './src/globalcomponents/templates/globalheaderactions.html'
})
export class GlobalHeaderActions implements AfterViewInit {

    @ViewChild('actioncontainerheader', {read: ViewContainerRef, static: true}) private actioncontainerheader: ViewContainerRef;

    private isOpen: boolean = false;
    private clickListener: any;

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private session: session, private metadata: metadata, private language: language) {

    }

    public ngAfterViewInit() {
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderActions');
        if (componentconfig && componentconfig.actionset) {
            let actionsetitems = this.metadata.getActionSetItems(componentconfig.actionset);
            for (let actionsetitem of actionsetitems) {
                this.metadata.addComponent(actionsetitem.component, this.actioncontainerheader).subscribe((componentRef) => {
                    componentRef.instance.actionconfig = actionsetitem.actionconfig;
                    if (componentRef.instance.closemenu) {
                        componentRef.instance.closemenu.subscribe((close) => {
                            this.isOpen = false;
                        });
                    }
                });
            }
        }
    }

    private toggleOpen() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    private onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isOpen = false;
            this.clickListener();
        }
    }


}