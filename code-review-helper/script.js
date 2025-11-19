// Code Review Helper JavaScript
class CodeReviewHelper {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.codeInput = document.getElementById('codeInput');
        this.focusArea = document.getElementById('focusArea');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.clearBtn = document.getElementById('clearCodeBtn');
        this.resultSection = document.getElementById('resultSection');

        // Options
        this.checkStyle = document.getElementById('checkStyle');
        this.checkSecurity = document.getElementById('checkSecurity');
        this.checkPerformance = document.getElementById('checkPerformance');
        this.checkDocstring = document.getElementById('checkDocstring');

        // Result elements
        this.criticalIssuesSpan = document.getElementById('criticalIssues');
        this.warningsSpan = document.getElementById('warnings');
        this.suggestionsSpan = document.getElementById('suggestions');
        this.scoreSpan = document.getElementById('score');

        this.criticalList = document.getElementById('criticalList');
        this.warningList = document.getElementById('warningList');
        this.suggestionList = document.getElementById('suggestionList');
        this.positiveList = document.getElementById('positiveList');
        this.codeExamples = document.getElementById('codeExamples');

        // Info elements
        this.codeLang = document.getElementById('codeLang');
        this.lineCount = document.getElementById('lineCount');

        // Action buttons
        this.copyReportBtn = document.getElementById('copyReportBtn');
        this.exportBtn = document.getElementById('exportBtn');
    }

    bindEvents() {
        this.analyzeBtn.addEventListener('click', () => this.analyzeCode());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyReportBtn.addEventListener('click', () => this.copyReport());
        this.exportBtn.addEventListener('click', () => this.exportReport());

        // Real-time updates
        this.codeInput.addEventListener('input', () => this.updateStats());
    }

    updateStats() {
        const code = this.codeInput.value;
        const lines = code.split('\n').length;
        this.lineCount.textContent = `${lines} lines`;

        // Simple language detection
        let detectedLang = 'Unknown';
        if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
            detectedLang = 'Python';
        } else if (code.includes('function') || code.includes('const ') || code.includes('=>')) {
            detectedLang = 'JavaScript';
        } else if (code.includes('public class') || code.includes('import java')) {
            detectedLang = 'Java';
        } else if (code.includes('#include') || code.includes('int main')) {
            detectedLang = 'C/C++';
        } else if (code.includes('using System') || code.includes('namespace')) {
            detectedLang = 'C#';
        }

        this.codeLang.textContent = `Language: ${detectedLang}`;
    }

    analyzeCode() {
        const code = this.codeInput.value.trim();

        if (!code) {
            this.showError('Please paste some code to analyze.');
            return;
        }

        // Show loading state
        this.analyzeBtn.querySelector('span').textContent = 'Analyzing...';
        this.analyzeBtn.disabled = true;

        // Simulate AI processing
        setTimeout(() => {
            const analysis = this.performCodeAnalysis(code);
            this.displayResults(analysis, code);
            this.analyzeBtn.querySelector('span').textContent = '🚀 Analyze Code';
            this.analyzeBtn.disabled = false;
        }, 2000);
    }

    performCodeAnalysis(code) {
        const analysis = {
            critical: [],
            warnings: [],
            suggestions: [],
            positive: [],
            codeExamples: []
        };

        const lines = code.split('\n');
        const focus = this.focusArea.value;

        // Security analysis
        if (this.checkSecurity.checked || focus === 'security') {
            if (code.includes('eval(')) {
                analysis.critical.push({
                    line: this.findLine(code, 'eval('),
                    issue: 'Use of eval() function can lead to code injection attacks',
                    severity: 'critical'
                });
            }
            if (code.includes('innerHTML') || code.includes('document.write')) {
                analysis.warnings.push({
                    line: this.findLine(code, 'innerHTML') || this.findLine(code, 'document.write'),
                    issue: 'Direct DOM manipulation can be vulnerable to XSS attacks',
                    severity: 'warning'
                });
            }
        }

        // Code style analysis
        if (this.checkStyle.checked || focus === 'readability') {
            lines.forEach((line, index) => {
                if (line.length > 100) {
                    analysis.warnings.push({
                        line: index + 1,
                        issue: `Line too long (${line.length} characters) - consider breaking it`,
                        severity: 'warning'
                    });
                }
            });

            // Check for proper indentation
            const hasInconsistentIndentation = lines.some(line =>
                line.trim() && (line.startsWith(' ') && line.includes('\t'))
            );
            if (hasInconsistentIndentation) {
                analysis.suggestions.push({
                    issue: 'Inconsistent indentation detected - use either tabs or spaces consistently',
                    severity: 'suggestion'
                });
            }
        }

        // Performance analysis
        if (this.checkPerformance.checked || focus === 'performance') {
            if (code.includes('for') && code.includes('length')) {
                analysis.suggestions.push({
                    issue: 'Consider caching array length in loops for better performance',
                    severity: 'suggestion'
                });
            }
            if (code.includes('getElementById') || code.includes('querySelector')) {
                analysis.warnings.push({
                    line: this.findLine(code, 'getElementById') || this.findLine(code, 'querySelector'),
                    issue: 'DOM queries in loops can impact performance - consider caching elements',
                    severity: 'warning'
                });
            }
        }

        // Documentation analysis
        if (this.checkDocstring.checked) {
            const hasFunctions = (code.includes('function ') || code.includes('def ') || code.includes('=>'));
            if (hasFunctions && !code.includes('//') && !code.includes('#') && !code.includes('/*')) {
                analysis.warnings.push({
                    issue: 'No documentation found - consider adding comments to explain complex logic',
                    severity: 'warning'
                });
            }
        }

        // General best practices
        if (focus === 'general' || focus === 'best-practices') {
            if (!code.includes('try') && !code.includes('catch') && !code.includes('error')) {
                analysis.suggestions.push({
                    issue: 'Consider adding error handling for better robustness',
                    severity: 'suggestion'
                });
            }

            if (code.includes('console.log') && focus !== 'best-practices') {
                analysis.warnings.push({
                    line: this.findLine(code, 'console.log'),
                    issue: 'Remove console.log statements from production code',
                    severity: 'warning'
                });
            }
        }

        // Bug detection
        if (focus === 'bugs') {
            if (code.includes('==') && !code.includes('===')) {
                analysis.warnings.push({
                    issue: 'Use === instead of == for strict equality comparison',
                    severity: 'warning'
                });
            }

            if (code.includes('var ')) {
                analysis.suggestions.push({
                    issue: 'Consider using let or const instead of var for better scope control',
                    severity: 'suggestion'
                });
            }
        }

        // Always add some positive feedback
        if (analysis.critical.length === 0) {
            analysis.positive.push('No critical security issues detected');
        }
        if (analysis.warnings.length <= 2) {
            analysis.positive.push('Code structure follows good practices');
        }
        if (lines.length > 10) {
            analysis.positive.push('Well-structured code with good organization');
        }

        // Generate code examples
        if (analysis.warnings.length > 0) {
            analysis.codeExamples.push({
                title: 'Improved Error Handling',
                before: `function processData(data) {\n    return data.result;\n}`,
                after: `function processData(data) {\n    try {\n        if (!data || !data.result) {\n            throw new Error('Invalid data provided');\n        }\n        return data.result;\n    } catch (error) {\n        console.error('Processing failed:', error);\n        return null;\n    }\n}`
            });
        }

        return analysis;
    }

    findLine(code, searchTerm) {
        const lines = code.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(searchTerm)) {
                return i + 1;
            }
        }
        return null;
    }

    displayResults(analysis, originalCode) {
        // Update statistics
        this.animateNumber(this.criticalIssuesSpan, analysis.critical.length);
        this.animateNumber(this.warningsSpan, analysis.warnings.length);
        this.animateNumber(this.suggestionsSpan, analysis.suggestions.length);

        // Calculate quality score
        const score = this.calculateQualityScore(analysis);
        this.scoreSpan.textContent = score;

        // Render lists
        this.renderIssueList(this.criticalList, analysis.critical, '🚨', 'critical');
        this.renderIssueList(this.warningList, analysis.warnings, '⚠️', 'warning');
        this.renderIssueList(this.suggestionList, analysis.suggestions, '💡', 'suggestion');
        this.renderIssueList(this.positiveList, analysis.positive, '✅', 'positive');

        // Render code examples
        this.renderCodeExamples(analysis.codeExamples);

        this.resultSection.classList.remove('hidden');
        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    renderIssueList(container, items, emoji, type) {
        if (items.length === 0) {
            container.innerHTML = `<p class="text-gray-400 italic">No ${type} issues found</p>`;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="issue-card bg-gray-700 bg-opacity-50 rounded-lg p-3 border-l-4 ${
                type === 'critical' ? 'border-red-500' :
                type === 'warning' ? 'border-yellow-500' :
                type === 'suggestion' ? 'border-blue-500' : 'border-green-500'
            }">
                <div class="flex items-start gap-3">
                    <span class="text-xl flex-shrink-0">${emoji}</span>
                    <div class="flex-1">
                        <p class="text-gray-200 text-sm">${item.issue}</p>
                        ${item.line ? `<span class="text-xs text-gray-400 mt-1">Line ${item.line}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderCodeExamples(examples) {
        if (examples.length === 0) {
            this.codeExamples.innerHTML = '<p class="text-gray-400 italic">No code improvements suggested</p>';
            return;
        }

        this.codeExamples.innerHTML = examples.map(example => `
            <div class="code-example bg-gray-800 rounded-lg p-4">
                <h5 class="text-sm font-medium text-indigo-300 mb-3">${example.title}</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h6 class="text-xs text-red-400 mb-2">Before:</h6>
                        <pre class="bg-gray-900 rounded p-3 text-xs overflow-x-auto"><code>${example.before}</code></pre>
                    </div>
                    <div>
                        <h6 class="text-xs text-green-400 mb-2">After:</h6>
                        <pre class="bg-gray-900 rounded p-3 text-xs overflow-x-auto"><code>${example.after}</code></pre>
                    </div>
                </div>
            </div>
        `).join('');
    }

    calculateQualityScore(analysis) {
        const criticalWeight = analysis.critical.length * 10;
        const warningWeight = analysis.warnings.length * 5;
        const suggestionWeight = analysis.suggestions.length * 2;
        const positiveBonus = analysis.positive.length * 3;

        const totalDeductions = criticalWeight + warningWeight + suggestionWeight;
        const finalScore = Math.max(0, 100 - totalDeductions + positiveBonus);

        if (finalScore >= 90) return 'A+';
        if (finalScore >= 80) return 'A';
        if (finalScore >= 70) return 'B';
        if (finalScore >= 60) return 'C';
        return 'D';
    }

    animateNumber(element, target) {
        let current = 0;
        const increment = target / 20;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 50);
    }

    clearAll() {
        this.codeInput.value = '';
        this.resultSection.classList.add('hidden');
        this.updateStats();
        this.codeInput.focus();
    }

    async copyReport() {
        const critical = Array.from(this.criticalList.querySelectorAll('.issue-card p')).map(p => p.textContent);
        const warnings = Array.from(this.warningList.querySelectorAll('.issue-card p')).map(p => p.textContent);
        const suggestions = Array.from(this.suggestionList.querySelectorAll('.issue-card p')).map(p => p.textContent);

        const report = `
CODE REVIEW REPORT
==================

🚨 Critical Issues (${critical.length}):
${critical.length ? critical.map((c, i) => `${i + 1}. ${c}`).join('\n') : 'None'}

⚠️ Warnings (${warnings.length}):
${warnings.length ? warnings.map((w, i) => `${i + 1}. ${w}`).join('\n') : 'None'}

💡 Suggestions (${suggestions.length}):
${suggestions.length ? suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'None'}

Overall Quality Score: ${this.scoreSpan.textContent}

Generated on: ${new Date().toLocaleString()}
        `.trim();

        try {
            await navigator.clipboard.writeText(report);
            this.showSuccess('Code review report copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy report. Please select and copy manually.');
        }
    }

    exportReport() {
        const code = this.codeInput.value;
        const report = `
CODE REVIEW REPORT
==================

Analyzed Code:
${'='.repeat(50)}
${code}
${'='.repeat(50)}

Critical Issues (${this.criticalIssuesSpan.textContent}):
${Array.from(this.criticalList.querySelectorAll('.issue-card p')).map(p => `• ${p.textContent}`).join('\n') || 'None'}

Warnings (${this.warningsSpan.textContent}):
${Array.from(this.warningList.querySelectorAll('.issue-card p')).map(p => `• ${p.textContent}`).join('\n') || 'None'}

Suggestions (${this.suggestionsSpan.textContent}):
${Array.from(this.suggestionList.querySelectorAll('.issue-card p')).map(p => `• ${p.textContent}`).join('\n') || 'None'}

Positive Points:
${Array.from(this.positiveList.querySelectorAll('.issue-card p')).map(p => `• ${p.textContent}`).join('\n') || 'None'}

Overall Quality Score: ${this.scoreSpan.textContent}

Analysis Focus: ${this.focusArea.options[this.focusArea.selectedIndex].text}

Generated on: ${new Date().toLocaleString()}
Tool: Code Review Helper by Philemon Ofotan
        `.trim();

        // Create and download file
        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code-review-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Code review report exported successfully!');
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

// Initialize the code review helper when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CodeReviewHelper();
});