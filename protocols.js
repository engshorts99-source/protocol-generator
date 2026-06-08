/**
 * protocols.js
 * 실험 프로토콜 데이터 정의
 * 각 프로토콜은 목적, 재료, 단계별 절차, 주의사항을 포함합니다.
 * 빈칸(______)은 세부 용량을 직접 기입하도록 남겨두는 부분입니다.
 */

const BLANK = '____________';

const CATEGORY_LABELS = {
    protein: '단백질 분석',
    nucleic: '핵산 분석',
    cell: '세포 실험',
    imaging: '이미징',
    micro: '미생물',
};

const DEFAULT_PROTOCOLS = [
    // ==========================================
    // 1. Western Blot
    // ==========================================
    {
        id: 'western_blot',
        name: '웨스턴 블롯',
        nameEn: 'Western Blot',
        category: 'protein',
        icon: '🧫',
        description: '특정 단백질의 발현량을 확인하는 면역블롯 기법',
        purpose: 'SDS-PAGE로 단백질을 분리한 후 멤브레인에 전사하고, 특이 항체를 이용하여 목적 단백질을 검출한다.',
        materials: [
            { name: 'Cell lysate / Tissue lysate', amount: BLANK },
            { name: 'RIPA buffer', amount: BLANK },
            { name: 'Protease inhibitor cocktail', amount: BLANK },
            { name: 'Loading buffer (4× 또는 6×)', amount: BLANK },
            { name: 'SDS-PAGE gel', amount: BLANK + ' %' },
            { name: 'Running buffer (Tris-Glycine-SDS)', amount: '1×' },
            { name: 'Transfer buffer', amount: '1×' },
            { name: 'PVDF 또는 NC membrane', amount: '1장' },
            { name: 'Blocking buffer (BSA 또는 Skim milk)', amount: BLANK + ' %' },
            { name: 'Primary antibody', amount: BLANK + ' 희석' },
            { name: 'Secondary antibody (HRP-conjugated)', amount: BLANK + ' 희석' },
            { name: 'TBST (TBS + 0.1% Tween-20)', amount: '적량' },
            { name: 'ECL substrate', amount: '적량' },
            { name: 'Protein marker (ladder)', amount: BLANK + ' μL' },
        ],
        sections: [
            {
                title: '시료 준비 (Sample Preparation)',
                steps: [
                    `세포를 PBS로 2회 세척한 후, ${BLANK} μL의 RIPA buffer (protease inhibitor 첨가)로 용해한다.`,
                    `4°C에서 ${BLANK} 분간 incubation 후 원심분리 (${BLANK} × g, ${BLANK} 분, 4°C)한다.`,
                    `상층액을 새 튜브에 옮기고, BCA 또는 Bradford assay로 단백질 정량한다.`,
                    `단백질 ${BLANK} μg을 loading buffer와 혼합하고 ${BLANK} °C에서 ${BLANK} 분간 가열한다.`,
                ],
            },
            {
                title: 'SDS-PAGE 전기영동',
                steps: [
                    `${BLANK} % acrylamide gel을 준비한다.`,
                    `시료를 well에 loading 한다 (각 ${BLANK} μL).`,
                    `Protein marker ${BLANK} μL을 첫 번째 또는 마지막 well에 loading 한다.`,
                    `Running buffer에서 ${BLANK} V로 stacking gel 통과 후, ${BLANK} V로 separating gel을 전개한다.`,
                    `Dye front가 gel 하단에 도달하면 전기영동을 중지한다.`,
                ],
            },
            {
                title: 'Transfer (전사)',
                steps: [
                    `PVDF membrane을 methanol로 활성화하고, transfer buffer에 ${BLANK} 분간 평형화한다.`,
                    `Gel과 membrane을 transfer cassette에 조립한다 (gel → membrane 방향 확인).`,
                    `Transfer buffer에서 ${BLANK} V, ${BLANK} 분간 (또는 ${BLANK} mA, overnight) 전사한다.`,
                    `전사 후 Ponceau S 염색으로 전사 효율을 확인한다.`,
                ],
            },
            {
                title: 'Blocking & Antibody Incubation',
                steps: [
                    `Membrane을 ${BLANK} % BSA (또는 skim milk) / TBST로 상온에서 ${BLANK} 시간 blocking 한다.`,
                    `Primary antibody를 ${BLANK} 희석비로 준비하여 4°C에서 overnight incubation 한다.`,
                    `TBST로 ${BLANK} 분 × ${BLANK} 회 세척한다.`,
                    `Secondary antibody를 ${BLANK} 희석비로 준비하여 상온에서 ${BLANK} 시간 incubation 한다.`,
                    `TBST로 ${BLANK} 분 × ${BLANK} 회 세척한다.`,
                ],
            },
            {
                title: 'Detection (검출)',
                steps: [
                    `ECL substrate를 membrane 위에 도포하고 ${BLANK} 분간 반응시킨다.`,
                    `ChemiDoc 또는 X-ray film으로 발색 band를 확인한다.`,
                    `노출 시간: ${BLANK} 초 ~ ${BLANK} 분`,
                ],
            },
        ],
        notes: [
            'Membrane은 건조되지 않도록 주의한다.',
            'Blocking 조건은 항체에 따라 BSA 또는 skim milk를 선택한다 (phospho-antibody는 BSA 권장).',
            'Transfer 효율은 단백질 크기에 따라 전사 조건을 조절한다.',
            '모든 incubation은 shaker 위에서 수행한다.',
        ],
        tags: ['SDS-PAGE', 'Immunoblot', 'Protein detection'],
    },

    // ==========================================
    // 2. PCR
    // ==========================================
    {
        id: 'pcr',
        name: 'PCR (중합효소 연쇄반응)',
        nameEn: 'Polymerase Chain Reaction',
        category: 'nucleic',
        icon: '🧬',
        description: '특정 DNA 서열을 증폭하는 기본 기법',
        purpose: '열안정성 DNA polymerase를 이용하여 특정 DNA 서열을 in vitro에서 기하급수적으로 증폭한다.',
        materials: [
            { name: 'Template DNA', amount: BLANK + ' ng' },
            { name: 'Forward primer (10 μM)', amount: BLANK + ' μL' },
            { name: 'Reverse primer (10 μM)', amount: BLANK + ' μL' },
            { name: 'dNTP mix (10 mM each)', amount: BLANK + ' μL' },
            { name: 'DNA polymerase (Taq 또는 High-fidelity)', amount: BLANK + ' U' },
            { name: '10× PCR buffer (또는 2× master mix)', amount: BLANK + ' μL' },
            { name: 'MgCl₂ (필요시)', amount: BLANK + ' mM' },
            { name: 'Nuclease-free water', amount: 'to ' + BLANK + ' μL (total)' },
        ],
        sections: [
            {
                title: 'Reaction Mix 준비',
                steps: [
                    `Ice 위에서 PCR tube를 준비한다.`,
                    `아래 조성으로 reaction mix를 준비한다:`,
                    `  - Template DNA: ${BLANK} μL (${BLANK} ng)`,
                    `  - Forward primer: ${BLANK} μL`,
                    `  - Reverse primer: ${BLANK} μL`,
                    `  - dNTP mix: ${BLANK} μL`,
                    `  - 10× Buffer: ${BLANK} μL`,
                    `  - DNA polymerase: ${BLANK} μL`,
                    `  - Nuclease-free water: ${BLANK} μL`,
                    `  - Total volume: ${BLANK} μL`,
                    `Negative control (template 대신 water)을 반드시 포함한다.`,
                    `가볍게 vortex 또는 pipetting으로 혼합하고 brief spin down 한다.`,
                ],
            },
            {
                title: 'Thermocycler 조건',
                steps: [
                    `Initial denaturation: ${BLANK} °C, ${BLANK} 분`,
                    `Denaturation: ${BLANK} °C, ${BLANK} 초  ⎤`,
                    `Annealing: ${BLANK} °C, ${BLANK} 초     ⎥ × ${BLANK} cycles`,
                    `Extension: ${BLANK} °C, ${BLANK} 초/kb  ⎦`,
                    `Final extension: ${BLANK} °C, ${BLANK} 분`,
                    `Hold: 4°C`,
                ],
            },
            {
                title: '결과 확인',
                steps: [
                    `PCR 산물 ${BLANK} μL을 agarose gel electrophoresis로 확인한다.`,
                    `예상 band size: ${BLANK} bp`,
                    `필요시 gel extraction 또는 PCR purification을 진행한다.`,
                ],
            },
        ],
        notes: [
            'Primer의 Tm 값에 따라 annealing temperature를 조절한다 (Tm - 5°C 정도).',
            'High-fidelity polymerase 사용 시 extension 시간과 buffer 조건을 확인한다.',
            'GC-rich template의 경우 DMSO (2-5%) 또는 betaine 첨가를 고려한다.',
            '오염 방지를 위해 template 취급은 별도 영역에서 수행한다.',
        ],
        tags: ['DNA amplification', 'Thermocycling', 'Primer'],
    },

    // ==========================================
    // 3. RT-qPCR
    // ==========================================
    {
        id: 'rt_qpcr',
        name: 'RT-qPCR',
        nameEn: 'Reverse Transcription Quantitative PCR',
        category: 'nucleic',
        icon: '📊',
        description: 'mRNA 발현량을 정량적으로 분석하는 실시간 PCR',
        purpose: 'RNA를 cDNA로 역전사한 후 실시간 PCR을 통해 유전자 발현량을 정량 분석한다.',
        materials: [
            { name: 'Total RNA', amount: BLANK + ' μg' },
            { name: 'Reverse transcriptase', amount: BLANK + ' μL' },
            { name: 'Oligo(dT) 또는 Random hexamer primer', amount: BLANK + ' μL' },
            { name: 'RT buffer', amount: BLANK + ' μL' },
            { name: 'dNTP mix', amount: BLANK + ' μL' },
            { name: 'RNase inhibitor', amount: BLANK + ' μL' },
            { name: 'SYBR Green master mix (또는 TaqMan)', amount: BLANK + ' μL' },
            { name: 'Forward primer (qPCR)', amount: BLANK + ' μL' },
            { name: 'Reverse primer (qPCR)', amount: BLANK + ' μL' },
            { name: 'Nuclease-free water', amount: '적량' },
        ],
        sections: [
            {
                title: 'cDNA 합성 (Reverse Transcription)',
                steps: [
                    `Total RNA ${BLANK} μg을 nuclease-free water로 ${BLANK} μL에 맞춘다.`,
                    `Oligo(dT) 또는 random hexamer primer ${BLANK} μL을 첨가하고 65°C, 5분 가열 후 ice에서 급냉한다.`,
                    `RT reaction mix를 준비한다:`,
                    `  - RT buffer: ${BLANK} μL`,
                    `  - dNTP mix: ${BLANK} μL`,
                    `  - RNase inhibitor: ${BLANK} μL`,
                    `  - Reverse transcriptase: ${BLANK} μL`,
                    `${BLANK} °C에서 ${BLANK} 분간 역전사 반응을 수행한다.`,
                    `${BLANK} °C에서 ${BLANK} 분간 enzyme inactivation을 수행한다.`,
                    `합성된 cDNA를 ${BLANK} 배 희석하여 qPCR template로 사용한다.`,
                ],
            },
            {
                title: 'qPCR Reaction 준비',
                steps: [
                    `96-well PCR plate에 아래 조성으로 reaction mix를 분주한다:`,
                    `  - SYBR Green master mix: ${BLANK} μL`,
                    `  - Forward primer: ${BLANK} μL`,
                    `  - Reverse primer: ${BLANK} μL`,
                    `  - cDNA template: ${BLANK} μL`,
                    `  - Nuclease-free water: ${BLANK} μL`,
                    `  - Total: ${BLANK} μL/well`,
                    `각 시료는 ${BLANK} 개의 technical replicate로 수행한다.`,
                    `NTC (No Template Control)를 반드시 포함한다.`,
                    `Plate를 sealing film으로 밀봉하고 brief spin down 한다.`,
                ],
            },
            {
                title: 'qPCR Cycling 조건',
                steps: [
                    `Initial denaturation: 95°C, ${BLANK} 분`,
                    `Denaturation: 95°C, ${BLANK} 초  ⎤`,
                    `Annealing/Extension: ${BLANK} °C, ${BLANK} 초  ⎦ × ${BLANK} cycles`,
                    `Melting curve analysis: 65°C → 95°C`,
                ],
            },
            {
                title: '데이터 분석',
                steps: [
                    `Ct (threshold cycle) 값을 확인한다.`,
                    `Reference gene (${BLANK})으로 정규화한다.`,
                    `ΔΔCt method를 이용하여 상대적 발현량을 계산한다.`,
                    `Melting curve에서 single peak 여부를 확인한다.`,
                ],
            },
        ],
        notes: [
            'RNA는 RNase-free 환경에서 취급한다.',
            'Primer efficiency는 90-110% 범위가 적정하다.',
            'Reference gene은 실험 조건에 따라 적절한 것을 선택한다 (GAPDH, β-actin, 18S rRNA 등).',
            'SYBR Green 사용 시 primer dimer 여부를 melting curve로 반드시 확인한다.',
        ],
        tags: ['Gene expression', 'Real-time PCR', 'cDNA'],
    },

    // ==========================================
    // 4. RNA Extraction (TRIzol)
    // ==========================================
    {
        id: 'rna_extraction',
        name: 'RNA 추출 (TRIzol)',
        nameEn: 'RNA Extraction (TRIzol method)',
        category: 'nucleic',
        icon: '💧',
        description: 'TRIzol 시약을 이용한 총 RNA 추출',
        purpose: 'TRIzol (phenol-guanidinium isothiocyanate)을 이용하여 세포 또는 조직에서 총 RNA를 분리한다.',
        materials: [
            { name: 'TRIzol reagent', amount: BLANK + ' mL' },
            { name: 'Chloroform', amount: BLANK + ' μL' },
            { name: 'Isopropanol', amount: BLANK + ' μL' },
            { name: '75% Ethanol (DEPC water로 제조)', amount: BLANK + ' μL' },
            { name: 'DEPC-treated water 또는 Nuclease-free water', amount: BLANK + ' μL' },
            { name: 'Cell pellet 또는 Tissue', amount: BLANK },
        ],
        sections: [
            {
                title: '세포 용해 (Homogenization)',
                steps: [
                    `세포 pellet에 TRIzol ${BLANK} mL을 첨가하고 pipetting으로 완전히 용해한다.`,
                    `조직의 경우 TRIzol ${BLANK} mL 당 조직 ${BLANK} mg 비율로 homogenize 한다.`,
                    `상온에서 ${BLANK} 분간 incubation 한다.`,
                ],
            },
            {
                title: 'Phase Separation',
                steps: [
                    `Chloroform ${BLANK} μL을 첨가하고 15초간 vigorously shaking 한다.`,
                    `상온에서 ${BLANK} 분간 incubation 한다.`,
                    `${BLANK} × g, ${BLANK} 분, 4°C에서 원심분리 한다.`,
                    `상층 (aqueous phase)을 새 튜브에 조심스럽게 옮긴다 (interphase 건드리지 않도록 주의).`,
                ],
            },
            {
                title: 'RNA Precipitation',
                steps: [
                    `Isopropanol ${BLANK} μL을 첨가하고 상하로 뒤집어 혼합한다.`,
                    `상온에서 ${BLANK} 분간 incubation 한다 (또는 -20°C overnight).`,
                    `${BLANK} × g, ${BLANK} 분, 4°C에서 원심분리 한다.`,
                    `상층액을 조심스럽게 제거한다 (pellet 유지).`,
                ],
            },
            {
                title: 'RNA Wash & Resuspension',
                steps: [
                    `75% ethanol ${BLANK} μL을 첨가하고 vortex로 pellet을 wash 한다.`,
                    `${BLANK} × g, ${BLANK} 분, 4°C에서 원심분리 한다.`,
                    `Ethanol을 완전히 제거하고 ${BLANK} 분간 air dry 한다 (과건조 주의).`,
                    `DEPC water ${BLANK} μL에 resuspend 한다.`,
                    `55-60°C에서 ${BLANK} 분간 incubation 하여 완전히 녹인다.`,
                ],
            },
            {
                title: '정량 및 품질 확인',
                steps: [
                    `NanoDrop으로 RNA 농도 및 A260/A280, A260/A230 비율을 측정한다.`,
                    `A260/A280: ${BLANK} (적정 1.8-2.0)`,
                    `A260/A230: ${BLANK} (적정 2.0-2.2)`,
                    `필요시 Agarose gel 또는 Bioanalyzer로 RNA integrity를 확인한다.`,
                ],
            },
        ],
        notes: [
            'TRIzol은 독성이 강하므로 반드시 화학후드에서 작업한다.',
            'RNase-free 장갑, 팁, 튜브를 사용한다.',
            'RNA pellet을 과건조하면 용해가 어려워지므로 주의한다.',
            '장기 보관 시 -80°C에서 보관한다.',
        ],
        tags: ['RNA isolation', 'TRIzol', 'Gene expression'],
    },

    // ==========================================
    // 5. Plasmid DNA Miniprep
    // ==========================================
    {
        id: 'miniprep',
        name: '플라스미드 DNA 추출',
        nameEn: 'Plasmid DNA Miniprep',
        category: 'nucleic',
        icon: '🔄',
        description: '대장균에서 플라스미드 DNA를 소량 정제',
        purpose: '알칼리 용해법(alkaline lysis)을 이용하여 대장균 배양액에서 플라스미드 DNA를 추출 및 정제한다.',
        materials: [
            { name: 'E. coli 배양액 (overnight)', amount: BLANK + ' mL' },
            { name: 'Resuspension buffer (P1)', amount: BLANK + ' μL' },
            { name: 'Lysis buffer (P2)', amount: BLANK + ' μL' },
            { name: 'Neutralization buffer (P3 / N3)', amount: BLANK + ' μL' },
            { name: 'Spin column', amount: '1개' },
            { name: 'Wash buffer', amount: BLANK + ' μL' },
            { name: 'Elution buffer (EB) 또는 Nuclease-free water', amount: BLANK + ' μL' },
        ],
        sections: [
            {
                title: '균체 수확',
                steps: [
                    `Overnight culture ${BLANK} mL을 ${BLANK} × g, ${BLANK} 분 원심분리하여 상층액을 제거한다.`,
                    `필요시 한 번 더 배양액을 추가하여 원심분리한다.`,
                ],
            },
            {
                title: 'Alkaline Lysis',
                steps: [
                    `P1 buffer ${BLANK} μL로 pellet을 완전히 resuspend 한다 (vortex 사용 가능).`,
                    `P2 buffer ${BLANK} μL을 첨가하고 5-6회 gentle inversion으로 혼합한다 (vortex 금지).`,
                    `상온에서 ${BLANK} 분간 incubation 한다 (5분 이내).`,
                    `N3 buffer ${BLANK} μL을 첨가하고 즉시 5-6회 inversion으로 혼합한다.`,
                    `${BLANK} × g, ${BLANK} 분 원심분리한다.`,
                ],
            },
            {
                title: 'Column Purification',
                steps: [
                    `상층액을 spin column에 loading 하고 원심분리한다.`,
                    `Wash buffer ${BLANK} μL로 2회 세척한다.`,
                    `추가 1분 원심분리로 잔여 ethanol을 완전히 제거한다.`,
                    `Column을 새 1.5 mL tube에 옮긴다.`,
                    `Elution buffer ${BLANK} μL을 column 중앙에 분주하고 ${BLANK} 분간 상온에서 incubation 한다.`,
                    `원심분리하여 DNA를 elution 한다.`,
                ],
            },
            {
                title: '정량 및 확인',
                steps: [
                    `NanoDrop으로 DNA 농도를 측정한다: ${BLANK} ng/μL`,
                    `A260/A280: ${BLANK} (적정 1.8)`,
                    `필요시 제한효소 절단으로 insert를 확인한다.`,
                ],
            },
        ],
        notes: [
            'P2 buffer 첨가 후 5분 이상 방치하면 genomic DNA 오염이 증가한다.',
            'P2 buffer를 첨가한 후에는 절대 vortex 하지 않는다.',
            'Elution 시 65°C로 preheating한 buffer를 사용하면 수율이 증가한다.',
            'Low-copy plasmid의 경우 배양 volume을 늘리거나 midiprep을 고려한다.',
        ],
        tags: ['Plasmid', 'Alkaline lysis', 'Column purification'],
    },

    // ==========================================
    // 6. Agarose Gel Electrophoresis
    // ==========================================
    {
        id: 'gel_electrophoresis',
        name: '아가로스 겔 전기영동',
        nameEn: 'Agarose Gel Electrophoresis',
        category: 'nucleic',
        icon: '📏',
        description: 'DNA 또는 RNA를 크기별로 분리하여 확인',
        purpose: 'Agarose gel matrix에서 전기장을 걸어 핵산을 크기에 따라 분리하고, 핵산 염색 시약으로 시각화한다.',
        materials: [
            { name: 'Agarose', amount: BLANK + ' g' },
            { name: 'TAE 또는 TBE buffer (1×)', amount: BLANK + ' mL' },
            { name: '핵산 염색 시약 (EtBr, SYBR Safe 등)', amount: BLANK + ' μL' },
            { name: 'DNA loading dye (6×)', amount: BLANK + ' μL' },
            { name: 'DNA ladder (marker)', amount: BLANK + ' μL' },
            { name: 'DNA sample', amount: BLANK + ' μL' },
        ],
        sections: [
            {
                title: 'Gel 제조',
                steps: [
                    `Agarose ${BLANK} g을 1× TAE (또는 TBE) buffer ${BLANK} mL에 첨가한다.`,
                    `Gel 농도: ${BLANK} % (목적 DNA 크기에 따라 조절)`,
                    `전자레인지로 완전히 녹인다 (끓어 넘치지 않도록 주의).`,
                    `약 60°C로 식힌 후 핵산 염색 시약 ${BLANK} μL을 첨가하고 혼합한다.`,
                    `Gel tray에 comb을 꽂고 agarose를 부어 상온에서 ${BLANK} 분간 굳힌다.`,
                ],
            },
            {
                title: 'Sample Loading & 전기영동',
                steps: [
                    `굳은 gel에서 comb을 제거하고 전기영동 장치에 장착한다.`,
                    `1× TAE (또는 TBE) buffer로 gel이 충분히 잠기도록 채운다.`,
                    `DNA sample ${BLANK} μL에 6× loading dye ${BLANK} μL을 혼합한다.`,
                    `DNA ladder ${BLANK} μL을 첫 번째 well에 loading 한다.`,
                    `시료를 각 well에 loading 한다.`,
                    `${BLANK} V에서 ${BLANK} 분간 전기영동한다 (양극 방향 확인).`,
                ],
            },
            {
                title: '결과 확인',
                steps: [
                    `UV transilluminator 또는 gel documentation system으로 band를 확인한다.`,
                    `예상 band size: ${BLANK} bp / kb`,
                    `사진을 촬영하여 기록한다.`,
                ],
            },
        ],
        notes: [
            'EtBr은 발암물질이므로 반드시 장갑을 착용하고 지정된 구역에서 사용한다.',
            'Gel 농도 참고: 0.8% (5-10 kb), 1.0% (0.5-7 kb), 1.5% (0.2-3 kb), 2.0% (0.1-2 kb)',
            'RNA 확인 시 gel과 buffer를 RNase-free로 준비한다.',
            'Loading dye의 tracking dye 위치를 참고하여 전기영동 종료 시점을 결정한다.',
        ],
        tags: ['DNA separation', 'Gel imaging', 'Band analysis'],
    },

    // ==========================================
    // 7. Cell Culture - Subculture
    // ==========================================
    {
        id: 'cell_subculture',
        name: '세포 계대 배양',
        nameEn: 'Cell Subculture (Passage)',
        category: 'cell',
        icon: '🦠',
        description: '부착성 세포의 계대 배양 (trypsinization)',
        purpose: '성장한 부착성 세포를 효소적으로 분리하여 새로운 배양 용기에 적절한 밀도로 계대한다.',
        materials: [
            { name: 'Complete medium', amount: BLANK + ' mL' },
            { name: 'PBS (Ca²⁺, Mg²⁺ free)', amount: BLANK + ' mL' },
            { name: '0.25% Trypsin-EDTA', amount: BLANK + ' mL' },
            { name: 'Cell culture dish/flask', amount: BLANK },
            { name: 'Serum-containing medium (trypsin 중화용)', amount: BLANK + ' mL' },
        ],
        sections: [
            {
                title: '배지 제거 및 세척',
                steps: [
                    `배양 중인 세포의 confluency를 확인한다: ${BLANK} %`,
                    `기존 배지를 aspirate 한다.`,
                    `PBS ${BLANK} mL로 1-2회 gentle washing 한다.`,
                ],
            },
            {
                title: 'Trypsinization',
                steps: [
                    `0.25% Trypsin-EDTA ${BLANK} mL을 첨가한다.`,
                    `37°C 인큐베이터에서 ${BLANK} 분간 incubation 한다.`,
                    `현미경으로 세포 분리를 확인한다.`,
                    `Complete medium ${BLANK} mL을 첨가하여 trypsin을 중화시킨다.`,
                    `Pipetting으로 세포를 완전히 분리하고 현탁한다.`,
                ],
            },
            {
                title: '계대',
                steps: [
                    `세포 현탁액을 15 mL tube에 옮기고 ${BLANK} × g, ${BLANK} 분 원심분리한다.`,
                    `상층액을 제거하고 fresh medium ${BLANK} mL로 resuspend 한다.`,
                    `Cell counting 수행: ${BLANK} cells/mL`,
                    `새 dish/flask에 ${BLANK} cells을 seeding 한다.`,
                    `Split ratio: 1:${BLANK}`,
                    `Total volume을 ${BLANK} mL로 맞추고 37°C, 5% CO₂ 인큐베이터에 넣는다.`,
                ],
            },
        ],
        notes: [
            'Trypsin 처리 시간이 길어지면 세포 손상이 발생할 수 있으므로 주의한다.',
            '계대 번호 (passage number)를 반드시 기록한다.',
            '배양 조건: 37°C, 5% CO₂, 습도 95%',
            '세포주에 따라 trypsin 농도와 처리 시간을 조절한다.',
            'Mycoplasma 오염 검사를 정기적으로 수행한다.',
        ],
        tags: ['Cell passage', 'Trypsinization', 'Cell maintenance'],
    },

    // ==========================================
    // 8. Cell Transfection (Lipofection)
    // ==========================================
    {
        id: 'transfection',
        name: '세포 트랜스펙션',
        nameEn: 'Cell Transfection (Lipofection)',
        category: 'cell',
        icon: '💉',
        description: 'Lipofectamine을 이용한 세포 내 DNA/RNA 도입',
        purpose: '양이온성 리포좀(lipofectamine)을 이용하여 plasmid DNA 또는 siRNA를 세포 내로 도입한다.',
        materials: [
            { name: 'Lipofectamine 2000/3000', amount: BLANK + ' μL' },
            { name: 'Plasmid DNA 또는 siRNA', amount: BLANK + ' μg / pmol' },
            { name: 'Opti-MEM (serum-free medium)', amount: BLANK + ' μL' },
            { name: 'Complete medium (항생제 미포함)', amount: BLANK + ' mL' },
            { name: 'Cell culture plate', amount: BLANK + '-well plate' },
        ],
        sections: [
            {
                title: '세포 준비 (전날)',
                steps: [
                    `트랜스펙션 전날 ${BLANK}-well plate에 세포를 seeding 한다.`,
                    `Seeding density: ${BLANK} cells/well`,
                    `트랜스펙션 시 confluency 목표: ${BLANK} % (보통 70-80%)`,
                ],
            },
            {
                title: 'Lipofection Complex 준비',
                steps: [
                    `Tube A: DNA ${BLANK} μg을 Opti-MEM ${BLANK} μL에 희석한다.`,
                    `Tube B: Lipofectamine ${BLANK} μL을 Opti-MEM ${BLANK} μL에 희석한다.`,
                    `각각 5분간 상온에서 incubation 한다.`,
                    `Tube A와 Tube B를 합쳐 gentle pipetting으로 혼합한다.`,
                    `상온에서 ${BLANK} 분간 incubation 하여 complex를 형성시킨다 (20분 이내).`,
                ],
            },
            {
                title: '트랜스펙션',
                steps: [
                    `세포의 기존 배지를 제거한다.`,
                    `항생제가 없는 fresh medium ${BLANK} μL을 첨가한다.`,
                    `DNA-Lipofectamine complex를 세포에 dropwise로 첨가한다.`,
                    `Plate를 가볍게 흔들어 고르게 분포시킨다.`,
                    `37°C, 5% CO₂ 인큐베이터에서 ${BLANK} 시간 incubation 한다.`,
                    `${BLANK} 시간 후 complete medium으로 교체한다.`,
                ],
            },
            {
                title: '결과 확인',
                steps: [
                    `트랜스펙션 ${BLANK} 시간 후 형광/발현을 확인한다.`,
                    `트랜스펙션 효율: ${BLANK} %`,
                    `세포 생존율 확인: ${BLANK} %`,
                ],
            },
        ],
        notes: [
            '항생제가 포함된 배지는 사용하지 않는다 (세포 독성 증가).',
            'DNA:Lipofectamine 비율은 세포주에 따라 최적화가 필요하다.',
            'siRNA의 경우 최종 농도를 기록한다: ______ nM',
            'GFP reporter 등으로 트랜스펙션 효율을 모니터링한다.',
            'Complex 형성 시간은 20분을 초과하지 않도록 한다.',
        ],
        tags: ['Lipofection', 'Gene delivery', 'siRNA'],
    },

    // ==========================================
    // 9. Immunofluorescence (IF)
    // ==========================================
    {
        id: 'immunofluorescence',
        name: '면역형광염색',
        nameEn: 'Immunofluorescence (IF)',
        category: 'imaging',
        icon: '🔍',
        description: '형광 표지 항체를 이용한 세포 내 단백질 가시화',
        purpose: '형광 표지된 항체를 이용하여 세포 내 목적 단백질의 발현과 위치를 형광현미경으로 관찰한다.',
        materials: [
            { name: 'Coverslip (또는 confocal dish)', amount: BLANK + ' 개' },
            { name: '4% Paraformaldehyde (PFA)', amount: BLANK + ' μL' },
            { name: '0.1-0.5% Triton X-100 / PBS', amount: BLANK + ' μL' },
            { name: 'Blocking solution (BSA 또는 serum)', amount: BLANK + ' μL' },
            { name: 'Primary antibody', amount: BLANK + ' 희석' },
            { name: 'Secondary antibody (fluorescent)', amount: BLANK + ' 희석' },
            { name: 'DAPI (핵 염색)', amount: BLANK + ' μg/mL' },
            { name: 'Mounting medium', amount: '적량' },
            { name: 'PBS', amount: '적량' },
        ],
        sections: [
            {
                title: '세포 고정 (Fixation)',
                steps: [
                    `배양 배지를 제거하고 PBS로 ${BLANK} 회 세척한다.`,
                    `4% PFA ${BLANK} μL을 첨가하고 상온에서 ${BLANK} 분간 고정한다.`,
                    `PBS로 ${BLANK} 분 × ${BLANK} 회 세척한다.`,
                ],
            },
            {
                title: '투과화 및 Blocking',
                steps: [
                    `${BLANK} % Triton X-100 / PBS로 상온에서 ${BLANK} 분간 투과화(permeabilization)한다.`,
                    `PBS로 ${BLANK} 분 × ${BLANK} 회 세척한다.`,
                    `${BLANK} % BSA (또는 ${BLANK} % serum) / PBS로 상온에서 ${BLANK} 시간 blocking 한다.`,
                ],
            },
            {
                title: 'Antibody Incubation',
                steps: [
                    `Primary antibody를 blocking solution에 ${BLANK} 희석비로 준비한다.`,
                    `4°C에서 overnight (또는 상온 ${BLANK} 시간) incubation 한다.`,
                    `PBS로 ${BLANK} 분 × ${BLANK} 회 세척한다.`,
                    `Secondary antibody를 ${BLANK} 희석비로 준비한다 (빛 차단).`,
                    `상온에서 ${BLANK} 시간 incubation 한다 (빛 차단).`,
                    `PBS로 ${BLANK} 분 × ${BLANK} 회 세척한다.`,
                ],
            },
            {
                title: '핵 염색 및 마운팅',
                steps: [
                    `DAPI (${BLANK} μg/mL)를 첨가하고 ${BLANK} 분간 상온에서 incubation 한다.`,
                    `PBS로 ${BLANK} 분 × ${BLANK} 회 세척한다.`,
                    `Mounting medium을 slide glass에 떨어뜨리고 coverslip을 올린다.`,
                    `기포가 없도록 주의하며 nail polish로 가장자리를 밀봉한다.`,
                ],
            },
            {
                title: '이미징',
                steps: [
                    `형광현미경 (또는 confocal)으로 관찰한다.`,
                    `사용 채널: DAPI (${BLANK} nm), ${BLANK} (${BLANK} nm)`,
                    `대물렌즈: ${BLANK} ×`,
                    `이미지를 촬영하고 저장한다.`,
                ],
            },
        ],
        notes: [
            '형광 항체 처리 이후에는 빛을 차단하여 photobleaching을 방지한다.',
            'PFA는 독성이 있으므로 화학후드에서 취급한다.',
            '세포 표면 항원의 경우 투과화 단계를 생략할 수 있다.',
            'Confocal 촬영 시 laser intensity와 gain을 일정하게 유지한다.',
            '음성 대조군 (primary antibody 생략)을 반드시 포함한다.',
        ],
        tags: ['Fluorescence', 'Confocal', 'Protein localization'],
    },

    // ==========================================
    // 10. ELISA
    // ==========================================
    {
        id: 'elisa',
        name: 'ELISA (Sandwich)',
        nameEn: 'Enzyme-Linked Immunosorbent Assay',
        category: 'protein',
        icon: '📐',
        description: '항체를 이용한 단백질 정량 분석',
        purpose: 'Sandwich ELISA 방법으로 시료 중 목적 단백질(사이토카인 등)의 농도를 정량적으로 측정한다.',
        materials: [
            { name: 'ELISA plate (96-well, pre-coated 또는 미코팅)', amount: '1 plate' },
            { name: 'Capture antibody', amount: BLANK + ' 희석' },
            { name: 'Detection antibody (biotinylated)', amount: BLANK + ' 희석' },
            { name: 'Streptavidin-HRP', amount: BLANK + ' 희석' },
            { name: 'Standard protein', amount: BLANK + ' ng/mL (top)' },
            { name: 'Coating buffer (carbonate, pH 9.6)', amount: '적량' },
            { name: 'Blocking buffer', amount: '적량' },
            { name: 'Wash buffer (PBST)', amount: '적량' },
            { name: 'TMB substrate', amount: BLANK + ' μL/well' },
            { name: 'Stop solution (2N H₂SO₄)', amount: BLANK + ' μL/well' },
            { name: 'Sample', amount: BLANK },
        ],
        sections: [
            {
                title: 'Plate Coating (전날)',
                steps: [
                    `Capture antibody를 coating buffer에 ${BLANK} 희석비로 준비한다.`,
                    `각 well에 ${BLANK} μL씩 분주한다.`,
                    `4°C에서 overnight incubation 한다.`,
                ],
            },
            {
                title: 'Blocking',
                steps: [
                    `Coating 용액을 제거하고 wash buffer로 ${BLANK} 회 세척한다.`,
                    `Blocking buffer ${BLANK} μL를 각 well에 분주한다.`,
                    `상온에서 ${BLANK} 시간 incubation 한다.`,
                    `Wash buffer로 ${BLANK} 회 세척한다.`,
                ],
            },
            {
                title: 'Sample & Standard 처리',
                steps: [
                    `Standard를 serial dilution으로 준비한다: ${BLANK}, ${BLANK}, ${BLANK}, ... ng/mL`,
                    `시료를 필요시 ${BLANK} 배 희석한다.`,
                    `각 well에 ${BLANK} μL씩 분주한다.`,
                    `상온에서 ${BLANK} 시간 (또는 4°C overnight) incubation 한다.`,
                    `Wash buffer로 ${BLANK} 회 세척한다.`,
                ],
            },
            {
                title: 'Detection',
                steps: [
                    `Detection antibody를 ${BLANK} 희석비로 준비하여 각 well에 ${BLANK} μL씩 분주한다.`,
                    `상온에서 ${BLANK} 시간 incubation 한다.`,
                    `Wash buffer로 ${BLANK} 회 세척한다.`,
                    `Streptavidin-HRP를 ${BLANK} 희석비로 각 well에 ${BLANK} μL씩 분주한다.`,
                    `상온에서 ${BLANK} 분 incubation 한다.`,
                    `Wash buffer로 ${BLANK} 회 세척한다.`,
                ],
            },
            {
                title: '발색 및 측정',
                steps: [
                    `TMB substrate ${BLANK} μL를 각 well에 분주한다.`,
                    `빛을 차단하고 상온에서 ${BLANK} 분간 반응시킨다 (색 변화 관찰).`,
                    `Stop solution ${BLANK} μL를 첨가하여 반응을 종료한다.`,
                    `Microplate reader로 ${BLANK} nm (reference: ${BLANK} nm)에서 흡광도를 측정한다.`,
                    `Standard curve를 작성하여 시료 농도를 계산한다.`,
                ],
            },
        ],
        notes: [
            '세척 단계를 충분히 수행하여 비특이적 결합을 최소화한다.',
            'Standard curve의 R² 값은 0.99 이상이 바람직하다.',
            '시료의 농도가 standard range를 벗어나면 희석 배수를 조절한다.',
            'TMB 반응 시간은 모든 well에 동일하게 적용한다.',
            'Blank well을 반드시 포함한다.',
        ],
        tags: ['Immunoassay', 'Protein quantification', 'Cytokine'],
    },

    // ==========================================
    // 11. Bradford Protein Assay
    // ==========================================
    {
        id: 'bradford',
        name: 'Bradford 단백질 정량',
        nameEn: 'Bradford Protein Assay',
        category: 'protein',
        icon: '📊',
        description: 'Coomassie 염료를 이용한 단백질 농도 측정',
        purpose: 'Bradford reagent (Coomassie Brilliant Blue G-250)를 이용하여 시료의 총 단백질 농도를 분광광도법으로 정량한다.',
        materials: [
            { name: 'Bradford reagent (5× 또는 1×)', amount: BLANK + ' mL' },
            { name: 'BSA standard (2 mg/mL stock)', amount: BLANK + ' μL' },
            { name: 'Protein sample', amount: BLANK + ' μL' },
            { name: '96-well plate 또는 cuvette', amount: '1개' },
            { name: 'Distilled water', amount: '적량' },
        ],
        sections: [
            {
                title: 'Standard Curve 준비',
                steps: [
                    `BSA stock (${BLANK} mg/mL)으로 다음 농도의 standard를 준비한다:`,
                    `${BLANK}, ${BLANK}, ${BLANK}, ${BLANK}, ${BLANK}, ${BLANK} μg/mL`,
                    `Blank: distilled water (0 μg/mL)`,
                    `각 standard를 ${BLANK} μL씩 준비한다.`,
                ],
            },
            {
                title: 'Bradford Assay 수행',
                steps: [
                    `시료를 필요시 ${BLANK} 배 희석한다.`,
                    `96-well plate의 경우:`,
                    `  - Standard/시료 ${BLANK} μL + Bradford reagent ${BLANK} μL`,
                    `Cuvette의 경우:`,
                    `  - Standard/시료 ${BLANK} μL + Bradford reagent ${BLANK} μL`,
                    `잘 혼합하고 상온에서 ${BLANK} 분간 incubation 한다 (5-60분 이내).`,
                    `${BLANK} nm에서 흡광도를 측정한다.`,
                ],
            },
            {
                title: '농도 계산',
                steps: [
                    `Standard curve를 작성한다 (x축: 농도, y축: 흡광도).`,
                    `Linear regression으로 시료 농도를 계산한다.`,
                    `희석 배수를 곱하여 원래 시료 농도를 구한다.`,
                    `시료 농도: ${BLANK} μg/μL`,
                ],
            },
        ],
        notes: [
            '측정은 시약 첨가 후 5-60분 이내에 수행한다.',
            'SDS, Triton X-100 등 계면활성제가 많으면 간섭이 발생할 수 있다.',
            'Standard와 시료를 동일한 buffer 조건으로 준비한다.',
            'Duplicate 또는 triplicate로 수행하여 정확도를 높인다.',
        ],
        tags: ['Protein quantification', 'Spectrophotometry', 'BSA standard'],
    },

    // ==========================================
    // 12. Bacterial Transformation
    // ==========================================
    {
        id: 'transformation',
        name: '세균 형질전환',
        nameEn: 'Bacterial Transformation (Heat Shock)',
        category: 'micro',
        icon: '🧪',
        description: 'Heat shock법을 이용한 대장균 형질전환',
        purpose: 'Chemically competent cell에 heat shock을 가하여 외래 plasmid DNA를 대장균 내로 도입한다.',
        materials: [
            { name: 'Competent cell (DH5α, BL21 등)', amount: BLANK + ' μL' },
            { name: 'Plasmid DNA', amount: BLANK + ' ng' },
            { name: 'SOC medium (또는 LB)', amount: BLANK + ' μL' },
            { name: 'LB agar plate (+ 항생제)', amount: BLANK + ' 장' },
            { name: '항생제: ' + BLANK, amount: BLANK + ' μg/mL' },
        ],
        sections: [
            {
                title: 'Transformation',
                steps: [
                    `Competent cell ${BLANK} μL을 ice에서 해동한다 (${BLANK} 분).`,
                    `Plasmid DNA ${BLANK} ng (${BLANK} μL)을 첨가하고 gentle flicking으로 혼합한다.`,
                    `Ice에서 ${BLANK} 분간 incubation 한다.`,
                    `${BLANK} °C water bath에서 정확히 ${BLANK} 초간 heat shock를 가한다.`,
                    `즉시 ice에서 ${BLANK} 분간 incubation 한다.`,
                    `SOC medium ${BLANK} μL을 첨가한다.`,
                    `${BLANK} °C, ${BLANK} rpm에서 ${BLANK} 분간 recovery incubation 한다.`,
                ],
            },
            {
                title: 'Plating',
                steps: [
                    `${BLANK} μL을 항생제가 포함된 LB agar plate에 도말한다.`,
                    `필요시 나머지를 원심분리하여 농축 후 도말한다.`,
                    `37°C 인큐베이터에서 overnight (${BLANK} 시간) 배양한다.`,
                ],
            },
            {
                title: '결과 확인',
                steps: [
                    `Colony 수를 counting 한다: ${BLANK} CFU`,
                    `양성 대조군 colony 수: ${BLANK} CFU`,
                    `음성 대조군 (DNA 미첨가) colony 수: ${BLANK} CFU`,
                    `Single colony를 picking 하여 liquid culture를 시작한다.`,
                ],
            },
        ],
        notes: [
            'Competent cell은 반드시 ice에서 해동하고, 재동결하지 않는다.',
            'Heat shock 시간을 정확히 지킨다 (보통 42°C, 45초).',
            'DNA 양이 너무 많으면 satellite colony가 나타날 수 있다.',
            'Transformation efficiency: ______ CFU/μg DNA',
            'Blue-white screening이 필요한 경우 X-gal/IPTG plate를 사용한다.',
        ],
        tags: ['Cloning', 'Competent cell', 'Heat shock'],
    },

    // ==========================================
    // 13. MTT Assay
    // ==========================================
    {
        id: 'mtt_assay',
        name: 'MTT 세포 생존율 분석',
        nameEn: 'MTT Cell Viability Assay',
        category: 'cell',
        icon: '💜',
        description: 'MTT 환원을 이용한 세포 생존율/증식 측정',
        purpose: '살아있는 세포의 미토콘드리아 탈수소효소가 MTT를 불용성 formazan으로 환원하는 원리를 이용하여 세포 생존율을 정량한다.',
        materials: [
            { name: 'MTT solution (5 mg/mL in PBS)', amount: BLANK + ' μL' },
            { name: 'DMSO (또는 SDS-HCl)', amount: BLANK + ' μL' },
            { name: '96-well cell culture plate', amount: '1 plate' },
            { name: 'Complete medium', amount: '적량' },
            { name: '처리 약물/시료', amount: BLANK },
        ],
        sections: [
            {
                title: '세포 준비',
                steps: [
                    `96-well plate에 세포를 seeding 한다: ${BLANK} cells/well`,
                    `Total volume: ${BLANK} μL/well`,
                    `37°C, 5% CO₂에서 overnight 배양하여 부착시킨다.`,
                ],
            },
            {
                title: '약물 처리',
                steps: [
                    `약물을 다음 농도로 준비한다: ${BLANK}`,
                    `각 well의 배지를 교체하고 약물이 포함된 medium을 첨가한다.`,
                    `Vehicle control (${BLANK})을 포함한다.`,
                    `${BLANK} 시간 동안 37°C에서 incubation 한다.`,
                    `각 조건을 ${BLANK} 개의 replicate로 수행한다.`,
                ],
            },
            {
                title: 'MTT 처리 및 측정',
                steps: [
                    `MTT solution (5 mg/mL)을 각 well에 ${BLANK} μL 첨가한다.`,
                    `37°C에서 ${BLANK} 시간 incubation 한다 (보통 2-4시간).`,
                    `배지를 조심스럽게 제거한다 (formazan crystal 유지).`,
                    `DMSO ${BLANK} μL을 첨가하여 formazan을 용해시킨다.`,
                    `Plate shaker에서 ${BLANK} 분간 혼합한다.`,
                    `Microplate reader로 ${BLANK} nm (reference: ${BLANK} nm)에서 흡광도를 측정한다.`,
                ],
            },
            {
                title: '데이터 분석',
                steps: [
                    `세포 생존율 (%) = (OD 처리군 / OD 대조군) × 100`,
                    `IC₅₀ 값 계산: ${BLANK}`,
                    `결과를 dose-response curve로 작성한다.`,
                ],
            },
        ],
        notes: [
            'MTT solution은 filter sterilization 후 4°C, 차광 보관한다.',
            '배지에 phenol red가 있으면 간섭이 될 수 있으므로 측정 전 확인한다.',
            'Formazan crystal이 완전히 용해되었는지 확인한 후 측정한다.',
            'Edge effect를 최소화하기 위해 plate 가장자리 well은 사용하지 않을 수 있다.',
        ],
        tags: ['Cell viability', 'Cytotoxicity', 'Drug screening'],
    },

    // ==========================================
    // 14. Immunoprecipitation (Co-IP)
    // ==========================================
    {
        id: 'co_ip',
        name: '면역침강 (Co-IP)',
        nameEn: 'Co-Immunoprecipitation',
        category: 'protein',
        icon: '🎯',
        description: '항체를 이용한 단백질-단백질 상호작용 확인',
        purpose: '특정 항체를 이용하여 목적 단백질과 그 결합 파트너를 함께 침강시켜 단백질-단백질 상호작용을 확인한다.',
        materials: [
            { name: 'Cell lysate', amount: BLANK + ' μg protein' },
            { name: 'IP antibody', amount: BLANK + ' μg' },
            { name: 'IgG control antibody', amount: BLANK + ' μg' },
            { name: 'Protein A/G agarose beads', amount: BLANK + ' μL' },
            { name: 'Lysis buffer (NP-40 또는 RIPA)', amount: BLANK + ' mL' },
            { name: 'Wash buffer', amount: '적량' },
            { name: '2× SDS loading buffer', amount: BLANK + ' μL' },
        ],
        sections: [
            {
                title: '세포 용해',
                steps: [
                    `세포를 cold PBS로 세척 후 lysis buffer ${BLANK} μL로 용해한다.`,
                    `4°C에서 ${BLANK} 분간 incubation (rotation)한다.`,
                    `${BLANK} × g, ${BLANK} 분, 4°C에서 원심분리한다.`,
                    `상층액을 새 tube에 옮기고 단백질을 정량한다.`,
                    `Input sample로 ${BLANK} μL (총 단백질의 ${BLANK} %)을 따로 보관한다.`,
                ],
            },
            {
                title: 'Pre-clearing (선택)',
                steps: [
                    `Protein A/G beads ${BLANK} μL을 lysate에 첨가한다.`,
                    `4°C에서 ${BLANK} 시간 rotation 한다.`,
                    `원심분리 후 상층액을 새 tube에 옮긴다.`,
                ],
            },
            {
                title: 'Immunoprecipitation',
                steps: [
                    `Lysate ${BLANK} μg을 두 개의 tube에 분주한다:`,
                    `  - IP tube: IP antibody ${BLANK} μg 첨가`,
                    `  - Control tube: IgG ${BLANK} μg 첨가`,
                    `4°C에서 overnight rotation incubation 한다.`,
                    `Protein A/G beads ${BLANK} μL을 각 tube에 첨가한다.`,
                    `4°C에서 ${BLANK} 시간 rotation incubation 한다.`,
                ],
            },
            {
                title: 'Wash & Elution',
                steps: [
                    `Beads를 wash buffer로 ${BLANK} 회 세척한다 (${BLANK} × g, ${BLANK} 분).`,
                    `마지막 세척 후 상층액을 완전히 제거한다.`,
                    `2× SDS loading buffer ${BLANK} μL을 첨가한다.`,
                    `${BLANK} °C에서 ${BLANK} 분간 가열하여 elution 한다.`,
                    `원심분리 후 상층액을 SDS-PAGE에 loading 한다.`,
                ],
            },
            {
                title: 'Western Blot 확인',
                steps: [
                    `Input, IP, IgG control 시료를 SDS-PAGE로 분리한다.`,
                    `Western blot으로 목적 단백질 및 결합 단백질을 확인한다.`,
                    `사용 항체: ${BLANK}`,
                ],
            },
        ],
        notes: [
            '모든 과정은 4°C에서 수행하여 단백질 분해를 방지한다.',
            'Lysis buffer에 protease/phosphatase inhibitor를 반드시 첨가한다.',
            'IgG heavy chain (~55 kDa)과 light chain (~25 kDa) band에 주의한다.',
            'Mild lysis buffer (NP-40)를 사용하면 약한 상호작용도 보존할 수 있다.',
        ],
        tags: ['Protein interaction', 'Pulldown', 'Western blot'],
    },
];

// 새롭게 추가된 타임코스 웨스턴 블롯 프로토콜
DEFAULT_PROTOCOLS.unshift({
    id: 'timecourse_wb_6well_pooling',
    name: '타임코스 웨스턴 블롯 (6-well Pooling)',
    nameEn: 'Timecourse Western Blot (1 Timepoint = 1 Plate)',
    category: 'protein',
    icon: '⏱️',
    description: '1타임포인트 = 1플레이트 방식의 직관적인 타임코스 샘플 수확 및 웨스턴 블롯 프로토콜',
    purpose: '헷갈림 없이 정확한 시간대별 샘플을 수확하고, 충분한 단백질 양을 확보하여 WT과 KO 세포주 간의 단백질 발현 및 절단 양상을 비교 분석한다.',
    materials: [
        { name: '24-well plate', amount: '6 장' },
        { name: '96-well plate (백업용)', amount: '1 장' },
        { name: 'WT 세포', amount: '36 wells' },
        { name: 'Zbp1 KO 세포', amount: '36 wells' },
        { name: 'Nlrp3 KO 세포', amount: '36 wells' },
        { name: 'PR8 바이러스', amount: '______' },
        { name: 'Cold PBS', amount: '______ mL' },
        { name: 'RIPA buffer (+ Protease/Phosphatase inhibitor)', amount: '______ μL' },
        { name: '4X SDS Sample buffer', amount: '______ μL' },
        { name: 'Cell scraper', amount: '다수' }
    ],
    sections: [
        {
            title: 'Phase 1: 세포 Seeding 및 준비 (오늘)',
            steps: [
                '24-well 플레이트 총 6장을 모두 동일한 레이아웃으로 세포를 준비한다.',
                'Row A (1~6번 웰): WT 세포 Seeding (총 36웰 소모)',
                'Row B (1~6번 웰): Zbp1 KO 세포 Seeding (총 36웰 소모)',
                'Row C (1~6번 웰): Nlrp3 KO 세포 Seeding (총 36웰 소모)',
                'Row D: 사용하지 않음 (건조 방지용으로 배지나 PBS를 채워둠).',
                '남는 세포를 이용해 백업용 96-well 플레이트에 WT, Zbp1 KO, Nlrp3 KO를 소량 분주해 둔다.'
            ]
        },
        {
            title: 'Phase 2: 감염 및 수확 타임라인 (내일)',
            steps: [
                '07:30 AM: 전 플레이트 PR8 바이러스 접종 (1시간 Adsorption)',
                '08:30 AM (0 h): 배지 교체 및 [0h 샘플 수확] (수확 후 즉시 동물실 이동)',
                '09:00 AM ~ 01:00 PM: 🛑 동물실 업무 (실험실 공백 구간)',
                '02:30 PM (6 h): [6h 샘플 수확] (Lag phase 발현 확인)',
                '05:30 PM (9 h): [9h 샘플 수확] (사멸 직전 센서 단백질 최고조 기점)',
                '08:30 PM (12 h): [12h 샘플 수확] (사멸 한가운데 핵심 Cleavage 기점)',
                '11:30 PM (15 h): [15h 샘플 수확] -> 모든 샘플 냉동고 보관 후 깔끔하게 자정 전 퇴근!',
                '다음 날 08:30 AM (24 h): [24h 최종 수확] 후 실험 종료'
            ]
        },
        {
            title: 'Phase 3: 단일 플레이트 수확 (Harvest) 디테일',
            steps: [
                '매 수확 시간(예: 오후 2시 30분)이 되면, 인큐베이터에서 딱 1장의 플레이트만 꺼낸다.',
                '플레이트의 모든 배지를 석션하고, 차가운 PBS로 1회 워싱한다.',
                'Row A (WT)의 6개 웰에 Protease/Phosphatase inhibitor가 포함된 RIPA 버퍼를 50 μl씩 떨어뜨린다. (총 300 μl)',
                '스크래퍼 하나로 1번 웰부터 6번 웰까지 차례대로 긁어준다.',
                '파이펫을 이용해 6개 웰의 액체를 1.5ml 튜브 하나에 모두 긁어모은다. (약 280 μl 회수됨)',
                'Row B (Zbp1 KO)와 Row C (Nlrp3 KO)도 스크래퍼를 바꿔가며 동일한 방식으로 각각의 튜브에 모은다.',
                '각 튜브에 4X SDS Sample buffer 100 μl를 넣고 파이펫팅하여 섞어준다. (최종 부피 약 380~400 μl의 넉넉한 3배 농축 샘플 완성)',
                '튜브는 즉시 -20°C 또는 -80°C 냉동고에 넣고 긁어낸 플레이트는 미련 없이 쓰레기통에 버린다.'
            ]
        },
        {
            title: 'Phase 4: 파쇄 및 Western Blot 로딩 (모든 수확 종료 후)',
            steps: [
                '냉동해 둔 18개의 샘플(6개 타임포인트 x 3종)을 얼음 위에서 완전히 녹인다.',
                '부피가 400 μl로 아주 넉넉하므로, 인슐린 주사기(26G~31G)를 사용해 샘플당 10회씩 강하게 펌핑(Syringing)하여 gDNA를 완벽히 끊어준다. (샘플마다 새 주사기 사용 필수)',
                '95~100°C 히팅 블록에서 5~10분간 끓이고 상온에서 식힌 후, 스핀다운(Spin-down)하여 액체를 모은다.',
                'Twin Gel 로딩 맵에 따라 15-well 겔 2장에 샘플 볼륨이 넉넉하므로 각 웰당 20~25 μl씩 풀 로딩한다.',
                'Gel 1 (Early Phase): Marker | WT 0h | 6h | 9h | Blank | Zbp1 0h | 6h | 9h | Blank | Nlrp3 0h | 6h | 9h | Blank | Blank | Blank',
                'Gel 2 (Late Phase): Marker | WT 12h | 15h | 24h | Blank | Zbp1 12h | 15h | 24h | Blank | Nlrp3 12h | 15h | 24h | Blank | Blank | Blank',
                '똑같은 맵으로 2세트(Twin Gel)를 내려서 하나는 ZBP1, 하나는 NLRP3를 프로빙한다. (Actin은 둘 다 확인)'
            ]
        }
    ],
    notes: [
        '동물실 일정(09:00~13:00)을 완벽히 피하고 자정 전에 퇴근할 수 있는 시간표입니다.',
        '각 타임포인트마다 1장의 플레이트만 꺼내서 헷갈림을 원천 차단합니다.',
        'gDNA 파쇄 시 샘플 간 교차 오염을 막기 위해 반드시 매 샘플마다 새 인슐린 주사기를 사용하세요.',
        '로딩 샘플 양이 넉넉하므로(약 400 μl), 필요에 따라 여러 번의 웨스턴 블롯이 가능합니다.'
    ],
    tags: ['Timecourse', 'Western Blot', 'Infection', 'Sample pooling']
});
