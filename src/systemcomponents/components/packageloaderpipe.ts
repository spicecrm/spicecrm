/**
 * @module SystemComponents
 */
import {
    Pipe
} from '@angular/core';

@Pipe({name: 'packageloaderpipe'})
export class PackageLoaderPipe {
    public transform(packagelist, term, scope?) {
        return packagelist.filter(packageitem => {
            if (scope && packageitem.type != scope) return false;
            if (!term || (term && packageitem.name.toLowerCase().indexOf(term.toLowerCase()) >= 0)) return true;
            return false;
        });
    }
}

