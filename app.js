/**
 * app.js
 * 실험 프로토콜 생성기 - 메인 어플리케이션 로직
 * Protocol selection, preview rendering, Word document generation, and CRUD operations.
 */

// ========================================
// State
// ========================================
const state = {
    protocols: [], // Loaded from localStorage or DEFAULT_PROTOCOLS
    selectedProtocols: new Set(),
    previewVisible: true,
    editingProtocolId: null, // null means creating new
    protocolToDelete: null,
};



// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initDate();
    loadProtocols();
    renderProtocolCards();
    setupCategoryFilter();
    updateSelectionUI();
});

function initDate() {
    const dateInput = document.getElementById('input-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

// Load protocols from localStorage or use defaults
function loadProtocols() {
    const saved = localStorage.getItem('lab_protocols');
    if (saved) {
        try {
            state.protocols = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved protocols', e);
            state.protocols = JSON.parse(JSON.stringify(DEFAULT_PROTOCOLS));
        }
    } else {
        state.protocols = JSON.parse(JSON.stringify(DEFAULT_PROTOCOLS));
    }
}

// Save protocols to localStorage
function saveProtocolsToStorage() {
    localStorage.setItem('lab_protocols', JSON.stringify(state.protocols));
}

function resetToDefaults() {
    if (confirm('모든 사용자 정의 프로토콜을 삭제하고 기본 제공 프로토콜로 초기화하시겠습니까?')) {
        state.protocols = JSON.parse(JSON.stringify(DEFAULT_PROTOCOLS));
        state.selectedProtocols.clear();
        saveProtocolsToStorage();
        renderProtocolCards();
        updateSelectionUI();
        showToast('기본 프로토콜로 초기화되었습니다.');
    }
}

// ========================================
// Protocol Cards
// ========================================
function renderProtocolCards(filterCategory = 'all') {
    const grid = document.getElementById('protocol-grid');
    grid.innerHTML = '';

    const filtered = filterCategory === 'all'
        ? state.protocols
        : state.protocols.filter(p => p.category === filterCategory);

    filtered.forEach((protocol, index) => {
        const card = document.createElement('div');
        card.className = `protocol-card ${state.selectedProtocols.has(protocol.id) ? 'selected' : ''}`;
        card.dataset.id = protocol.id;
        card.dataset.category = protocol.category;
        card.style.animationDelay = `${Math.min(index * 0.05, 0.5)}s`;
        card.onclick = (e) => {
            // Prevent toggling if clicking on actions
            if (!e.target.closest('.card-actions')) {
                toggleProtocol(protocol.id);
            }
        };

        card.innerHTML = `
            <div class="card-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
            
            <div class="card-actions">
                <button class="card-action-btn edit-btn" onclick="openEditor('${protocol.id}')" title="수정">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="card-action-btn delete-btn" onclick="promptDelete('${protocol.id}')" title="삭제">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>

            <span class="card-icon">${protocol.icon || '🧪'}</span>
            <div class="card-category ${protocol.category}">${CATEGORY_LABELS[protocol.category] || '기타'}</div>
            <div class="card-title">${protocol.name}</div>
            <div class="card-title-en">${protocol.nameEn || ''}</div>
            <div class="card-desc">${protocol.description || ''}</div>
            <div class="card-tags">
                ${(protocol.tags || []).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
            </div>
        `;

        grid.appendChild(card);
    });
}

// ========================================
// Category Filter
// ========================================
function setupCategoryFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProtocolCards(btn.dataset.category);
        });
    });
}

// ========================================
// Protocol Selection Toggle
// ========================================
function toggleProtocol(id) {
    if (state.selectedProtocols.has(id)) {
        state.selectedProtocols.delete(id);
    } else {
        state.selectedProtocols.add(id);
    }

    const cards = document.querySelectorAll('.protocol-card');
    cards.forEach(card => {
        if (card.dataset.id === id) {
            card.classList.toggle('selected');
        }
    });

    updateSelectionUI();
}

function removeProtocol(id) {
    state.selectedProtocols.delete(id);
    const cards = document.querySelectorAll('.protocol-card');
    cards.forEach(card => {
        if (card.dataset.id === id) {
            card.classList.remove('selected');
        }
    });
    updateSelectionUI();
}

// ========================================
// Protocol CRUD Modal Logic
// ========================================
function generateId() {
    return 'proto_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function openEditor(id = null) {
    state.editingProtocolId = id;
    const modal = document.getElementById('editor-modal');
    const title = document.getElementById('editor-title');
    
    // Clear dynamic areas
    document.getElementById('ed-materials').innerHTML = '';
    document.getElementById('ed-sections').innerHTML = '';
    document.getElementById('ed-notes').innerHTML = '';
    
    if (id) {
        title.textContent = '프로토콜 수정';
        const protocol = state.protocols.find(p => p.id === id);
        if (!protocol) return;
        
        document.getElementById('ed-name').value = protocol.name;
        document.getElementById('ed-name-en').value = protocol.nameEn || '';
        document.getElementById('ed-category').value = protocol.category;
        document.getElementById('ed-icon').value = protocol.icon || '🧪';
        document.getElementById('ed-description').value = protocol.description || '';
        document.getElementById('ed-purpose').value = protocol.purpose || '';
        
        // Materials
        if (protocol.materials) {
            protocol.materials.forEach(m => addMaterialRow(m.name, m.amount));
        }
        
        // Sections
        if (protocol.sections) {
            protocol.sections.forEach(s => {
                const secEl = addSection(s.title);
                s.steps.forEach(step => addStep(secEl, step));
            });
        }
        
        // Notes
        if (protocol.notes) {
            protocol.notes.forEach(n => addNote(n));
        }
        
    } else {
        title.textContent = '새 프로토콜 추가';
        document.getElementById('protocol-form').reset();
        document.getElementById('ed-icon').value = '🧪';
        
        // Add one empty row for each by default
        addMaterialRow();
        const sec = addSection('실험 준비');
        addStep(sec);
    }
    
    modal.classList.add('open');
}

function closeEditor() {
    document.getElementById('editor-modal').classList.remove('open');
}

function pickIcon(icon) {
    document.getElementById('ed-icon').value = icon;
}

// Dynamic form elements
function addMaterialRow(name = '', amount = '') {
    const container = document.getElementById('ed-materials');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <input type="text" class="input-material-name" placeholder="시약/재료명" value="${name.replace(/"/g, '&quot;')}">
        <input type="text" class="input-material-amount" placeholder="용량 (예: ${BLANK} mL)" value="${amount.replace(/"/g, '&quot;')}">
        <button type="button" class="btn-remove-row" onclick="this.parentElement.remove()" title="삭제">✕</button>
    `;
    container.appendChild(row);
}

function addNote(text = '') {
    const container = document.getElementById('ed-notes');
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
        <input type="text" placeholder="주의사항 입력" value="${text.replace(/"/g, '&quot;')}">
        <button type="button" class="btn-remove-row" onclick="this.parentElement.remove()" title="삭제">✕</button>
    `;
    container.appendChild(row);
}

function addSection(title = '') {
    const container = document.getElementById('ed-sections');
    const section = document.createElement('div');
    section.className = 'editor-section-block';
    
    // Unique ID for the steps container
    const stepsId = 'steps_' + Date.now() + Math.floor(Math.random() * 1000);
    
    section.innerHTML = `
        <div class="editor-section-header">
            <input type="text" class="input-section-title" placeholder="섹션 제목 (예: 시료 준비)" value="${title.replace(/"/g, '&quot;')}">
            <button type="button" class="btn-remove-row" onclick="this.closest('.editor-section-block').remove()" title="섹션 삭제">✕</button>
        </div>
        <div class="editor-section-steps" id="${stepsId}">
            <!-- steps go here -->
        </div>
        <button type="button" class="btn-add-step" onclick="addStep(document.getElementById('${stepsId}').parentElement)">+ 단계 추가</button>
    `;
    container.appendChild(section);
    return section;
}

function addStep(sectionEl, text = '') {
    const stepsContainer = sectionEl.querySelector('.editor-section-steps');
    const stepRow = document.createElement('div');
    stepRow.className = 'editor-step-row';
    stepRow.innerHTML = `
        <span class="step-number">•</span>
        <textarea rows="1" placeholder="수행할 작업을 입력하세요">${text}</textarea>
        <button type="button" class="btn-remove-row" onclick="this.parentElement.remove()" title="삭제">✕</button>
    `;
    stepsContainer.appendChild(stepRow);
}

function saveProtocol(e) {
    e.preventDefault();
    
    const name = document.getElementById('ed-name').value.trim();
    if (!name) {
        alert('프로토콜 이름을 입력해주세요.');
        return;
    }
    
    const protocol = {
        id: state.editingProtocolId || generateId(),
        name,
        nameEn: document.getElementById('ed-name-en').value.trim(),
        category: document.getElementById('ed-category').value,
        icon: document.getElementById('ed-icon').value || '🧪',
        description: document.getElementById('ed-description').value.trim(),
        purpose: document.getElementById('ed-purpose').value.trim(),
        tags: [], // Could implement tag editing later if needed
        materials: [],
        sections: [],
        notes: [],
    };
    
    // Gather materials
    document.querySelectorAll('#ed-materials .dynamic-row').forEach(row => {
        const inputs = row.querySelectorAll('input');
        const mName = inputs[0].value.trim();
        const mAmount = inputs[1].value.trim();
        if (mName) {
            protocol.materials.push({ name: mName, amount: mAmount });
        }
    });
    
    // Gather sections
    document.querySelectorAll('.editor-section-block').forEach(secBlock => {
        const title = secBlock.querySelector('.input-section-title').value.trim();
        const steps = [];
        secBlock.querySelectorAll('.editor-step-row textarea').forEach(ta => {
            const stepText = ta.value.trim();
            if (stepText) steps.push(stepText);
        });
        
        if (title || steps.length > 0) {
            protocol.sections.push({ title: title || '진행 과정', steps });
        }
    });
    
    // Gather notes
    document.querySelectorAll('#ed-notes .dynamic-row input').forEach(input => {
        const note = input.value.trim();
        if (note) protocol.notes.push(note);
    });
    
    if (state.editingProtocolId) {
        const idx = state.protocols.findIndex(p => p.id === state.editingProtocolId);
        if (idx !== -1) {
            // Preserve existing tags
            protocol.tags = state.protocols[idx].tags || [];
            state.protocols[idx] = protocol;
        }
    } else {
        state.protocols.push(protocol);
    }
    
    saveProtocolsToStorage();
    closeEditor();
    
    // Re-render
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    renderProtocolCards(activeCategory);
    
    if (state.selectedProtocols.has(protocol.id)) {
        updateSelectionUI();
    }
    
    showToast('프로토콜이 저장되었습니다.');
}

// ========================================
// Delete Modal Logic
// ========================================
function promptDelete(id) {
    state.protocolToDelete = id;
    const protocol = state.protocols.find(p => p.id === id);
    if (!protocol) return;
    
    document.getElementById('delete-protocol-name').textContent = protocol.name;
    document.getElementById('delete-modal').classList.add('open');
}

function closeDeleteModal() {
    state.protocolToDelete = null;
    document.getElementById('delete-modal').classList.remove('open');
}

function confirmDelete() {
    if (!state.protocolToDelete) return;
    
    state.protocols = state.protocols.filter(p => p.id !== state.protocolToDelete);
    state.selectedProtocols.delete(state.protocolToDelete);
    
    saveProtocolsToStorage();
    closeDeleteModal();
    
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    renderProtocolCards(activeCategory);
    updateSelectionUI();
    
    showToast('프로토콜이 삭제되었습니다.');
}

// ========================================
// Update Selection UI
// ========================================
function updateSelectionUI() {
    const summary = document.getElementById('selected-summary');
    const previewPanel = document.getElementById('preview-panel');
    const downloadArea = document.getElementById('download-area');

    if (state.selectedProtocols.size === 0) {
        summary.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>프로토콜을 선택해주세요</p>
                <span class="empty-hint">위에서 원하는 프로토콜 카드를 클릭하세요</span>
            </div>
        `;
        previewPanel.style.display = 'none';
        downloadArea.style.display = 'none';
        return;
    }

    // Render selected chips
    const selectedList = Array.from(state.selectedProtocols).map(id => {
        const protocol = state.protocols.find(p => p.id === id);
        if (!protocol) return ''; // Safely handle deleted but selected items just in case
        return `
            <div class="selected-chip">
                <span>${protocol.icon || '🧪'} ${protocol.name}</span>
                <button class="chip-remove" onclick="event.stopPropagation(); removeProtocol('${id}')">✕</button>
            </div>
        `;
    }).join('');

    summary.innerHTML = `
        <div class="selected-list">${selectedList}</div>
    `;

    previewPanel.style.display = 'block';
    downloadArea.style.display = 'flex';

    renderPreview();
}

// ========================================
// Preview Rendering
// ========================================
function togglePreview() {
    const content = document.getElementById('preview-content');
    const btn = document.getElementById('btn-toggle-preview');
    state.previewVisible = !state.previewVisible;

    if (state.previewVisible) {
        content.style.display = 'block';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            미리보기 접기
        `;
    } else {
        content.style.display = 'none';
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            미리보기 펼치기
        `;
    }
}

function renderPreview() {
    const container = document.getElementById('preview-content');
    const experimenter = document.getElementById('input-experimenter').value || BLANK;
    const date = document.getElementById('input-date').value || BLANK;
    const project = document.getElementById('input-project').value || '';
    const lab = document.getElementById('input-lab').value || '';
    const purpose = document.getElementById('input-purpose').value || '';

    const formattedDate = date !== BLANK
        ? new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
        : date;

    let html = `
        <div class="doc-title">실험 프로토콜</div>
        <table class="doc-info-table">
            <tr><td>실험자</td><td>${experimenter}</td><td>실험 날짜</td><td>${formattedDate}</td></tr>
            ${project || lab ? `<tr>${project ? `<td>프로젝트</td><td>${project}</td>` : '<td></td><td></td>'}${lab ? `<td>실험실</td><td>${lab}</td>` : '<td></td><td></td>'}</tr>` : ''}
        </table>
    `;

    if (purpose) {
        html += `
            <div class="doc-purpose-section">
                <strong>실험 목적</strong>
                <p>${purpose.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }

    const selectedProtocols = Array.from(state.selectedProtocols)
        .map(id => state.protocols.find(p => p.id === id))
        .filter(p => !!p);

    selectedProtocols.forEach((protocol, idx) => {
        html += `
            <div class="doc-protocol">
                <div class="doc-protocol-title">${idx + 1}. ${protocol.name}</div>
                <div class="doc-protocol-subtitle">${protocol.nameEn || ''}</div>
                ${protocol.purpose ? `<div class="doc-purpose"><strong>프로토콜 목적:</strong> ${protocol.purpose}</div>` : ''}

                <div class="doc-section-title">📦 필요 시약 및 재료</div>
                <table class="doc-materials-table">
                    <thead>
                        <tr><th>시약/재료</th><th>용량/농도</th></tr>
                    </thead>
                    <tbody>
                        ${(protocol.materials || []).map(m => `
                            <tr>
                                <td>${m.name}</td>
                                <td>${(m.amount || '').replace(/______+/g, '<span class="doc-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                ${(protocol.sections || []).map(section => `
                    <div class="doc-section-title">📝 ${section.title}</div>
                    <ol class="doc-steps">
                        ${(section.steps || []).map(step => `
                            <li class="doc-step">${step.replace(/______+/g, '<span class="doc-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>')}</li>
                        `).join('')}
                    </ol>
                `).join('')}

                ${protocol.notes && protocol.notes.length > 0 ? `
                    <div class="doc-notes">
                        <div class="doc-notes-title">⚠️ 주의사항 및 Tips</div>
                        <ul>
                            ${protocol.notes.map(note => `<li>${note.replace(/______+/g, '<span class="doc-blank">&nbsp;&nbsp;&nbsp;&nbsp;</span>')}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `
        <div class="doc-signature-area">
            <div class="doc-signature-block">
                <span class="doc-signature-line"></span>
                실험자 서명
            </div>
            <div class="doc-signature-block">
                <span class="doc-signature-line"></span>
                지도교수 확인
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Listen for input changes to update preview
document.addEventListener('input', (e) => {
    if (['input-experimenter', 'input-date', 'input-project', 'input-lab', 'input-purpose'].includes(e.target.id)) {
        if (state.selectedProtocols.size > 0) {
            renderPreview();
        }
    }
});

// ========================================
// Word Document Generation
// ========================================
async function downloadDocx() {
    const btn = document.getElementById('btn-download');
    btn.disabled = true;
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        생성 중...
    `;

    try {
        const {
            Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
            AlignmentType, HeadingLevel, WidthType, BorderStyle, PageBreak,
            ShadingType, UnderlineType, TabStopType, TabStopPosition,
            Header, Footer, PageNumber, NumberFormat
        } = docx;

        const experimenter = document.getElementById('input-experimenter').value || BLANK;
        const dateVal = document.getElementById('input-date').value;
        const project = document.getElementById('input-project').value || '';
        const lab = document.getElementById('input-lab').value || '';
        const experimentPurpose = document.getElementById('input-purpose').value || '';

        const formattedDate = dateVal
            ? new Date(dateVal).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
            : BLANK;

        const selectedProtocols = Array.from(state.selectedProtocols)
            .map(id => state.protocols.find(p => p.id === id))
            .filter(p => !!p);

        // Build document sections
        const children = [];

        // Title
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: '실험 프로토콜',
                        bold: true,
                        size: 36,
                        font: 'Malgun Gothic',
                    }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
                border: {
                    bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' },
                },
            })
        );

        // Info table
        const infoBorders = {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        };

        const makeInfoCell = (text, isHeader = false) => new TableCell({
            children: [new Paragraph({
                children: [new TextRun({ text, bold: isHeader, size: 20, font: 'Malgun Gothic' })],
                spacing: { before: 40, after: 40 },
            })],
            shading: isHeader ? { type: ShadingType.SOLID, color: 'F0F0F0' } : undefined,
            width: { size: isHeader ? 1500 : 3500, type: WidthType.DXA },
            borders: infoBorders,
        });

        const infoRows = [
            new TableRow({ children: [
                makeInfoCell('실험자', true), makeInfoCell(experimenter),
                makeInfoCell('날짜', true), makeInfoCell(formattedDate),
            ]}),
        ];

        if (project || lab) {
            infoRows.push(new TableRow({ children: [
                makeInfoCell('프로젝트', true), makeInfoCell(project || '-'),
                makeInfoCell('실험실', true), makeInfoCell(lab || '-'),
            ]}));
        }

        children.push(new Table({
            rows: infoRows,
            width: { size: 10000, type: WidthType.DXA },
        }));

        children.push(new Paragraph({ spacing: { before: 300 } }));
        
        // Experiment Purpose
        if (experimentPurpose) {
            children.push(new Paragraph({
                children: [new TextRun({
                    text: '▣ 실험 목적',
                    bold: true,
                    size: 22,
                    font: 'Malgun Gothic',
                    color: '333333',
                })],
                spacing: { before: 100, after: 100 },
            }));
            
            const purposeLines = experimentPurpose.split('\n');
            purposeLines.forEach(line => {
                children.push(new Paragraph({
                    children: [new TextRun({ text: line, size: 20, font: 'Malgun Gothic' })],
                    spacing: { after: 60 },
                    indent: { left: 300 },
                }));
            });
            
            children.push(new Paragraph({ spacing: { before: 200 } }));
        }

        // Protocols
        selectedProtocols.forEach((protocol, idx) => {
            // Protocol title
            children.push(new Paragraph({
                children: [new TextRun({
                    text: `${idx + 1}. ${protocol.name}`,
                    bold: true,
                    size: 28,
                    font: 'Malgun Gothic',
                })],
                spacing: { before: 400, after: 60 },
                border: {
                    bottom: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
                },
            }));

            // English name
            if (protocol.nameEn) {
                children.push(new Paragraph({
                    children: [new TextRun({
                        text: protocol.nameEn,
                        italics: true,
                        size: 18,
                        color: '888888',
                        font: 'Malgun Gothic',
                    })],
                    spacing: { after: 120 },
                }));
            }

            // Protocol Purpose
            if (protocol.purpose) {
                children.push(new Paragraph({
                    children: [
                        new TextRun({ text: '목적: ', bold: true, size: 20, font: 'Malgun Gothic' }),
                        new TextRun({ text: protocol.purpose, size: 20, font: 'Malgun Gothic' }),
                    ],
                    spacing: { after: 200 },
                    indent: { left: 200 },
                    border: {
                        left: { style: BorderStyle.SINGLE, size: 6, color: '6366F1' },
                    },
                }));
            }

            // Materials table
            children.push(new Paragraph({
                children: [new TextRun({
                    text: '▣ 필요 시약 및 재료',
                    bold: true,
                    size: 22,
                    font: 'Malgun Gothic',
                })],
                spacing: { before: 200, after: 100 },
            }));

            const matBorders = {
                top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
                left: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
                right: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
            };

            const matRows = [
                new TableRow({ children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({ text: '시약/재료', bold: true, size: 18, font: 'Malgun Gothic' })],
                        })],
                        shading: { type: ShadingType.SOLID, color: 'F0F0F0' },
                        borders: matBorders,
                        width: { size: 5500, type: WidthType.DXA },
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({ text: '용량/농도', bold: true, size: 18, font: 'Malgun Gothic' })],
                        })],
                        shading: { type: ShadingType.SOLID, color: 'F0F0F0' },
                        borders: matBorders,
                        width: { size: 4500, type: WidthType.DXA },
                    }),
                ]}),
            ];

            (protocol.materials || []).forEach(m => {
                const amountText = (m.amount || '').replace(/______+/g, BLANK);
                matRows.push(new TableRow({ children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({ text: m.name, size: 18, font: 'Malgun Gothic' })],
                        })],
                        borders: matBorders,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            children: formatBlankText(amountText, 18),
                        })],
                        borders: matBorders,
                    }),
                ]}));
            });

            children.push(new Table({
                rows: matRows,
                width: { size: 10000, type: WidthType.DXA },
            }));

            children.push(new Paragraph({ spacing: { before: 200 } }));

            // Sections (steps)
            (protocol.sections || []).forEach(section => {
                children.push(new Paragraph({
                    children: [new TextRun({
                        text: `▣ ${section.title}`,
                        bold: true,
                        size: 22,
                        font: 'Malgun Gothic',
                    })],
                    spacing: { before: 240, after: 100 },
                }));

                (section.steps || []).forEach((step, stepIdx) => {
                    const indent = step.startsWith('  -') || step.startsWith('  ·');
                    const displayStep = indent ? step.trim() : step;
                    const number = indent ? '' : `${stepIdx + 1}. `;

                    children.push(new Paragraph({
                        children: [
                            ...(number ? [new TextRun({ text: number, bold: true, size: 20, font: 'Malgun Gothic' })] : []),
                            ...formatBlankText(displayStep, 20),
                        ],
                        spacing: { before: 40, after: 40 },
                        indent: { left: indent ? 600 : 300 },
                    }));
                });
            });

            // Notes
            if (protocol.notes && protocol.notes.length > 0) {
                children.push(new Paragraph({
                    children: [new TextRun({
                        text: '⚠ 주의사항 및 Tips',
                        bold: true,
                        size: 20,
                        font: 'Malgun Gothic',
                        color: 'B8860B',
                    })],
                    spacing: { before: 240, after: 80 },
                }));

                protocol.notes.forEach(note => {
                    children.push(new Paragraph({
                        children: [
                            new TextRun({ text: '• ', size: 18, font: 'Malgun Gothic' }),
                            ...formatBlankText(note, 18),
                        ],
                        spacing: { before: 20, after: 20 },
                        indent: { left: 300 },
                    }));
                });
            }

            // Add spacing between protocols
            if (idx < selectedProtocols.length - 1) {
                children.push(new Paragraph({ spacing: { before: 400 } }));
                children.push(new Paragraph({
                    children: [],
                    border: {
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                    },
                    spacing: { after: 200 },
                }));
            }
        });

        // Signature area
        children.push(new Paragraph({ spacing: { before: 600 } }));
        children.push(new Paragraph({
            children: [],
            border: {
                top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            },
            spacing: { after: 200 },
        }));

        children.push(new Paragraph({
            children: [
                new TextRun({ text: '실험자 서명: ________________________          ', size: 20, font: 'Malgun Gothic' }),
                new TextRun({ text: '지도교수 확인: ________________________', size: 20, font: 'Malgun Gothic' }),
            ],
            spacing: { before: 400 },
        }));

        // Create document
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1200,
                            right: 1200,
                            bottom: 1200,
                            left: 1200,
                        },
                    },
                },
                children,
            }],
        });

        // Generate and save
        const blob = await Packer.toBlob(doc);
        let dateStr = formattedDate.replace(/\s/g, '').replace(/년|월/g, '-').replace('일', '');
        if (dateStr === BLANK) dateStr = '날짜미지정';
        const fileName = `실험프로토콜_${dateStr}.docx`;
        saveAs(blob, fileName);

        showToast('Word 문서가 다운로드되었습니다!');

    } catch (error) {
        console.error('Document generation error:', error);
        showToast('문서 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Word 문서 다운로드 (.docx)
        `;
    }
}

/**
 * Format text with blanks as underlined segments in docx
 */
function formatBlankText(text, fontSize) {
    const parts = text.split(/(______+)/); // Match 6 or more underscores
    return parts.map(part => {
        if (/^______+$/.test(part)) {
            return new docx.TextRun({
                text: '              ',
                size: fontSize,
                font: 'Malgun Gothic',
                underline: { type: docx.UnderlineType.SINGLE },
            });
        }
        return new docx.TextRun({
            text: part,
            size: fontSize,
            font: 'Malgun Gothic',
        });
    });
}

// ========================================
// Toast Notification
// ========================================
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-message');
    msg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add spin animation for loading state
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
