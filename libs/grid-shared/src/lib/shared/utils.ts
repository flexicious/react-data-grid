import { Filter, FilterExpression } from "@euxdt/grid-core";

export const isFilterExpression = (filter: FilterExpression | Filter): filter is FilterExpression => {
    return 'col' in filter && 'operation' in filter && 'expression' in filter;
}

export const isFilter = (filter: FilterExpression | Filter): filter is Filter => {
    return 'logicalOperator' in filter && 'children' in filter;
}

