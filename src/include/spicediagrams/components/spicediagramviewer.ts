import {
    AfterViewInit,
    Component,
    ElementRef,
    input,
    InputSignal,
    OnChanges, Renderer2,
    signal,
    ViewChild,
    WritableSignal
} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {BpmnSVGAttributesI} from "../interfaces/spicediagrams.interfaces";

@Component({
    selector: 'spice-diagram-viewer',
    templateUrl: '../templates/spicediagramviewer.html',
    standalone: false
})
export class SpiceDiagramViewer implements OnChanges, AfterViewInit {
    /**
     * holds the module name
     */
    public module: InputSignal<string> = input();
    /**
     * holds the svg data
     */
    public svg: InputSignal<string> = input();
    /**
     * holds the svg attributes
     */
    public svgAttributes: WritableSignal<BpmnSVGAttributesI> = signal(undefined);
    /**
     * holds the svg shape elements array
     */
    public svgShapeElements: WritableSignal<{ id: string, html: SafeHtml }[]> = signal([]);

    /**
     * reference to the svg container
     * @private
     */
    @ViewChild('svgContainer', {read: ElementRef}) private svgContainer: ElementRef;

    constructor(private sanitizer: DomSanitizer,
                private renderer: Renderer2) {
    }

    public ngOnChanges() {
        this.setSvgDocument();
    }

    public ngAfterViewInit() {
        this.setSvgDocument();
    }

    /**
     * set the svg document content from the svg image
     * @private
     */
    private setSvgDocument() {

        if (!this.svgContainer || !this.svg()) return;

        const parser = new DOMParser();
        const svgString = atob(this.svg().replace('data:image/svg+xml;base64,', ''));
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = svgDoc.getElementsByTagName('svg')[0];
        const viewBox = svgElement.viewBox.baseVal;

        this.svgAttributes.set({
            height: svgElement.getAttribute('height'),
            width: svgElement.getAttribute('width'),
            viewBox: svgElement.getAttribute('viewBox'),
        });

        Array.from(svgElement.children).forEach(c => {
            // other children are rendered normally
            if (!(c.firstChild as HTMLElement).dataset.taskId) {
                this.renderer.appendChild(this.svgContainer.nativeElement, c);
            } else {
                // diagram shapes will be rendered in the template with additional directives
                this.svgShapeElements().push({
                    id: (c.firstChild as HTMLElement).dataset.taskId,
                    html: this.sanitizer.bypassSecurityTrustHtml(c.innerHTML)
                });
            }
        });
    }
}