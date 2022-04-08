/**
 * @module SystemComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";


/**
 * renders a modal with an iframe container
 */
@Component({
    selector: "system-iframe-modal",
    templateUrl: "../templates/systemiframemodal.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemIframeModal implements OnInit{

    private self: any;

    public iframeSource: any;

    /**
     * the source to render in teh iframe
     */
    @Input() public source: string;

    constructor(public sanitizer: DomSanitizer, public cdref: ChangeDetectorRef) {

    }

    /**
     * closes the modal
     */
    public close(){
        this.self.destroy();
    }

    public ngOnInit() {
        this.iframeSource = this.sanitizer.bypassSecurityTrustResourceUrl(this.source);
        this.cdref.detectChanges();
    }

}
