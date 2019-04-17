/**
 * @module GlobalComponents
 */
import {
    Component,
    Renderer2,
    ElementRef,
    OnDestroy
} from '@angular/core';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-docked-composer-overflow',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposeroverflow.html'
})
export class GlobalDockedComposerOverflow implements OnDestroy {
    private showHiddenComposers: boolean = false;
    private clickListener: any;

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private dockedComposer: dockedComposer, private language: language) {

    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    get hiddenCount() {
        return this.dockedComposer.composers.length + this.dockedComposer.calls.length - this.dockedComposer.maxComposers;
    }

    private toggleHiddenComoposers() {
        this.showHiddenComposers = !this.showHiddenComposers;

        if (this.showHiddenComposers) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    public onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showHiddenComposers = false;
            this.clickListener();
        }
    }


    get overflowComposers() {
        return this.dockedComposer.composers.slice(this.dockedComposer.maxComposers - this.dockedComposer.calls.length);
    }

    private displayLabel(composer) {
        // return composer.model.data.name ? composer.model.data.name : this.language.getLabel(composer.module, 'LBL_NEW_FORM_TITLE');
        return composer.model.data.name ? composer.model.data.name : this.language.getModuleName(composer.model.module, true);
    }

    private focusComposer(composerid) {
        this.dockedComposer.focusComposer(composerid);
        this.showHiddenComposers = false;
    }
}
