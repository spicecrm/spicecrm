import {
    Component,
    EventEmitter,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {language} from '../../services/language.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: "system-richtext-sourcemodal",
    templateUrl: "./src/systemcomponents/templates/systemrichtextsourcemodal.html",
})
export class SystemRichTextSourceModal implements OnInit {

    public self: any = {};
    private _html: string = '';
    private html: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('sourceeditor') private sourceEditor: any;

    constructor(private language: language, private renderer: Renderer2, public sanitized: DomSanitizer) {
    }

    public ngOnInit() {
        this.renderer.setProperty(this.sourceEditor.nativeElement, 'innerText', this._html);
    }

    private onContentChange(html) {
        this._html = html;
    }

    get sanitizedHtml() {
        return this.sanitized.bypassSecurityTrustHtml(this._html);
    }

    private close() {
        this.html.emit(this._html);
        this.self.destroy();
    }
}
