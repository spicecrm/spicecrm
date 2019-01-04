import {
    Pipe
} from '@angular/core';

@Pipe({name: 'packageloaderpipe'})
export class PackageLoaderPipe {
    public transform(packagelist, term, scope?) {
        let retValues = [];
        for (let packageitem of packagelist) {
            if (scope && packageitem.type != scope) continue;

            if (!term || (term && packageitem.name.toLowerCase().indexOf(term.toLowerCase()) >= 0)) retValues.push(packageitem);
        }
        return retValues;
    }
}

