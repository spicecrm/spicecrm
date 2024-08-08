import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterACLUsers',
    pure: false
})
export class ACLUsersFilterPipe implements PipeTransform {

    transform(values: any[], filterString: string ): any[] {
        if (!filterString) {
            return values;
        }

        const lowerFilter = filterString.toLowerCase();

        return values.filter(v =>
            Object.values(v).some(value => typeof value === 'string' && value.toLowerCase().includes(lowerFilter))
        );
    }

}