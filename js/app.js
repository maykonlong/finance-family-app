/* ═══════════════════════════════════════════
   FINANCE FAMILY 2.0 — App Logic
   ═══════════════════════════════════════════ */

// ─── Default Categories ───
const DEFAULT_CATEGORIES = [
    // Receitas
    { id: 'salario',       name: 'Salário',            icon: 'briefcase',      type: 'receita' },
    { id: 'bonus',         name: 'Bônus',              icon: 'gift',           type: 'receita' },
    { id: 'dividendos',    name: 'Dividendos',         icon: 'trending-up',    type: 'receita' },
    { id: 'juros-rec',     name: 'Juros recebidos',    icon: 'bar-chart',      type: 'receita' },
    { id: 'venda-ativo',   name: 'Venda de Ativo',     icon: 'dollar-sign',    type: 'receita' },
    { id: 'reembolso',     name: 'Reembolso',          icon: 'undo-2',         type: 'receita' },

    // Despesas
    { id: 'aluguel',       name: 'Aluguel',            icon: 'home',           type: 'despesa' },
    { id: 'condominio',    name: 'Condomínio',         icon: 'building',       type: 'despesa' },
    { id: 'iptu',          name: 'IPTU',               icon: 'file-text',      type: 'despesa' },
    { id: 'supermercado',  name: 'Supermercado',       icon: 'shopping-cart',  type: 'despesa' },
    { id: 'restaurante',   name: 'Restaurante',        icon: 'utensils',       type: 'despesa' },
    { id: 'combustivel',   name: 'Combustível',        icon: 'fuel',           type: 'despesa' },
    { id: 'manutencao',    name: 'Manutenção Veículo', icon: 'wrench',         type: 'despesa' },
    { id: 'plano-saude',   name: 'Plano de Saúde',     icon: 'heart-pulse',    type: 'despesa' },
    { id: 'medicamentos',  name: 'Medicamentos',       icon: 'pill',           type: 'despesa' },
    { id: 'educacao',      name: 'Educação',           icon: 'graduation-cap', type: 'despesa' },
    { id: 'viagens',       name: 'Viagens',            icon: 'plane',          type: 'despesa' },
    { id: 'assinaturas',   name: 'Assinaturas / Lazer',icon: 'tv',             type: 'despesa' },
    { id: 'internet',      name: 'Internet / Celular', icon: 'wifi',           type: 'despesa' },
    { id: 'impostos',      name: 'Impostos / Taxas',   icon: 'badge-percent',  type: 'despesa' },
    { id: 'pessoal',       name: 'Pessoal / Roupas',   icon: 'user',           type: 'despesa' },
    { id: 'compra-online', name: 'Compra Online',      icon: 'mouse-pointer',  type: 'despesa' },
    { id: 'loja-fisica',   name: 'Loja Física',        icon: 'shopping-bag',   type: 'despesa' },
    { id: 'tarifas',       name: 'Tarifas Bancárias',  icon: 'banknote',       type: 'despesa' },
    { id: 'outros',        name: 'Diversos',           icon: 'help-circle',    type: 'despesa' },

    // Investimentos
    { id: 'renda-fixa',    name: 'CDB / Tesouro',     icon: 'landmark',       type: 'investimento' },
    { id: 'acoes-fii',     name: 'Ações / FIIs',      icon: 'line-chart',     type: 'investimento' },
    { id: 'fundos',        name: 'Fundos de Invest.',  icon: 'layers',         type: 'investimento' },
    { id: 'cripto',        name: 'Criptoativos',      icon: 'bitcoin',        type: 'investimento' },
    { id: 'outros-inv',    name: 'Outros Invest.',    icon: 'plus-circle',    type: 'investimento' },

    // Resgates
    { id: 'resgate-rf',    name: 'Resgate Renda Fixa', icon: 'download-cloud', type: 'resgate' },
    { id: 'resgate-rv',    name: 'Venda Ações/FIIs',  icon: 'arrow-down-right',type: 'resgate' },
    { id: 'resgate-cripto',name: 'Resgate Cripto',    icon: 'coins',          type: 'resgate' },
];

// ─── State ───
let state = {
    transactions: [],
    categories: [...DEFAULT_CATEGORIES],
    theme: 'light',
    userName: 'Família',
    activePage: 'home',
    people: ['Bibs', 'Gu'],
    currentUser: 'Todos',
    timeScope: 'month', // day, week, month, year, all, custom
    currentDate: new Date(),
    customRange: { start: '', end: '' },
    filterType: 'all' // for history
};

// ═══════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    console.log('Finance Family 2.0: Booting...');
    
    // Iniciar eventos imediatamente
    try {
        bindEvents();
        console.log('Eventos vinculados com sucesso.');
    } catch (e) {
        console.error('Erro ao vincular eventos:', e);
    }

    loadState();
    render();
    navigateTo(state.activePage);
});

function loadState() {
    const raw = localStorage.getItem('finance_family_v2');
    if (raw) {
        try {
            const saved = JSON.parse(raw);
            state = { ...state, ...saved };
            
            // Re-instanciar Data que foi salva como String
            if (state.currentDate) state.currentDate = new Date(state.currentDate);
        } catch (e) {
            console.warn('Estado corrompido, usando padrão.');
        }
    }

    // Garantias de integridade
    if (!state.categories?.length) state.categories = [...DEFAULT_CATEGORIES];
    if (!state.people?.length) state.people = ['Bibs', 'Gu'];
    if (!state.currentUser) state.currentUser = state.people[0];

    // Aplicar tema
    document.body.className = state.theme + '-theme';

    // UI
    setTextById('userName', state.userName);
    setValueById('editUserName', state.userName);
    updateProfileUI();
    updateThemeIcon();
}

function saveState() {
    localStorage.setItem('finance_family_v2', JSON.stringify(state));
}

// ═══════════════════════════════════════════
// EVENT BINDING
// ═══════════════════════════════════════════
function bindEvents() {
    console.log('Vinculando eventos 2.0...');
    
    // Botão + (FAB) - Direto ao ponto
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.onclick = (e) => {
            e.preventDefault();
            console.log('Botão + acionado');
            openModal();
        };
    }

    // Theme Switch
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.onclick = toggleTheme;

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = () => navigateTo(btn.dataset.page);
    });
    on('viewAllBtn', 'click', () => navigateTo('history'));

    // Modal
    on('addBtn', 'click', openModal);
    on('transactionForm', 'submit', handleSubmit);
    on('modalOverlay', 'click', e => {
        if (e.target.id === 'modalOverlay') closeModal();
    });

    // Type tabs — update categories list
    document.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', populateCategories);
    });

    // Amount Mask
    on('amount', 'input', maskCurrency);

    // Search Filter
    on('historySearch', 'input', (e) => filterHistory(e.target.value));

    // Type Filter Chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.onclick = () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.filterType = chip.dataset.type;
            renderFullHistory();
        };
    });

    // Period Navigation
    on('prevPeriod', 'click', () => changePeriod(-1));
    on('nextPeriod', 'click', () => changePeriod(1));

    // Scope Selection
    document.querySelectorAll('.scope-chip').forEach(chip => {
        chip.onclick = () => {
            document.querySelectorAll('.scope-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.timeScope = chip.dataset.scope;
            
            // Show/Hide custom picker
            const cp = document.getElementById('customRangePicker');
            const pb = document.querySelector('.period-selector-bar');
            if (cp) cp.style.display = state.timeScope === 'custom' ? 'flex' : 'none';
            if (pb) pb.style.display = (state.timeScope === 'all' || state.timeScope === 'custom') ? 'none' : 'flex';

            render();
        };
    });

    // Custom Range Inputs
    on('startDate', 'input', (e) => { state.customRange.start = e.target.value; render(); });
    on('endDate', 'input', (e) => { state.customRange.end = e.target.value; render(); });

    // Profile picker - Direto
    const picker = document.getElementById('profilePicker');
    if (picker) {
        picker.onclick = (e) => {
            console.log('Picker de perfil clicado');
            toggleProfileDropdown(e);
        };
    }

    // Settings
    on('saveSettingsBtn', 'click', saveSettings);
    on('resetDataBtn', 'click', resetData);
    on('addPersonBtn', 'click', addPerson);
    on('addCategoryBtn', 'click', addCategory);
}

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════
function navigateTo(pageId) {
    state.activePage = pageId;

    // Tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageId);
    });

    // Views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.toggle('active', view.id === `${pageId}-view`);
    });

    // Page-specific renders
    if (pageId === 'history') renderFullHistory();
    if (pageId === 'settings') { renderPeopleChips(); renderCategoryChips(); }
    if (pageId === 'stats') renderStats();

    saveState();
}

// ═══════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.className = state.theme + '-theme';
    updateThemeIcon();
    saveState();
}

function updateThemeIcon() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.innerHTML = `<i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}"></i>`;
    lucide.createIcons();
}

// ═══════════════════════════════════════════
// PROFILE SWITCHER
// ═══════════════════════════════════════════
function updateProfileUI() {
    setTextById('activeUserDisplay', state.currentUser);
}

function toggleProfileDropdown(e) {
    if (e) e.stopPropagation();
    const list = document.getElementById('profileDropdown');
    if (!list) {
        console.error('Dropdown de perfil não encontrado no DOM!');
        return;
    }
    
    const isOpen = list.classList.toggle('active');
    console.log('Filtro de perfil:', isOpen ? 'Aberto' : 'Fechado');

    if (isOpen) {
        updateProfileUI();
        // Close when clicking outside
        const closeDropdown = () => {
            list.classList.remove('active');
            document.removeEventListener('click', closeDropdown);
        };
        setTimeout(() => document.addEventListener('click', closeDropdown), 10);
    }
}

function switchUser(name) {
    state.currentUser = name;
    saveState();
    updateProfileUI();
    render(); 
}

function updateProfileUI() {
    const label = document.getElementById('currentUserName');
    if (label) label.textContent = state.currentUser;

    const dropdown = document.getElementById('profileDropdown');
    if (!dropdown) return;

    const options = ['Todos', ...state.people];
    dropdown.innerHTML = options.map(p => `
        <div class="profile-option ${p === state.currentUser ? 'active' : ''}" onclick="switchUser('${p}')">
            <i data-lucide="${p === 'Todos' ? 'users' : 'user'}"></i>
            <span>${p}</span>
        </div>
    `).join('');
    lucide.createIcons();
}

// ═══════════════════════════════════════════
// MODAL & FORM
// ═══════════════════════════════════════════
function openModal() {
    console.log('Abrindo Modal...');
    const modal = document.getElementById('modalOverlay');
    if (!modal) return;
    
    modal.classList.add('active');
    
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.valueAsDate = new Date();
    
    const radio = document.querySelector('input[name="type"][value="receita"]');
    if (radio) radio.checked = true;
    
    populateCategories();
    populatePeople();
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById('transactionForm').reset();
    // reset resgate panel
    const rp = document.getElementById('resgateOptions');
    if (rp) rp.style.display = 'none';
}

function populateCategories() {
    const radio = document.querySelector('input[name="type"]:checked');
    const type = radio ? radio.value : 'receita';
    const select = document.getElementById('category');
    if (!select) return;

    const filtered = state.categories.filter(c => c.type === type);
    
    if (filtered.length > 0) {
        select.innerHTML = filtered.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } else {
        select.innerHTML = '<option value="">Nenhuma categoria</option>';
    }

    // Resgate options panel visibility
    const rp = document.getElementById('resgateOptions');
    if (rp) {
        rp.style.display = type === 'resgate' ? 'block' : 'none';
    }
}

function populatePeople() {
    const select = document.getElementById('person');
    if (!select) return;
    select.innerHTML = state.people.map(p =>
        `<option value="${p}" ${p === state.currentUser ? 'selected' : ''}>${p}</option>`
    ).join('');
}

function handleSubmit(e) {
    e.preventDefault();

    const type = document.querySelector('input[name="type"]:checked').value;
    const rawAmount = parseAmount(document.getElementById('amount').value);

    if (!rawAmount || rawAmount <= 0) return;

    const tx = {
        id: Date.now(),
        type,
        amount: rawAmount,
        description: document.getElementById('description').value.trim(),
        category: document.getElementById('category').value,
        person: document.getElementById('person').value,
        date: document.getElementById('date').value,
        addToBalance: type === 'resgate'
            ? document.getElementById('resgateToBalance').checked
            : true,
    };

    state.transactions.unshift(tx);
    saveState();
    closeModal();
    render();
    
    // Switch to home after added
    navigateTo('home');
}

// ═══════════════════════════════════════════
// CURRENCY HELPERS
// ═══════════════════════════════════════════
function maskCurrency(e) {
    let digits = e.target.value.replace(/\D/g, '');
    if (!digits) { e.target.value = ''; return; }
    const num = (parseInt(digits) / 100).toFixed(2);
    e.target.value = 'R$ ' + num.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function parseAmount(str) {
    const clean = str.replace(/[^\d]/g, '');
    return parseInt(clean || '0') / 100;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// ═══════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════
function render() {
    updatePeriodDisplay();
    renderBalance();
    
    // Always render recent list (home)
    renderRecentTransactions();

    // Render active view specifics
    if (state.activePage === 'history') renderFullHistory();
    if (state.activePage === 'stats') renderStats();

    lucide.createIcons();
}

function updatePeriodDisplay() {
    const el = document.getElementById('periodDisplay');
    if (!el) return;

    const d = state.currentDate;
    const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    switch (state.timeScope) {
        case 'day':
            el.textContent = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
            break;
        case 'week':
            const first = new Date(d);
            first.setDate(d.getDate() - d.getDay());
            const last = new Date(first);
            last.setDate(first.getDate() + 6);
            el.textContent = `${first.getDate()} a ${last.getDate()} ${months[last.getMonth()]}`;
            break;
        case 'month':
            el.textContent = `${months[d.getMonth()]} ${d.getFullYear()}`;
            break;
        case 'year':
            el.textContent = d.getFullYear();
            break;
        default:
            el.textContent = 'Geral';
    }
}

function changePeriod(delta) {
    const d = new Date(state.currentDate);
    switch (state.timeScope) {
        case 'day': d.setDate(d.getDate() + delta); break;
        case 'week': d.setDate(d.getDate() + (delta * 7)); break;
        case 'month': d.setMonth(d.getMonth() + delta); break;
        case 'year': d.setFullYear(d.getFullYear() + delta); break;
    }
    state.currentDate = d;
    saveState();
    render();
}

function getPeriodTransactions() {
    const txs = Array.isArray(state.transactions) ? state.transactions : [];
    
    return txs.filter(t => {
        const tDate = new Date(t.date + 'T12:00:00');
        const userMatch = state.currentUser === 'Todos' || t.person === state.currentUser;
        if (!userMatch) return false;

        if (state.timeScope === 'all') return true;

        if (state.timeScope === 'custom') {
            const start = state.customRange.start ? new Date(state.customRange.start + 'T00:00:00') : null;
            const end = state.customRange.end ? new Date(state.customRange.end + 'T23:59:59') : null;
            if (start && tDate < start) return false;
            if (end && tDate > end) return false;
            return true;
        }

        const d = state.currentDate;
        switch (state.timeScope) {
            case 'day':
                return tDate.toDateString() === d.toDateString();
            case 'week':
                const first = new Date(d); first.setDate(d.getDate() - d.getDay()); first.setHours(0,0,0,0);
                const last = new Date(first); last.setDate(first.getDate() + 6); last.setHours(23,59,59,999);
                return tDate >= first && tDate <= last;
            case 'month':
                return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
            case 'year':
                return tDate.getFullYear() === d.getFullYear();
        }
        return true;
    });
}

function renderBalance() {
    const txs = getPeriodTransactions();
    
    const sum = (type) => txs
        .filter(t => t.type === type)
        .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const income = sum('receita');
    const expense = sum('despesa');
    const investment = sum('investimento');
    const resgateAll = sum('resgate');
    
    const resgateToBalance = txs
        .filter(t => t.type === 'resgate' && t.addToBalance !== false)
        .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const netInvestment = investment - resgateAll;
    const balance = income - expense - investment + resgateToBalance;

    setTextById('totalBalance', formatCurrency(balance));
    setTextById('totalIncome', formatCurrency(income));
    setTextById('totalInvestment', formatCurrency(netInvestment));
    setTextById('totalExpense', formatCurrency(expense));

    // Update charts if in stats view
    if (state.activePage === 'stats') renderStats();
}

function renderRecentTransactions() {
    const list = document.getElementById('transactionsList');
    if (!list) return;

    const txs = getPeriodTransactions();

    if (!txs.length) {
        list.innerHTML = `
            <div class="empty-state">
                <i data-lucide="calendar" style="width:48px;height:48px;opacity:0.3;"></i>
                <p>Nenhuma transação neste período.</p>
            </div>`;
        return;
    }

    // Recent 5
    list.innerHTML = txs.slice(0, 5).map((t, i) => txItemHTML(t, i, false)).join('');
}

function filterHistory(query) {
    const q = query.toLowerCase();
    const txs = getPeriodTransactions();
    const filtered = txs.filter(t => 
        t.description.toLowerCase().includes(q) || 
        (state.categories.find(c => c.id === t.category)?.name || '').toLowerCase().includes(q)
    );
    renderFullHistory(filtered);
}

function renderFullHistory(queryTxs) {
    const list = document.getElementById('fullTransactionsList');
    if (!list) return;

    let txs = queryTxs || getPeriodTransactions();

    // Secondary Filter by Type (Chips)
    if (state.filterType !== 'all') {
        txs = txs.filter(t => t.type === state.filterType);
    }

    if (!txs.length) {
        list.innerHTML = '<div class="empty-state"><p>Nenhuma transação atende aos filtros.</p></div>';
        return;
    }

    list.innerHTML = txs.map((t, i) => txItemHTML(t, i, true)).join('');
    lucide.createIcons();
}

function txItemHTML(t, index, showDelete) {
    const cat = state.categories.find(c => c.id === t.category) || { icon: 'tag', name: t.category || '—' };
    const sign = (t.type === 'receita' || t.type === 'resgate') ? '+' : '−';
    const delay = Math.min(index * 0.04, 0.3);

    if (showDelete) {
        return `
            <div class="tx-item" style="animation-delay:${delay}s;">
                <div class="tx-icon ${t.type}">
                    <i data-lucide="${cat.icon}"></i>
                </div>
                <div class="tx-info">
                    <h4>${t.description}</h4>
                    <p>${formatDate(t.date)} · ${cat.name} · ${t.person || 'Família'}</p>
                </div>
                <div class="tx-amount ${t.type}">
                    ${sign} ${formatCurrency(t.amount)}
                </div>
                <button class="tx-delete" onclick="deleteTransaction(${t.id})" aria-label="Excluir">
                    <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                </button>
            </div>
        `;
    } else {
        return `
            <div class="tx-item" style="animation-delay:${delay}s;">
                <div class="tx-icon ${t.type}">
                    <i data-lucide="${cat.icon}"></i>
                </div>
                <div class="tx-info">
                    <h4>${t.description}</h4>
                    <p>${formatDate(t.date)} · ${cat.name}</p>
                </div>
                <div class="tx-amount ${t.type}">
                    ${sign} ${formatCurrency(t.amount)}
                </div>
            </div>
        `;
    }
}

function deleteTransaction(id) {
    if (!confirm('Deseja excluir esta transação?')) return;
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
    render();
    if (state.activePage === 'history') renderFullHistory();
}

// ─── Stats ───
function renderStats() {
    const container = document.getElementById('statsContainer');
    if (!container) return;

    const txs = getPeriodTransactions();

    if (!txs.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="bar-chart-3" style="width:48px;height:48px;opacity:0.3;"></i>
                <p>Sem transações neste período.</p>
            </div>`;
        return;
    }

    const sum = (type) => txs
        .filter(t => t.type === type)
        .reduce((s, t) => s + t.amount, 0);

    const income = sum('receita');
    const expense = sum('despesa');
    const investment = sum('investimento');
    const resgate = sum('resgate');
    
    const maxVal = Math.max(income, expense, investment, resgate) || 1;
    const getPct = (val) => (val / maxVal * 100).toFixed(0) + '%';

    container.innerHTML = `
        <div class="chart-section">
            <div class="bar-chart">
                <div class="bar-group">
                    <div class="bar-label">Entradas</div>
                    <div class="bar-container">
                        <div class="bar bar-income" style="width: ${getPct(income)}"></div>
                        <span>${formatCurrency(income)}</span>
                    </div>
                </div>
                <div class="bar-group">
                    <div class="bar-label">Saídas</div>
                    <div class="bar-container">
                        <div class="bar bar-expense" style="width: ${getPct(expense)}"></div>
                        <span>${formatCurrency(expense)}</span>
                    </div>
                </div>
                <div class="bar-group">
                    <div class="bar-label">Investido</div>
                    <div class="bar-container">
                        <div class="bar bar-invest" style="width: ${getPct(investment)}"></div>
                        <span>${formatCurrency(investment)}</span>
                    </div>
                </div>
                <div class="bar-group">
                    <div class="bar-label">Resgates</div>
                    <div class="bar-container">
                        <div class="bar bar-resgate" style="width: ${getPct(resgate)}"></div>
                        <span>${formatCurrency(resgate)}</span>
                    </div>
                </div>
            </div>

            <div class="stats-grid" style="margin-top: 24px;">
                <div class="mini-stat">
                    <div class="value">${txs.length}</div>
                    <div class="label">Transações</div>
                </div>
                <div class="mini-stat">
                    <div class="value">${((expense / (income || 1)) * 100).toFixed(1)}%</div>
                    <div class="label">Gasto / Renda</div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════
function saveSettings() {
    const name = document.getElementById('editUserName').value.trim();
    if (!name) return;
    state.userName = name;
    setTextById('userName', name);
    saveState();

    // Feedback visual
    const btn = document.getElementById('saveSettingsBtn');
    btn.textContent = '✓ Salvo!';
    setTimeout(() => { btn.innerHTML = '<i data-lucide="save" style="width:16px;height:16px;"></i> Salvar'; lucide.createIcons(); }, 1500);
}

function resetData() {
    const code = Math.floor(1000 + Math.random() * 9000); // Gera um código de 4 dígitos
    const confirmMsg = `ATENÇÃO: Isso apagará TODAS as suas transações permanentemente!\n\nPara confirmar, digite o código de segurança: ${code}`;
    
    const userInput = prompt(confirmMsg);
    
    if (userInput === null) return; // Usuário cancelou
    
    if (userInput === code.toString()) {
        state.transactions = [];
        state.userName = 'Família';
        state.people = ['Bibs', 'Gu'];
        state.currentUser = 'Bibs';
        state.categories = [...DEFAULT_CATEGORIES];
        saveState();
        location.reload();
    } else {
        alert('Código incorreto. Ação cancelada.');
    }
}

// ─── People Management ───
function renderPeopleChips() {
    const el = document.getElementById('peopleList');
    if (!el) return;
    el.innerHTML = state.people.map(p => `
        <div class="chip">
            ${p}
            <button class="chip-remove" onclick="removePerson('${p}')" aria-label="Remover ${p}">
                <i data-lucide="x" style="width:14px;height:14px;"></i>
            </button>
        </div>
    `).join('');
    lucide.createIcons();
}

function addPerson() {
    const input = document.getElementById('newPersonName');
    const name = input.value.trim();
    if (!name || state.people.includes(name)) return;
    state.people.push(name);
    input.value = '';
    renderPeopleChips();
    saveState();
}

function removePerson(name) {
    if (state.people.length <= 1) return alert('Deve haver ao menos 1 membro.');
    state.people = state.people.filter(p => p !== name);
    if (state.currentUser === name) {
        state.currentUser = state.people[0];
        updateProfileUI();
    }
    renderPeopleChips();
    saveState();
}

// ─── Category Management ───
function renderCategoryChips() {
    const el = document.getElementById('customCategoriesList');
    if (!el) return;

    el.innerHTML = state.categories.map(c => `
        <div class="chip">
            <span class="chip-type ${c.type}">${c.type.charAt(0).toUpperCase()}</span>
            ${c.name}
            <button class="chip-remove" onclick="removeCategory('${c.id}')" aria-label="Remover ${c.name}">
                <i data-lucide="x" style="width:14px;height:14px;"></i>
            </button>
        </div>
    `).join('');
    lucide.createIcons();
}

function addCategory() {
    const input = document.getElementById('newCatName');
    const typeEl = document.getElementById('newCatType');
    const name = input.value.trim();
    if (!name) return;

    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    state.categories.push({ id, name, type: typeEl.value, icon: 'tag' });
    input.value = '';
    renderCategoryChips();
    saveState();
}

function removeCategory(id) {
    state.categories = state.categories.filter(c => c.id !== id);
    renderCategoryChips();
    saveState();
}

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════
function setTextById(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setValueById(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

function on(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
}
