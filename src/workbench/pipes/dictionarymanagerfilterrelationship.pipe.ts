import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dictionaryFilterRelationship'
})

export class DictionaryFilterRelationshipPipe implements PipeTransform {

    transform(relationships: any, currentDictionaryDefinition: string): any {
        // return an empty array when no DictionaryDefinition is set
        if (!currentDictionaryDefinition) return [];

        return relationships.filter(r => r.deleted == 0 && (r.lhs_sysdictionarydefinition_id == currentDictionaryDefinition || r.rhs_sysdictionarydefinition_id == currentDictionaryDefinition || r.join_sysdictionarydefinition_id == currentDictionaryDefinition)).sort((a, b) => a.name.localeCompare(b.name));

    }
}