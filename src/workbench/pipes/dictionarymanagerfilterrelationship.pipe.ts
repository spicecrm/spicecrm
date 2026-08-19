import {Pipe, PipeTransform} from '@angular/core';
import {RelationshipPolymorph} from "../interfaces/dictionarymanager.interfaces";

@Pipe({
    name: 'dictionaryFilterRelationship',
    standalone: false
})

export class DictionaryFilterRelationshipPipe implements PipeTransform {

    transform(relationships: any, currentDictionaryDefinition: string, filterterm: string): any {
        // return an empty array when no DictionaryDefinition is set
        if (!currentDictionaryDefinition) return [];

        const res = new Map();

        const priority = {g: 0, c: 1};
        relationships.sort((a, b) => priority[a.scope] - priority[b.scope]).forEach(r => {
            if (r.deleted == 0 && (!filterterm || r.name.toLowerCase().indexOf(filterterm.toLowerCase()) >= 0 || r.relationship_name.toLowerCase().indexOf(filterterm.toLowerCase()) >= 0) && (r.lhs_sysdictionarydefinition_id == currentDictionaryDefinition || r.rhs_sysdictionarydefinition_id == currentDictionaryDefinition || r.join_sysdictionarydefinition_id == currentDictionaryDefinition)) {
                res.set(r.relationship_name, r);
            }
        });

        return Array.from(res.values()).sort((a, b) => a.name.localeCompare(b.name));
    }
}