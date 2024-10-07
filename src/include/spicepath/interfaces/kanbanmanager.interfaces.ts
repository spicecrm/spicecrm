
export interface SpiceBeanGuideStageI {
    id: string;
    spicebeanguide_id: string;
    stage: string;
    secondary_stage: string;
    stage_sequence: number;
    stage_bucket: string;
    stage_color: string;
    stage_add_data: string;
    stage_label: string;
    stage_componentset: string;
    not_in_kanban: number;
    spicebeanguide_status: string;
    scope?: string;
}

export interface SpiceBeanGuideActiveStageI extends SpiceBeanGuideStageI {
    not_in_kanban: 0 | undefined;
}

export interface SpiceBeanGuideInactiveStageI extends SpiceBeanGuideStageI {
    not_in_kanban: 1;
}

export interface SpiceBeanGuidesI {
    id: string;
    module: string;
    status_field: string;
    build_language?: string;
    scope?: string;
    name: string;
    systextid: string;
}

export interface SpiceBeanGuideCheckI {
    id: string;
    spicebeanguide_id: string;
    stage_id: string;
    check_sequence: number;
    check_include: string;
    check_class: string;
    check_method: string;
    check_label: string;
    scope?: string;
}

export interface SpiceTextsI {
    id: string;
    description: string;
    parent_id: string;
    parent_type: string;
    text_id: string;
    text_language: string;
    deleted: 0 | 1;
}
