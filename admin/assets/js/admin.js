document.addEventListener('DOMContentLoaded', function () {
    const store = window.careerPilotStore;

    function slugify(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'company';
    }

    function getStatusBadge(status) {
        const normalized = status || 'Active';
        const map = {
            Active: 'bg-success',
            Pending: 'bg-warning text-dark',
            Inactive: 'bg-secondary'
        };
        return '<span class="badge ' + (map[normalized] || 'bg-secondary') + '">' + normalized + '</span>';
    }

    function renderCompanyTable() {
        const tableBody = document.getElementById('companyTableBody');
        if (!tableBody || !store) return;

        const searchValue = (document.getElementById('companySearch')?.value || '').trim().toLowerCase();
        const statusFilter = document.getElementById('companyStatusFilter')?.value || '';
        const companies = store.getCompanies();

        const filtered = companies.filter((company) => {
            const text = [company.name, company.sector, company.location, company.jobRole].join(' ').toLowerCase();
            const matchesSearch = !searchValue || text.includes(searchValue);
            const matchesStatus = !statusFilter || company.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        tableBody.innerHTML = filtered.map((company) => `
            <tr>
                <td>${company.name}</td>
                <td>${company.sector}</td>
                <td>${company.location}</td>
                <td>${getStatusBadge(company.status)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" data-company-view="${company.id}">View</button>
                    <button class="btn btn-sm btn-outline-primary me-1" data-company-edit="${company.id}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" data-company-delete="${company.id}">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="text-center text-muted">No companies found.</td></tr>';

        tableBody.querySelectorAll('[data-company-view]').forEach((button) => {
            button.addEventListener('click', function () {
                window.open('../student/company-details.html?company=' + encodeURIComponent(this.dataset.companyView), '_blank');
            });
        });

        tableBody.querySelectorAll('[data-company-edit]').forEach((button) => {
            button.addEventListener('click', function () {
                openCompanyEditor(this.dataset.companyEdit);
            });
        });

        tableBody.querySelectorAll('[data-company-delete]').forEach((button) => {
            button.addEventListener('click', function () {
                if (confirm('Delete this company?')) {
                    store.deleteCompany(this.dataset.companyDelete);
                    renderCompanyTable();
                }
            });
        });
    }

    function buildRoundListFromSelection() {
        const selectedRoundCheckboxes = document.querySelectorAll('[data-round-option]:checked');
        const orderList = [];
        selectedRoundCheckboxes.forEach((checkbox) => {
            const rawValue = checkbox.value;
            const customName = document.getElementById('customRoundName')?.value?.trim();
            const value = rawValue === 'Other / Custom Round' ? (customName || 'Custom Round') : rawValue;
            orderList.push({
                id: slugify(value),
                name: value,
                type: value
            });
        });
        return orderList;
    }

    function refreshSelectedRounds() {
        const selectedRoundsList = document.getElementById('selectedRoundsList');
        if (!selectedRoundsList) return;
        const rounds = buildRoundListFromSelection();
        selectedRoundsList.innerHTML = rounds.length ? rounds.map((round, index) => `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <span>${index + 1}. ${round.name}</span>
                <div>
                    <button type="button" class="btn btn-sm btn-outline-secondary me-1" data-round-move="up" data-round-index="${index}">↑</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary" data-round-move="down" data-round-index="${index}">↓</button>
                </div>
            </div>
        `).join('') : '<div class="list-group-item text-muted">No rounds selected.</div>';

        selectedRoundsList.querySelectorAll('[data-round-move]').forEach((button) => {
            button.addEventListener('click', function () {
                const currentIndex = Number(this.dataset.roundIndex);
                const direction = this.dataset.roundMove;
                const activeCheckboxes = Array.from(document.querySelectorAll('[data-round-option]:checked'));
                const values = activeCheckboxes.map((box) => {
                    if (box.value === 'Other / Custom Round') return document.getElementById('customRoundName')?.value?.trim() || 'Custom Round';
                    return box.value;
                });
                if (currentIndex < 0 || currentIndex >= values.length) return;
                const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
                if (nextIndex < 0 || nextIndex >= values.length) return;
                [values[currentIndex], values[nextIndex]] = [values[nextIndex], values[currentIndex]];

                document.querySelectorAll('[data-round-option]').forEach((box) => { box.checked = false; });
                values.forEach((value) => {
                    const checkbox = Array.from(document.querySelectorAll('[data-round-option]')).find((option) => {
                        if (option.value === 'Other / Custom Round') return value.toLowerCase().includes('custom') || value.toLowerCase().includes('other');
                        return option.value === value || option.value === value + ' Round';
                    });
                    if (checkbox) checkbox.checked = true;
                });
                refreshSelectedRounds();
            });
        });
    }

    function bindCompanyRoundControls() {
        document.querySelectorAll('[data-round-option]').forEach((checkbox) => {
            checkbox.addEventListener('change', function () {
                const customWrapper = document.getElementById('customRoundWrapper');
                if (this.value === 'Other / Custom Round') {
                    if (customWrapper) {
                        customWrapper.style.display = this.checked ? 'block' : 'none';
                    }
                    if (!this.checked && document.getElementById('customRoundName')) {
                        document.getElementById('customRoundName').value = '';
                    }
                }
                refreshSelectedRounds();
            });
        });

        const customNameInput = document.getElementById('customRoundName');
        if (customNameInput) {
            customNameInput.addEventListener('input', refreshSelectedRounds);
        }
    }

    function openCompanyEditor(companyId) {
        const company = store ? store.getCompanyById(companyId) : null;
        const form = document.getElementById('companyForm');
        if (!form) return;

        form.reset();
        document.getElementById('companyModalTitle').textContent = company ? 'Edit Company' : 'Add Company';
        document.getElementById('companyId').value = company ? company.id : '';

        if (company) {
            document.getElementById('companyName').value = company.name || '';
            document.getElementById('companySector').value = company.sector || '';
            document.getElementById('companyLocation').value = company.location || '';
            document.getElementById('companyRole').value = company.jobRole || '';
            document.getElementById('companyPackage').value = company.package || '';
            document.getElementById('companyStatus').value = company.status || 'Active';
            document.getElementById('companyDescription').value = company.description || '';
            document.getElementById('companyImportantQuestions').value = Array.isArray(company.importantQuestions) ? company.importantQuestions.join('\n') : '';
            const pdfNameText = document.getElementById('companyPdfName');
            if (pdfNameText) pdfNameText.textContent = company.pdfName || 'No PDF selected';

            document.querySelectorAll('[data-round-option]').forEach((checkbox) => {
                const labels = (company.rounds || []).map((round) => round.name || round.type || '');
                checkbox.checked = labels.includes(checkbox.value) || (checkbox.value === 'Other / Custom Round' && labels.some((label) => /custom/i.test(label)));
            });

            const customRound = (company.rounds || []).find((round) => /custom/i.test(round.name || round.type || ''));
            if (customRound && document.getElementById('customRoundWrapper')) {
                document.getElementById('customRoundWrapper').style.display = 'block';
                document.getElementById('customRoundName').value = customRound.name || customRound.type || '';
            } else if (document.getElementById('customRoundWrapper')) {
                document.getElementById('customRoundWrapper').style.display = 'none';
                document.getElementById('customRoundName').value = '';
            }
        }

        refreshSelectedRounds();
        bootstrap.Modal.getOrCreateInstance(document.getElementById('companyModal')).show();
    }

    async function handleCompanyFormSubmit(event) {
        event.preventDefault();
        if (!store) return;

        const companyId = document.getElementById('companyId').value.trim();
        const companyName = document.getElementById('companyName').value.trim();
        const rounds = buildRoundListFromSelection();
        const existing = companyId ? store.getCompanyById(companyId) : null;
        const pdfInput = document.getElementById('companyPdf');
        const pdfNameText = document.getElementById('companyPdfName');

        if (!companyName) {
            alert('Company name is required.');
            return;
        }

        if (!rounds.length) {
            alert('Please select at least one interview round.');
            return;
        }

        let pdfName = existing?.pdfName || '';
        let pdfData = existing?.pdfData || '';
        let pdfMimeType = existing?.pdfMimeType || 'application/pdf';

        if (pdfInput && pdfInput.files && pdfInput.files[0]) {
            const selectedPdf = pdfInput.files[0];
            const typeMatches = selectedPdf.type === 'application/pdf' || selectedPdf.name.toLowerCase().endsWith('.pdf');
            if (!typeMatches) {
                alert('Please upload a valid PDF file.');
                return;
            }
            if (selectedPdf.size > 2 * 1024 * 1024) {
                alert('PDF file size must be 2 MB or less.');
                return;
            }
            try {
                const fileData = await readFileAsDataUrl(selectedPdf);
                pdfName = fileData.name;
                pdfData = fileData.data;
                pdfMimeType = 'application/pdf';
                if (pdfNameText) pdfNameText.textContent = fileData.name;
            } catch (error) {
                alert(error?.message || 'Unable to read the selected PDF file.');
                return;
            }
        }

        const payload = {
            id: companyId || slugify(companyName),
            name: companyName,
            sector: document.getElementById('companySector').value.trim(),
            location: document.getElementById('companyLocation').value.trim(),
            jobRole: document.getElementById('companyRole').value.trim(),
            package: document.getElementById('companyPackage').value.trim(),
            status: document.getElementById('companyStatus').value,
            description: document.getElementById('companyDescription').value.trim(),
            rounds,
            pdfName,
            pdfData,
            pdfMimeType,
            importantQuestions: (document.getElementById('companyImportantQuestions').value || '').split(/\n+/).map((line) => line.trim()).filter(Boolean),
            updatedAt: new Date().toISOString()
        };

        if (existing) payload.createdAt = existing.createdAt;
        try {
            store.addCompany(payload);
        } catch (error) {
            console.error('Company save failed:', error);
            alert('Unable to save the company PDF. Please try a smaller PDF or clear some browser storage.');
            return;
        }

        renderCompanyTable();
        document.getElementById('companyForm').reset();
        if (pdfNameText) pdfNameText.textContent = 'No PDF selected';
        bootstrap.Modal.getInstance(document.getElementById('companyModal')).hide();
    }

    function refreshCompanyFilters() {
        renderCompanyTable();
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                resolve({ name: file.name, data: String(reader.result || '') });
            };
            reader.onerror = function () {
                reject(new Error('Unable to read the selected PDF file.'));
            };
            reader.readAsDataURL(file);
        });
    }

    async function handlePlanFormSubmit(event) {
        event.preventDefault();
        if (!store) return;

        const planId = document.getElementById('planId').value || '';
        const name = document.getElementById('planName').value.trim();
        const price = document.getElementById('planPrice').value.trim();
        const featuresText = document.getElementById('planFeatures').value;
        const status = document.getElementById('planStatus').value;

        if (!name || !price || !featuresText.trim()) {
            alert('Please fill in all plan details.');
            return;
        }

        const features = featuresText.split(/\n+/).map((feature) => feature.trim()).filter(Boolean);
        const payload = {
            id: planId || slugify(name),
            name,
            price,
            billingPeriod: '',
            description: '',
            buttonText: name === 'Free' ? 'Start Free' : 'Get Started',
            buttonLink: 'register.html',
            features,
            status,
            updatedAt: new Date().toISOString()
        };

        const existing = planId ? store.getPlans().find((plan) => plan.id === planId) : null;
        if (existing) payload.createdAt = existing.createdAt;

        store.addPlan(payload);
        renderPlans();
        document.getElementById('planForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('planModal')).hide();
    }

    function renderPlans() {
        const container = document.getElementById('plansContainer');
        if (!container || !store) return;

        const plans = store.getPlans();
        container.innerHTML = plans.map((plan) => `
            <div class="col-md-4">
                <div class="admin-card p-4 ${plan.status === 'Active' ? 'border-primary' : ''}">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="mb-0">${plan.name}</h5>
                        <span class="badge ${plan.status === 'Active' ? 'bg-success' : 'bg-secondary'}">${plan.status || 'Active'}</span>
                    </div>
                    <div class="metric-value">${plan.price}</div>
                    <ul class="mt-3 mb-3">
                        ${plan.features.map((feature) => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" data-plan-edit="${plan.id}">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" data-plan-delete="${plan.id}">Delete</button>
                    </div>
                </div>
            </div>
        `).join('') || '<div class="col-12"><div class="alert alert-info">No plans available yet.</div></div>';

        container.querySelectorAll('[data-plan-edit]').forEach((button) => {
            button.addEventListener('click', function () {
                const plan = store.getPlans().find((item) => item.id === this.dataset.planEdit);
                const modal = document.getElementById('planModal');
                if (!modal) return;
                document.getElementById('planId').value = plan ? plan.id : '';
                document.getElementById('planName').value = plan ? plan.name : '';
                document.getElementById('planPrice').value = plan ? plan.price : '';
                document.getElementById('planFeatures').value = plan ? plan.features.join('\n') : '';
                document.getElementById('planStatus').value = plan ? plan.status : 'Active';
                document.getElementById('planModalTitle').textContent = plan ? 'Edit Plan' : 'Add Plan';
                bootstrap.Modal.getOrCreateInstance(modal).show();
            });
        });

        container.querySelectorAll('[data-plan-delete]').forEach((button) => {
            button.addEventListener('click', function () {
                if (confirm('Delete this plan?')) {
                    store.deletePlan(this.dataset.planDelete);
                    renderPlans();
                }
            });
        });
    }

    function renderQuestionTable() {
        const tableBody = document.getElementById('questionTableBody');
        if (!tableBody || !store) return;

        const searchValue = (document.getElementById('questionSearch')?.value || '').trim().toLowerCase();
        const companyFilter = document.getElementById('questionCompanyFilter')?.value || '';
        const questions = store.getQuestions();

        const filtered = questions.filter((question) => {
            const matchesCompany = !companyFilter || (question.companyId === companyFilter || question.companyName === companyFilter || (!question.companyId && companyFilter === 'general'));
            const text = [question.topic, question.question, question.companyName, question.round, question.difficulty].join(' ').toLowerCase();
            const matchesSearch = !searchValue || text.includes(searchValue);
            return matchesCompany && matchesSearch;
        });

        tableBody.innerHTML = filtered.map((question) => `
            <tr>
                <td>${question.topic || 'General'}</td>
                <td>${question.round || 'General'}</td>
                <td>${question.difficulty || 'Medium'}</td>
                <td>${question.companyName || 'General'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" data-question-edit="${question.id}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" data-question-delete="${question.id}">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="text-center text-muted">No questions found.</td></tr>';

        tableBody.querySelectorAll('[data-question-edit]').forEach((button) => {
            button.addEventListener('click', function () {
                openQuestionEditor(this.dataset.questionEdit);
            });
        });

        tableBody.querySelectorAll('[data-question-delete]').forEach((button) => {
            button.addEventListener('click', function () {
                if (confirm('Delete this question?')) {
                    store.deleteQuestion(this.dataset.questionDelete);
                    renderQuestionTable();
                    populateQuestionSelects();
                }
            });
        });
    }

    function populateQuestionSelects() {
        const companySelect = document.getElementById('questionCompany');
        const companyFilter = document.getElementById('questionCompanyFilter');
        if (!companySelect && !companyFilter) return;

        const companies = store ? store.getCompanies() : [];
        const companyOptions = companies.map((company) => `<option value="${company.id}">${company.name}</option>`).join('');

        if (companySelect) {
            const currentValue = companySelect.value;
            companySelect.innerHTML = '<option value="">General / All</option>' + companyOptions;
            companySelect.value = currentValue || '';
        }

        if (companyFilter) {
            const currentValue = companyFilter.value;
            companyFilter.innerHTML = '<option value="">All companies</option><option value="general">General</option>' + companyOptions;
            companyFilter.value = currentValue || '';
        }
    }

    function updateRoundOptionsForCompany() {
        const companySelect = document.getElementById('questionCompany');
        const roundSelect = document.getElementById('questionRound');
        if (!companySelect || !roundSelect) return;

        const selectedCompanyId = companySelect.value;
        const company = selectedCompanyId ? store.getCompanyById(selectedCompanyId) : null;
        const rounds = company ? (company.rounds || []) : [];
        const options = rounds.length ? rounds.map((round) => `<option value="${round.id || slugify(round.name || round.type || 'Custom Round')}">${round.name || round.type || 'Custom Round'}</option>`).join('') : '<option value="general">General</option>';
        const currentValue = roundSelect.value;
        roundSelect.innerHTML = options;
        if (currentValue && Array.from(roundSelect.options).some((option) => option.value === currentValue)) {
            roundSelect.value = currentValue;
        } else {
            roundSelect.value = rounds.length ? (rounds[0].id || slugify(rounds[0].name || rounds[0].type || 'Custom Round')) : 'general';
        }
    }

    function openQuestionEditor(questionId) {
        const modal = document.getElementById('questionModal');
        const form = document.getElementById('questionForm');
        if (!form || !modal) return;

        const question = store ? store.getQuestions().find((item) => item.id === questionId) : null;
        document.getElementById('questionModalTitle').textContent = question ? 'Edit Question' : 'Add Question';
        document.getElementById('questionId').value = question ? question.id : '';
        document.getElementById('questionTopic').value = question ? (question.topic || '') : '';
        document.getElementById('questionText').value = question ? (question.question || '') : '';
        document.getElementById('questionAnswer').value = question ? (question.answer || '') : '';
        document.getElementById('questionDifficulty').value = question ? (question.difficulty || 'Medium') : 'Medium';
        document.getElementById('questionTags').value = question && Array.isArray(question.tags) ? question.tags.join(', ') : '';

        populateQuestionSelects();
        const selectedCompany = question && question.companyId ? question.companyId : '';
        const companySelect = document.getElementById('questionCompany');
        if (companySelect) companySelect.value = selectedCompany;
        updateRoundOptionsForCompany();
        const roundInput = document.getElementById('questionRound');
        if (roundInput && question) {
            const matchedValue = Object.keys({}).length;
            const roundMatch = Array.from(roundInput.options).find((option) => option.value === question.round || option.textContent === question.round || (question.round === 'general' && option.value === 'general'));
            if (roundMatch) roundInput.value = roundMatch.value;
        }

        bootstrap.Modal.getOrCreateInstance(modal).show();
    }

    async function handleQuestionFormSubmit(event) {
        event.preventDefault();
        if (!store) return;

        const companyId = document.getElementById('questionCompany')?.value || '';
        const company = companyId ? store.getCompanyById(companyId) : null;
        const roundValue = document.getElementById('questionRound')?.value || 'general';
        const topic = document.getElementById('questionTopic').value.trim();
        const questionText = document.getElementById('questionText').value.trim();
        const answer = document.getElementById('questionAnswer').value.trim();
        const difficulty = document.getElementById('questionDifficulty').value;
        const tags = (document.getElementById('questionTags').value || '').split(',').map((tag) => tag.trim()).filter(Boolean);
        const questionId = document.getElementById('questionId').value || 'question-' + Date.now().toString(36);
        const pdfInput = document.getElementById('questionPdf');
        const existingQuestion = store.getQuestions().find((item) => item.id === questionId) || null;

        if (!topic || !questionText) {
            alert('Please fill in the required topic and question fields.');
            return;
        }

        let pdfName = existingQuestion?.pdfName || '';
        let pdfData = existingQuestion?.pdfData || '';
        if (pdfInput && pdfInput.files && pdfInput.files[0]) {
            const selectedPdf = pdfInput.files[0];
            const fileData = await readFileAsDataUrl(selectedPdf);
            pdfName = fileData.name;
            pdfData = fileData.data;
        }

        const payload = {
            id: questionId,
            companyId: companyId || '',
            companyName: company ? company.name : 'General',
            round: roundValue,
            topic,
            question: questionText,
            answer,
            difficulty,
            tags,
            pdfName,
            pdfData,
            general: !companyId,
            createdAt: existingQuestion?.createdAt || new Date().toISOString()
        };

        store.addQuestion(payload);
        renderQuestionTable();
        populateQuestionSelects();
        document.getElementById('questionForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('questionModal')).hide();
    }

    const companySearch = document.getElementById('companySearch');
    if (companySearch) {
        companySearch.addEventListener('input', refreshCompanyFilters);
    }

    const companyStatusFilter = document.getElementById('companyStatusFilter');
    if (companyStatusFilter) {
        companyStatusFilter.addEventListener('change', refreshCompanyFilters);
    }

    const addCompanyButton = document.querySelector('[data-bs-target="#companyModal"]');
    if (addCompanyButton) {
        addCompanyButton.addEventListener('click', function () {
            const form = document.getElementById('companyForm');
            if (form) form.reset();
            document.getElementById('companyId').value = '';
            document.getElementById('companyModalTitle').textContent = 'Add Company';
            document.getElementById('customRoundWrapper').style.display = 'none';
            if (document.getElementById('customRoundName')) document.getElementById('customRoundName').value = '';
            const pdfNameText = document.getElementById('companyPdfName');
            if (pdfNameText) pdfNameText.textContent = 'No PDF selected';
            document.querySelectorAll('[data-round-option]').forEach((box) => box.checked = false);
            refreshSelectedRounds();
        });
    }

    const companyPdfInput = document.getElementById('companyPdf');
    if (companyPdfInput) {
        companyPdfInput.addEventListener('change', function () {
            const pdfNameText = document.getElementById('companyPdfName');
            if (!this.files || !this.files[0]) {
                if (pdfNameText) pdfNameText.textContent = 'No PDF selected';
                return;
            }
            if (pdfNameText) pdfNameText.textContent = this.files[0].name;
        });
    }

    const companyForm = document.getElementById('companyForm');
    if (companyForm) {
        companyForm.addEventListener('submit', handleCompanyFormSubmit);
    }

    const questionSearch = document.getElementById('questionSearch');
    if (questionSearch) {
        questionSearch.addEventListener('input', renderQuestionTable);
    }

    const questionCompanyFilter = document.getElementById('questionCompanyFilter');
    if (questionCompanyFilter) {
        questionCompanyFilter.addEventListener('change', renderQuestionTable);
    }

    const planForm = document.getElementById('planForm');
    if (planForm) {
        planForm.addEventListener('submit', handlePlanFormSubmit);
    }

    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', handleQuestionFormSubmit);
    }

    const companySelect = document.getElementById('questionCompany');
    if (companySelect) {
        populateQuestionSelects();
        companySelect.addEventListener('change', updateRoundOptionsForCompany);
    }

    const addQuestionButton = document.querySelector('[data-bs-target="#questionModal"]');
    if (addQuestionButton) {
        addQuestionButton.addEventListener('click', function () {
            const form = document.getElementById('questionForm');
            if (form) form.reset();
            document.getElementById('questionId').value = '';
            populateQuestionSelects();
            updateRoundOptionsForCompany();
        });
    }

    bindCompanyRoundControls();
    refreshSelectedRounds();
    renderPlans();
    renderCompanyTable();
    renderQuestionTable();
    populateQuestionSelects();
    if (companySelect) updateRoundOptionsForCompany();
});
