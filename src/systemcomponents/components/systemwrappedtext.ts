/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SystemComponents
 */
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'system-wrapped-text',
    templateUrl: './src/systemcomponents/templates/systemwrappedtext.html'
})
export class SystemWrappedText {

    /**
     * The text to be rendered.
     */
    @Input() private text = '';

    constructor( public sanitizer: DomSanitizer ) {}

    /**
     * Gets the HTML variant of the text.
     * Why? Because the text will be handled as HTML (to do nice line breaks), so possibly included HTML characters have to get escaped.
     * @private
     */
    private getHtml(): SafeHtml {
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
    private escapeHtml( text ) {
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
