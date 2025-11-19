// Interview Prep Assistant JavaScript
class InterviewPrepAssistant {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.roleInput = document.getElementById('interviewRole');
        this.focusSelect = document.getElementById('interviewFocus');
        this.generateBtn = document.getElementById('interviewGenerateBtn');
        this.outputDiv = document.getElementById('interviewOutput');
        this.resultSection = document.getElementById('resultSection');
        this.copyBtn = document.getElementById('copyQuestionsBtn');
        this.regenerateBtn = document.getElementById('regenerateBtn');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateQuestions());
        this.copyBtn.addEventListener('click', () => this.copyAllQuestions());
        this.regenerateBtn.addEventListener('click', () => this.generateQuestions());

        // Allow Enter key in role input to generate questions
        this.roleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateQuestions();
            }
        });
    }

    generateQuestions() {
        const role = (this.roleInput.value || 'this role').trim();
        const focus = this.focusSelect.value;

        if (!role || role === 'this role') {
            this.showError('Please enter a job title to generate relevant questions.');
            return;
        }

        // Show loading state
        this.generateBtn.textContent = 'Generating...';
        this.generateBtn.disabled = true;

        // Simulate AI processing
        setTimeout(() => {
            const questions = this.createQuestions(role, focus);
            this.displayQuestions(questions, role);
            this.generateBtn.textContent = 'Generate 5 Questions';
            this.generateBtn.disabled = false;
        }, 1000);
    }

    createQuestions(role, focus) {
        const questionTemplates = {
            technical: [
                `Can you walk me through a recent project where you used skills relevant to ${role}?`,
                `How do you approach debugging a complex issue related to ${role}?`,
                `What tools or technologies do you rely on most as a ${role}?`,
                `Describe a time you improved performance or reliability in a ${role} context.`,
                `How do you stay up to date with best practices for ${role}?`
            ],
            behavioral: [
                `Tell me about a time you faced a major challenge as a ${role}. What did you do?`,
                `Describe a situation where you had a conflict with a teammate and how you handled it.`,
                `Share an example of when you had to deliver under a tight deadline.`,
                `Tell me about a time you made a mistake in ${role}. What did you learn?`,
                `Describe a moment you showed leadership, even without a formal title.`
            ],
            'system design': [
                `How would you design a scalable system for ${role}-related workflows used by millions of users?`,
                `What trade-offs would you consider when choosing databases for a ${role}-centric platform?`,
                `How would you add observability and monitoring to critical features a ${role} owns?`,
                `Describe how you would break a monolith into services for a product your ${role} works on.`,
                `How do you ensure security and reliability in systems managed by a ${role}?`
            ]
        };

        return questionTemplates[focus] || questionTemplates.technical;
    }

    displayQuestions(questions, role) {
        const focus = this.focusSelect.value;
        const focusEmoji = {
            'technical': '🔧',
            'behavioral': '🤝',
            'system design': '🏗️'
        };

        this.outputDiv.innerHTML = questions.map((question, index) => `
            <div class="question-card bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-all">
                <div class="flex items-start gap-3">
                    <span class="text-2xl flex-shrink-0">${focusEmoji[focus] || '❓'}</span>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded">Question ${index + 1}</span>
                            <button class="copy-single text-xs bg-gray-600 bg-opacity-50 text-gray-300 px-2 py-1 rounded hover:bg-opacity-70" data-question="${question.replace(/"/g, '&quot;')}">
                                Copy
                            </button>
                        </div>
                        <p class="text-gray-200 leading-relaxed">${question}</p>
                    </div>
                </div>
            </div>
        `).join('');

        this.resultSection.classList.remove('hidden');

        // Add copy functionality to individual question buttons
        this.outputDiv.querySelectorAll('.copy-single').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                this.copyToClipboard(question);
            });
        });

        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async copyAllQuestions() {
        const questions = Array.from(this.outputDiv.querySelectorAll('.copy-single'))
            .map(btn => btn.getAttribute('data-question'));

        const role = this.roleInput.value.trim();
        const focus = this.focusSelect.value;
        const header = `Interview Practice Questions - ${role} (${focus}):\n${'='.repeat(50)}\n\n`;
        const allQuestions = header + questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');

        try {
            await navigator.clipboard.writeText(allQuestions);
            this.showSuccess('All questions copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy questions. Please select and copy manually.');
        }
    }

    async copyToClipboard(question) {
        try {
            await navigator.clipboard.writeText(question);
            this.showSuccess('Question copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy question. Please select and copy manually.');
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 ${
            type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the interview prep assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InterviewPrepAssistant();
});