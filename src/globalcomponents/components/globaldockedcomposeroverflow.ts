import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Renderer2,
    ElementRef,
    OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-docked-composer-overflow',
    templateUrl: './app/globalcomponents/templates/globaldockedcomposeroverflow.html'
})
export class GlobalDockedComposerOverflow implements OnDestroy{
    showHiddenComposers: boolean = false;
    clickListener: any;

    constructor(private renderer: Renderer2, private elementRef: ElementRef,private dockedComposer: dockedComposer, private language: language) {

    }

    ngOnDestroy(){
        this.clickListener();
    }

    get hiddenCount(){
        return this.dockedComposer.composers.length - this.dockedComposer.maxComposers;
    }

    toggleHiddenComoposers(){
        this.showHiddenComposers = !this.showHiddenComposers;

        if (this.showHiddenComposers) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }

    public onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showHiddenComposers = false;
            this.clickListener();
        }
    }


    get overflowComposers(){
        return this.dockedComposer.composers.slice(this.dockedComposer.maxComposers);
    }

    displayLabel(composer){
        return composer.model.data.name ? composer.model.data.name : this.language.getModuleLabel(composer.module, 'LBL_NEW_FORM_TITLE');
    }

    focusComposer(composerid){
        this.dockedComposer.focusComposer(composerid);
        this.showHiddenComposers = false;
    }

}