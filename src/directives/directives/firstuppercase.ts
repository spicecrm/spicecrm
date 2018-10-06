import { Pipe, PipeTransform } from '@angular/core';

/*
 * Capitalize the first letter of the string
 * Takes a string as a value.
 * Usage:
 *  value | firstuppercase
 * Example:
 *  // value.name = "send something"
 *  {{ value.name | firstuppercase  }}
 *  formats to: "Send something"
*/
@Pipe({
    name: 'firstuppercase'
})
export class FirstUpperCasePipe implements PipeTransform {
    transform( value: string, args: any[] ): string {
        if ( value === null ) return null;
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}