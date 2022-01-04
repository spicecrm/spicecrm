/**
 * @module SystemComponents
 */
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'system-wrapped-text',
    templateUrl: '../templates/systemwrappedtext.html'
})
export class SystemWrappedText {

    /**
     * The text to be rendered.
     */
    @Input() public text = '';

    constructor( public sanitizer: DomSanitizer ) {}

    /**
     * Gets the HTML variant of the text.
     * Why? Because the text will be handled as HTML (to do nice line breaks), so possibly included HTML characters have to get escaped.
     * @private
     */
    public getHtml(): SafeHtml {
        let text = this.text;
        text = this.escapeHtml( text );
        text = text.replace(/ *\n( *\n)+ */g,'</div><div style="margin-top:0.5em">');
        text = text.replace(/ *\n */g,'<br>');
        return this.sanitizer.bypassSecurityTrustHtml('<div>'+text+'</div>');
    }

    /**
     * Escape the text. Neutralize special characters that could be interpreted as HTML.
     * @param text The text to escape.
     * @private
     */
    public escapeHtml( text ) {
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace( /[&<>"']/g, m => map[m] );
    }

}
