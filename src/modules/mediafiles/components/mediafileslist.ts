/**
 * @module ObjectComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
    Renderer2,
    OnDestroy,
    Injector,
    ViewChild,
    ViewContainerRef, Input
} from '@angular/core';

import {Router} from '@angular/router';
import {Subscription} from "rxjs";
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {layout} from '../../../services/layout.service';
import {modellist} from '../../../services/modellist.service';
import {ObjectList} from "../../../objectcomponents/components/objectlist";

/**
 * renders the media File List
 */
@Component({
    selector: 'media-files-list',
    templateUrl: '../templates/mediafileslist.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaFilesList extends ObjectList implements OnDestroy {

    /**
     * a handler to catch the resizte event and recalculate the padding
     */
    public resizeHandler: any;

    constructor(public router: Router, public cdRef: ChangeDetectorRef, public metadata: metadata, public modellist: modellist, public language: language, public injector: Injector, public modal: modal, public layout: layout, public renderer: Renderer2, public elementRef: ElementRef) {

        super(router, cdRef, metadata, modellist, language, injector, modal, layout);

        this.resizeHandler = this.renderer.listen('window', 'resize', () => this.onResize());
    }

    public ngOnDestroy() {
        super.ngOnDestroy();

        this.resizeHandler();
    }

    public onResize() {
        this.cdRef.detectChanges();
    }

    get containerStyle() {
        let bbox = this.elementRef.nativeElement.getBoundingClientRect();
        let count = Math.floor((bbox.width - 10) / 320);
        let padding = Math.floor(((bbox.width - 10) - count * 320) / 2);
        return {
            'padding-left': padding + 'px',
            'padding-right': padding + 'px'
        };
    }

}
