/**
 * @module SystemComponents
 */

import {AfterViewInit, Component, EventEmitter, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from "../../services/metadata.service";
import {take} from "rxjs/operators";

@Component({
    selector: "system-richtext-editor-modal",
    templateUrl: "./src/systemcomponents/templates/systemrichtexteditormodal.html"
})
export class SystemRichTextEditorModal implements AfterViewInit {

    public self: any;
    public content: any = '';
    public contract: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild('modalContainer', {read: ViewContainerRef, static: true}) private modalContainer: ViewContainerRef;

    constructor(private metadata: metadata) {
    }

    public ngAfterViewInit() {
        this.renderView();
    }

    private renderView() {
        this.metadata.addComponent('SystemRichTextEditor', this.modalContainer)
            .subscribe(componentRef => {
                componentRef.instance.isExpanded = true;
                componentRef.instance.htmlEditor.element.nativeElement.focus();
                componentRef.instance.writeValue(this.content);
                componentRef.instance.contract
                    .pipe(take(1))
                    .subscribe(html => {
                        if (this.self) this.self.destroy();
                        this.contract.emit(html);
                    });
            });
    }
}
