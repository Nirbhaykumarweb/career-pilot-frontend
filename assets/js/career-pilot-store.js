(function () {
    const STORAGE_KEY = 'careerPilotStore';

    const defaultData = {
        plans: [
            {
                id: 'starter',
                name: 'Starter',
                price: '₹499',
                billingPeriod: 'mo',
                description: 'Everything you need to start',
                buttonText: 'Start Free',
                buttonLink: 'register.html',
                features: ['Limited question access', 'Basic progress tracking'],
                status: 'Active',
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z'
            },
            {
                id: 'pro',
                name: 'Pro',
                price: '₹999',
                billingPeriod: 'mo',
                description: 'For students actively sitting in placement season.',
                buttonText: 'Get Pro',
                buttonLink: 'register.html',
                features: ['Unlimited questions', 'AI interview simulations'],
                status: 'Active',
                createdAt: '2026-01-02T00:00:00.000Z',
                updatedAt: '2026-01-02T00:00:00.000Z'
            },
            {
                id: 'enterprise',
                name: 'Enterprise',
                price: 'Custom',
                billingPeriod: '',
                description: 'For colleges and training institutes.',
                buttonText: 'Contact Us',
                buttonLink: '#footer',
                features: ['Advanced analytics', 'Custom admin controls'],
                status: 'Active',
                createdAt: '2026-01-03T00:00:00.000Z',
                updatedAt: '2026-01-03T00:00:00.000Z'
            }
        ],
        companies: [
            {
                id: 'tcs',
                name: 'TCS',
                sector: 'IT Services',
                location: 'India',
                jobRole: 'Software Engineer',
                package: '₹7.5 LPA',
                description: 'TCS is one of the most sought-after campus recruiters and evaluates candidates through aptitude, technical, coding, project discussion, and HR rounds.',
                status: 'Active',
                rounds: [
                    { id: 'aptitude', name: 'Aptitude Round', type: 'Aptitude' },
                    { id: 'technical', name: 'Technical Round', type: 'Technical' },
                    { id: 'dsa', name: 'DSA Round', type: 'DSA' },
                    { id: 'project', name: 'Project Round', type: 'Project' },
                    { id: 'hr', name: 'HR Round', type: 'HR' }
                ],
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z'
            },
            {
                id: 'infosys',
                name: 'Infosys',
                sector: 'IT Services',
                location: 'India',
                jobRole: 'System Engineer',
                package: '₹6.5 LPA',
                description: 'Infosys focuses on aptitude, technical fundamentals, communication, and overall fit for system engineering roles.',
                status: 'Active',
                rounds: [
                    { id: 'aptitude', name: 'Aptitude Round', type: 'Aptitude' },
                    { id: 'technical', name: 'Technical Round', type: 'Technical' },
                    { id: 'hr', name: 'HR Round', type: 'HR' }
                ],
                createdAt: '2026-01-02T00:00:00.000Z',
                updatedAt: '2026-01-02T00:00:00.000Z'
            },
            {
                id: 'wipro',
                name: 'Wipro',
                sector: 'Technology',
                location: 'India',
                jobRole: 'Project Engineer',
                package: '₹6.0 LPA',
                description: 'Wipro commonly assesses aptitude, problem solving, technical fundamentals, and interpersonal communication.',
                status: 'Pending',
                rounds: [
                    { id: 'aptitude', name: 'Aptitude Round', type: 'Aptitude' },
                    { id: 'technical', name: 'Technical Round', type: 'Technical' },
                    { id: 'dsa', name: 'DSA Round', type: 'DSA' },
                    { id: 'hr', name: 'HR Round', type: 'HR' }
                ],
                createdAt: '2026-01-03T00:00:00.000Z',
                updatedAt: '2026-01-03T00:00:00.000Z'
            }
        ],
        questions: [
            {
                id: 'q-1',
                companyId: 'tcs',
                companyName: 'TCS',
                round: 'technical',
                topic: 'DBMS',
                question: 'What is the difference between a primary key and a unique key?',
                answer: 'A primary key cannot contain NULL values and uniquely identifies each row, while a unique key allows one NULL and is used to enforce uniqueness without being the table primary key.',
                difficulty: 'Medium',
                tags: ['DBMS', 'SQL'],
                general: false,
                createdAt: '2026-01-01T00:00:00.000Z'
            },
            {
                id: 'q-2',
                companyId: 'tcs',
                companyName: 'TCS',
                round: 'aptitude',
                topic: 'Arithmetic',
                question: 'A train travels 120 km in 2 hours. What is its speed?',
                answer: 'The speed is 60 km/h because 120 divided by 2 equals 60.',
                difficulty: 'Easy',
                tags: ['Speed', 'Arithmetic'],
                general: false,
                createdAt: '2026-01-01T00:00:00.000Z'
            },
            {
                id: 'q-3',
                companyId: 'infosys',
                companyName: 'Infosys',
                round: 'hr',
                topic: 'HR',
                question: 'Tell me about a time you worked in a team and resolved a conflict.',
                answer: 'A strong answer should include the situation, actions taken, and the positive outcome of the collaboration.',
                difficulty: 'Medium',
                tags: ['HR', 'Communication'],
                general: false,
                createdAt: '2026-01-02T00:00:00.000Z'
            },
            {
                id: 'q-4',
                companyId: '',
                companyName: 'General',
                round: 'general',
                topic: 'Resume',
                question: 'How should you structure your resume for a campus placement interview?',
                answer: 'Focus on a clear summary, technical skills, projects, achievements, internships, and measurable impact.',
                difficulty: 'Easy',
                tags: ['Resume', 'General'],
                general: true,
                createdAt: '2026-01-05T00:00:00.000Z'
            }
        ]
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function normalizeCompany(company) {
        if (!company || typeof company !== 'object') return null;
        const id = company.id || company.companyId || slugify(company.name || 'company');
        const rounds = Array.isArray(company.rounds) ? company.rounds.map((round, index) => {
            if (typeof round === 'string') {
                return { id: slugify(round), name: round, type: round, order: index };
            }
            return {
                id: round.id || slugify(round.name || round.type || 'custom-round'),
                name: round.name || round.type || 'Custom Round',
                type: round.type || round.name || 'Custom Round',
                order: round.order ?? index
            };
        }) : [];

        return {
            id,
            companyId: id,
            name: company.name || 'Unnamed Company',
            sector: company.sector || company.industry || 'General',
            location: company.location || 'Not specified',
            jobRole: company.jobRole || company.role || 'Not specified',
            package: company.package || company.salary || 'Not specified',
            description: company.description || '',
            status: company.status || 'Active',
            rounds,
            pdfName: company.pdfName || '',
            pdfData: company.pdfData || '',
            pdfMimeType: company.pdfMimeType || 'application/pdf',
            createdAt: company.createdAt || new Date().toISOString(),
            updatedAt: company.updatedAt || new Date().toISOString(),
            importantQuestions: Array.isArray(company.importantQuestions) ? company.importantQuestions : []
        };
    }

    function slugify(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'company';
    }

    function ensureDefaults() {
        try {
            const existing = localStorage.getItem(STORAGE_KEY);
            if (!existing) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
                return clone(defaultData);
            }

            const parsed = JSON.parse(existing);
            const base = {
                plans: Array.isArray(parsed.plans) ? parsed.plans : clone(defaultData.plans),
                companies: Array.isArray(parsed.companies) ? parsed.companies.map(normalizeCompany).filter(Boolean) : clone(defaultData.companies),
                questions: Array.isArray(parsed.questions) ? parsed.questions : clone(defaultData.questions)
            };

            if (!base.plans.length) {
                base.plans = clone(defaultData.plans);
            }
            if (!base.companies.length) {
                base.companies = clone(defaultData.companies);
            }
            if (!base.questions.length) {
                base.questions = clone(defaultData.questions);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
            return base;
        } catch (error) {
            console.warn('careerPilotStore: could not load data from localStorage:', error);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
            return clone(defaultData);
        }
    }

    function notify() {
        window.dispatchEvent(new CustomEvent('careerPilotStoreUpdated', { detail: getAllData() }));
    }

    function getAllData() {
        const data = ensureDefaults();
        return {
            plans: Array.isArray(data.plans) ? data.plans : [],
            companies: data.companies.map(normalizeCompany).filter(Boolean),
            questions: Array.isArray(data.questions) ? data.questions : []
        };
    }

    function saveAllData(data) {
        const current = getAllData();
        const next = {
            plans: Array.isArray(data.plans) ? data.plans : current.plans,
            companies: Array.isArray(data.companies) ? data.companies.map(normalizeCompany).filter(Boolean) : current.companies,
            questions: Array.isArray(data.questions) ? data.questions : current.questions
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        notify();
        return next;
    }

    function getCompanies() {
        return getAllData().companies;
    }

    function getPlans() {
        return getAllData().plans;
    }

    function getQuestions() {
        return getAllData().questions;
    }

    function getCompanyById(companyId) {
        const id = String(companyId || '').trim();
        return getCompanies().find((company) => company.id === id || company.companyId === id || company.name.toLowerCase() === id.toLowerCase()) || null;
    }

    function getRoundOptions(companyId) {
        const company = getCompanyById(companyId);
        if (!company) {
            return [];
        }
        return company.rounds || [];
    }

    function getCompanyQuestions(companyId, roundId) {
        const company = companyId ? getCompanyById(companyId) : null;
        const normalized = String(roundId || '').trim();
        return getQuestions().filter((question) => {
            if (question.general) return true;
            if (!company) return false;
            if (question.companyId !== company.id && question.companyName !== company.name) return false;
            if (!normalized) return true;
            return String(question.round).toLowerCase() === normalized.toLowerCase();
        });
    }

    function addCompany(company) {
        const data = getAllData();
        const normalized = normalizeCompany(company);
        if (!normalized) return null;
        const existingIndex = data.companies.findIndex((item) => item.id === normalized.id || item.name.toLowerCase() === normalized.name.toLowerCase());
        if (existingIndex >= 0) {
            data.companies[existingIndex] = { ...data.companies[existingIndex], ...normalized, updatedAt: new Date().toISOString() };
        } else {
            data.companies.push({ ...normalized, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        }
        saveAllData(data);
        return data.companies[data.companies.length - 1] || normalized;
    }

    function deleteCompany(companyId) {
        const data = getAllData();
        const nextCompanies = data.companies.filter((company) => company.id !== String(companyId));
        const nextQuestions = data.questions.filter((question) => question.companyId !== String(companyId));
        saveAllData({ plans: data.plans, companies: nextCompanies, questions: nextQuestions });
        return true;
    }

    function addPlan(plan) {
        const data = getAllData();
        const next = {
            id: plan.id || slugify(plan.name || 'plan-' + Date.now().toString(36)),
            name: plan.name || 'New Plan',
            price: plan.price || '₹0',
            billingPeriod: plan.billingPeriod || '',
            description: plan.description || '',
            buttonText: plan.buttonText || 'Get Started',
            buttonLink: plan.buttonLink || 'register.html',
            features: Array.isArray(plan.features) ? plan.features : [],
            status: plan.status || 'Active',
            createdAt: plan.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const index = data.plans.findIndex((item) => item.id === next.id);
        if (index >= 0) {
            data.plans[index] = next;
        } else {
            data.plans.push(next);
        }
        saveAllData(data);
        return next;
    }

    function deletePlan(planId) {
        const data = getAllData();
        const nextPlans = data.plans.filter((plan) => plan.id !== planId);
        saveAllData({ plans: nextPlans, companies: data.companies, questions: data.questions });
        return true;
    }

    function addQuestion(question) {
        const data = getAllData();
        const next = {
            id: question.id || 'question-' + Date.now().toString(36),
            companyId: question.companyId || '',
            companyName: question.companyName || (question.companyId ? getCompanyById(question.companyId)?.name || 'General' : 'General'),
            round: question.round || 'general',
            topic: question.topic || 'General',
            question: question.question || '',
            answer: question.answer || '',
            difficulty: question.difficulty || 'Medium',
            tags: Array.isArray(question.tags) ? question.tags : [],
            pdfName: question.pdfName || '',
            pdfData: question.pdfData || '',
            general: Boolean(question.general || !question.companyId),
            createdAt: question.createdAt || new Date().toISOString()
        };
        const index = data.questions.findIndex((item) => item.id === next.id);
        if (index >= 0) {
            data.questions[index] = next;
        } else {
            data.questions.push(next);
        }
        saveAllData(data);
        return next;
    }

    function deleteQuestion(questionId) {
        const data = getAllData();
        const nextQuestions = data.questions.filter((question) => question.id !== questionId);
        saveAllData({ plans: data.plans, companies: data.companies, questions: nextQuestions });
        return true;
    }

    function normalizeRoundLabel(value) {
        if (!value) return 'General';
        return String(value)
            .replace(/[_-]+/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    window.careerPilotStore = {
        STORAGE_KEY,
        defaultData: clone(defaultData),
        ensureSeeded: ensureDefaults,
        getAllData,
        getPlans,
        getCompanies,
        getQuestions,
        getCompanyById,
        getRoundOptions,
        getCompanyQuestions,
        addPlan,
        deletePlan,
        addCompany,
        deleteCompany,
        addQuestion,
        deleteQuestion,
        normalizeRoundLabel,
        saveAllData
    };

    ensureDefaults();
})();
