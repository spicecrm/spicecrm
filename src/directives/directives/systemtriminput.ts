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
 * @module DirectivesModule
 */
import { Directive, HostListener, Input } from '@angular/core';

/*
 *  For input fields. Keeps the input value trimmed from white spaces.
 *  https://github.com/KingMario/packages/tree/master/projects/ngx-trim-directive
 */
@Directive({
    selector: 'input[system-trim-input], textarea[system-trim-input]',
})
export class SystemTrimInputDirective {

    @Input('system-trim-input') private trim: string;

    private getCaret(el) {

        return {
            start: el.selectionStart,
            end: el.selectionEnd,
        };

    }

    private setCaret(el, start, end) {

        el.selectionStart = start;
        el.selectionEnd = end;

        el.focus();

    }

    private dispatchEvent(el, eventType) {

        const event = document.createEvent('Event');
        event.initEvent(eventType, false, false);
        el.dispatchEvent(event);

    }

    private trimValue (el, value) {

        el.value = value.trim();

        this.dispatchEvent(el, 'input');

    }

    @HostListener('blur', ['$event.target', '$event.target.value'])
    private onBlur(el: any, value: string): void {

        if ((!this.trim || 'blur' === this.trim) && 'function' === typeof value.trim && value.trim() !== value) {

            this.trimValue(el, value);
            this.dispatchEvent(el, 'blur'); // in case updateOn is set to blur

        }

    }

    @HostListener('input', ['$event.target', '$event.target.value'])
    private onInput(el: any, value: string): void {

        if (!this.trim && 'function' === typeof value.trim && value.trim() !== value) {

            let { start, end } = this.getCaret(el);

            if (value[0] === ' ' && start === 1 && end === 1) {

                start = 0;
                end = 0;

            }

            this.trimValue(el, value);

            this.setCaret(el, start, end);

        }

    }

}
