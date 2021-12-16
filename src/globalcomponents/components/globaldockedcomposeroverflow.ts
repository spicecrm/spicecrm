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
import {telephony} from '../../services/telephony.service';

@Component({
    selector: 'global-docked-composer-overflow',
    templateUrl: '../templates/globaldockedcomposeroverflow.html'
})
export class GlobalDockedComposerOverflow implements OnDestroy {
   public showHiddenComposers: boolean = false;
   public clickListener: any;

    constructor(public renderer: Renderer2,public elementRef: ElementRef,public dockedComposer: dockedComposer,public telephony: telephony,public language: language) {

    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    get hiddenCount() {
        return this.dockedComposer.composers.length + this.telephony.calls.length - this.dockedComposer.maxComposers;
    }

   public toggleHiddenComoposers() {
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
        return this.dockedComposer.composers.slice(this.dockedComposer.maxComposers - this.telephony.calls.length);
    }

   public displayLabel(composer) {
        // return composer.model.data.name ? composer.model.data.name : this.language.getLabel(composer.module, 'LBL_NEW_FORM_TITLE');
        return composer.model.data.name ? composer.model.data.name : this.language.getModuleName(composer.model.module, true);
    }

   public focusComposer(composerid) {
        this.dockedComposer.focusComposer(composerid);
        this.showHiddenComposers = false;
    }
}
