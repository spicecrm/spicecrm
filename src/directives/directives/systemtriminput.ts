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

    @Input('system-trim-input') public trim: string|boolean;

    public getCaret( el )
    {
        return {
            start: el.selectionStart,
            end: el.selectionEnd,
        };
    }

    public setCaret( el, start, end )
    {
        el.selectionStart = start;
        el.selectionEnd = end;
        el.focus();
    }

    public dispatchEvent( el, eventType )
    {
        const event = document.createEvent('Event');
        event.initEvent( eventType, false, false );
        el.dispatchEvent( event);
    }

    public trimValue ( el, value )
    {
        el.value = value.trim();
        this.dispatchEvent( el, 'input');
    }

    @HostListener('blur', ['$event.target', '$event.target.value'])
    public onBlur( el: any, value: string ): void
    {
        if ( this.trim !== false && ( !this.trim || 'blur' === this.trim) && 'function' === typeof value.trim && value.trim() !== value)
        {
            this.trimValue( el, value );
            this.dispatchEvent( el, 'blur'); // in case updateOn is set to blur
        }
    }

    @HostListener('input', ['$event.target', '$event.target.value'])
    public onInput( el: any, value: string ): void
    {
        if ( this.trim !== false && !this.trim && 'function' === typeof value.trim && value.trim() !== value)
        {
            let { start, end } = this.getCaret(el);

            if (value[0] === ' ' && start === 1 && end === 1)
            {
                start = 0;
                end = 0;
            }

            this.trimValue( el, value );

            this.setCaret( el, start, end );
        }
    }

}
