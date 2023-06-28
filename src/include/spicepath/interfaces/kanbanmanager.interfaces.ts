export interface SpiceBeanGuideStagesI {
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
}

export interface SpiceBeanGuidesI {
    id: string;
    module: string;
    status_field: string;
    build_language?: string;
    name: string;
    systextid: string;
}

export interface SpiceBeanGuideChecksI {
    id: string;
    spicebeanguide_id: string;
    stage_id: string;
    check_sequence: number;
    check_include: string;
    check_class: string;
    check_method: string;
    check_label: string;
}

