// Meeting Notes Summarizer JavaScript
class MeetingNotesSummarizer {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.inputTextarea = document.getElementById('meetingInput');
        this.generateBtn = document.getElementById('meetingGenerateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resultSection = document.getElementById('resultSection');
        this.decisionsDiv = document.getElementById('meetingDecisions');
        this.actionsDiv = document.getElementById('meetingActions');
        this.highlightsDiv = document.getElementById('meetingHighlights');
        this.wordCountSpan = document.getElementById('wordCount');
        this.charCountSpan = document.getElementById('charCount');
        this.copyAllBtn = document.getElementById('copyAllBtn');
        this.exportBtn = document.getElementById('exportBtn');

        // Statistics elements
        this.totalDecisionsSpan = document.getElementById('totalDecisions');
        this.totalActionsSpan = document.getElementById('totalActions');
        this.totalNotesSpan = document.getElementById('totalNotes');
        this.completionRateSpan = document.getElementById('completionRate');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.summarizeNotes());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyAllBtn.addEventListener('click', () => this.copyAllSummary());
        this.exportBtn.addEventListener('click', () => this.exportSummary());

        // Real-time character and word count
        this.inputTextarea.addEventListener('input', () => this.updateCounts());
    }

    updateCounts() {
        const text = this.inputTextarea.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;

        this.wordCountSpan.textContent = `${words} words`;
        this.charCountSpan.textContent = `${chars} characters`;
    }

    summarizeNotes() {
        const rawNotes = this.inputTextarea.value.trim();

        if (!rawNotes) {
            this.showError('Please add some meeting notes to summarize.');
            return;
        }

        // Show loading state
        this.generateBtn.querySelector('span').textContent = 'Processing...';
        this.generateBtn.disabled = true;

        // Simulate AI processing
        setTimeout(() => {
            const summary = this.processNotes(rawNotes);
            this.displaySummary(summary);
            this.generateBtn.querySelector('span').textContent = '🎯 Summarize into Key Points';
            this.generateBtn.disabled = false;
        }, 1500);
    }

    processNotes(rawNotes) {
        // Split into sentences
        const sentences = rawNotes
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(Boolean);

        // Decision keywords
        const decisionKeywords = [
            'decided', 'will', 'agreed', 'concluded', 'confirm', 'finalize',
            'approved', 'rejected', 'accepted', 'committed', 'resolved'
        ];

        // Action keywords
        const actionKeywords = [
            'assign', 'follow up', 'follow-up', 'send', 'prepare', 'update',
            'review', 'next step', 'action item', 'responsible', 'deadline',
            'complete', 'implement', 'create', 'schedule', 'organize'
        ];

        // Categorize sentences
        const decisions = sentences.filter(sentence =>
            decisionKeywords.some(keyword =>
                sentence.toLowerCase().includes(keyword.toLowerCase())
            )
        ).slice(0, 5);

        const actions = sentences.filter(sentence =>
            actionKeywords.some(keyword =>
                sentence.toLowerCase().includes(keyword.toLowerCase())
            )
        ).slice(0, 6);

        // Remaining sentences as highlights
        const highlights = sentences.filter(sentence =>
            !decisions.includes(sentence) && !actions.includes(sentence)
        ).slice(0, 4);

        return {
            decisions: decisions.length ? decisions : ['No clear decisions detected in the notes.'],
            actions: actions.length ? actions : ['No action items detected in the notes.'],
            highlights: highlights.length ? highlights : ['No additional key points detected.']
        };
    }

    displaySummary(summary) {
        this.renderList(this.decisionsDiv, summary.decisions, '🚦');
        this.renderList(this.actionsDiv, summary.actions, '✅');
        this.renderList(this.highlightsDiv, summary.highlights, '💡');

        this.updateStatistics(summary);
        this.resultSection.classList.remove('hidden');
        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    renderList(container, items, defaultEmoji = '') {
        if (items.length === 1 && items[0].includes('No ') && items[0].includes('detected')) {
            container.innerHTML = `<p class="text-gray-400 italic">${items[0]}</p>`;
        } else {
            container.innerHTML = items.map(item => `
                <div class="flex items-start gap-2 p-2 rounded hover:bg-gray-600 hover:bg-opacity-30 transition-colors">
                    <span class="text-green-400 mt-0.5">•</span>
                    <span class="text-gray-200 leading-relaxed">${this.capitalizeFirstLetter(item)}</span>
                </div>
            `).join('');
        }
    }

    updateStatistics(summary) {
        const decisions = summary.decisions.filter(d => !d.includes('No ') && !d.includes('detected')).length;
        const actions = summary.actions.filter(a => !a.includes('No ') && !a.includes('detected')).length;
        const notes = summary.highlights.filter(h => !h.includes('No ') && !h.includes('detected')).length;
        const total = decisions + actions + notes;
        const coverage = total > 0 ? Math.min(100, Math.round((total / 15) * 100)) : 0;

        this.animateNumber(this.totalDecisionsSpan, decisions);
        this.animateNumber(this.totalActionsSpan, actions);
        this.animateNumber(this.totalNotesSpan, notes);
        this.animateNumber(this.completionRateSpan, coverage, '%');
    }

    animateNumber(element, target, suffix = '') {
        let current = 0;
        const increment = target / 20;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + suffix;
        }, 50);
    }

    clearAll() {
        this.inputTextarea.value = '';
        this.resultSection.classList.add('hidden');
        this.updateCounts();
        this.inputTextarea.focus();
    }

    async copyAllSummary() {
        const decisions = Array.from(this.decisionsDiv.querySelectorAll('p, div span:last-child'))
            .map(el => el.textContent.trim())
            .filter(text => text && !text.includes('No ') && !text.includes('detected'));

        const actions = Array.from(this.actionsDiv.querySelectorAll('p, div span:last-child'))
            .map(el => el.textContent.trim())
            .filter(text => text && !text.includes('No ') && !text.includes('detected'));

        const highlights = Array.from(this.highlightsDiv.querySelectorAll('p, div span:last-child'))
            .map(el => el.textContent.trim())
            .filter(text => text && !text.includes('No ') && !text.includes('detected'));

        const summary = `
MEETING SUMMARY
================

🚦 DECISIONS:
${decisions.length ? decisions.map((d, i) => `${i + 1}. ${d}`).join('\n') : 'No decisions detected'}

✅ ACTION ITEMS:
${actions.length ? actions.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'No action items detected'}

💡 KEY POINTS:
${highlights.length ? highlights.map((h, i) => `${i + 1}. ${h}`).join('\n') : 'No key points detected'}

---
Generated on ${new Date().toLocaleString()}
        `.trim();

        try {
            await navigator.clipboard.writeText(summary);
            this.showSuccess('Meeting summary copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy summary. Please select and copy manually.');
        }
    }

    exportSummary() {
        const decisions = Array.from(this.decisionsDiv.querySelectorAll('p, div span:last-child'))
            .map(el => el.textContent.trim())
            .filter(text => text && !text.includes('No ') && !text.includes('detected'));

        const actions = Array.from(this.actionsDiv.querySelectorAll('p, div span:last-child'))
            .map(el => el.textContent.trim())
            .filter(text => text && !text.includes('No ') && !text.includes('detected'));

        const highlights = Array.from(this.highlightsDiv.querySelectorAll('p, div span:last-child'))
            .map(el => el.textContent.trim())
            .filter(text => text && !text.includes('No ') && !text.includes('detected'));

        const summary = `
MEETING SUMMARY
================

🚦 DECISIONS:
${decisions.length ? decisions.map((d, i) => `${i + 1}. ${d}`).join('\n') : 'No decisions detected'}

✅ ACTION ITEMS:
${actions.length ? actions.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'No action items detected'}

💡 KEY POINTS:
${highlights.length ? highlights.map((h, i) => `${i + 1}. ${h}`).join('\n') : 'No key points detected'}

---
Original Notes:
${this.inputTextarea.value}

Generated on: ${new Date().toLocaleString()}
Tool: Meeting Notes Summarizer by Philemon Ofotan
        `.trim();

        // Create and download file
        const blob = new Blob([summary], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meeting-summary-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Meeting summary exported successfully!');
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
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

// Initialize the meeting notes summarizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MeetingNotesSummarizer();
});