import {
     Pipe
} from '@angular/core';

@Pipe({name: 'packageloaderpipe'})
export class PackageLoaderPipe {
    public transform(packagelist, term) {
        // if we do not have a searchterm do not apply the filter
        if (!term) return packagelist;

        let retValues = [];
        for (let packageitem of packagelist) {
            if (packageitem.name.toLowerCase().indexOf(term.toLowerCase()) >= 0) retValues.push(packageitem);
        }
        return retValues;
    }
}

