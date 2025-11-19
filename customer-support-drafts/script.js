// Customer Support Drafts JavaScript
class CustomerSupportDrafts {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.customerMessage = document.getElementById('customerMessage');
        this.responseTone = document.getElementById('responseTone');
        this.issueType = document.getElementById('issueType');
        this.companyName = document.getElementById('companyName');
        this.generateBtn = document.getElementById('generateBtn');
        this.resultSection = document.getElementById('resultSection');
        this.responseContent = document.getElementById('responseContent');
        this.alternativeResponses = document.getElementById('alternativeResponses');

        // Options
        this.includeSolution = document.getElementById('includeSolution');
        this.includeTimeline = document.getElementById('includeTimeline');
        this.includeNextSteps = document.getElementById('includeNextSteps');

        // Metrics
        this.messageLength = document.getElementById('messageLength');
        this.messageSentiment = document.getElementById('messageSentiment');
        this.toneScore = document.getElementById('toneScore');
        this.empathyScore = document.getElementById('empathyScore');
        this.clarityScore = document.getElementById('clarityScore');
        this.professionalScore = document.getElementById('professionalScore');

        // Actions
        this.copyBtn = document.getElementById('copyBtn');
        this.regenerateBtn = document.getElementById('regenerateBtn');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateResponse());
        this.regenerateBtn.addEventListener('click', () => this.generateResponse());
        this.copyBtn.addEventListener('click', () => this.copyResponse());

        // Real-time message analysis
        this.customerMessage.addEventListener('input', () => this.analyzeMessage());
    }

    analyzeMessage() {
        const message = this.customerMessage.value;
        this.messageLength.textContent = `${message.length} characters`;

        // Simple sentiment analysis
        const sentiment = this.detectSentiment(message);
        this.messageSentiment.textContent = sentiment;

        // Update sentiment color
        const sentimentElement = this.messageSentiment;
        sentimentElement.className = sentiment === 'Positive' ? 'text-xs text-green-400' :
                                     sentiment === 'Negative' ? 'text-xs text-red-400' :
                                     'text-xs text-gray-400';
    }

    detectSentiment(text) {
        const positiveWords = ['happy', 'satisfied', 'good', 'great', 'excellent', 'love', 'thank', 'thanks', 'appreciate', 'wonderful', 'amazing'];
        const negativeWords = ['angry', 'frustrated', 'disappointed', 'terrible', 'awful', 'hate', 'worst', 'problem', 'issue', 'broken', 'fail'];

        const lowerText = text.toLowerCase();
        let positiveCount = 0;
        let negativeCount = 0;

        positiveWords.forEach(word => {
            if (lowerText.includes(word)) positiveCount++;
        });

        negativeWords.forEach(word => {
            if (lowerText.includes(word)) negativeCount++;
        });

        if (positiveCount > negativeCount) return 'Positive';
        if (negativeCount > positiveCount) return 'Negative';
        return 'Neutral';
    }

    generateResponse() {
        const customerMsg = this.customerMessage.value.trim();

        if (!customerMsg) {
            this.showError('Please enter a customer message to generate a response.');
            return;
        }

        // Show loading state
        this.generateBtn.querySelector('span').textContent = 'Generating...';
        this.generateBtn.disabled = true;

        // Simulate AI processing
        setTimeout(() => {
            const response = this.createResponse(customerMsg);
            this.displayResults(response, customerMsg);
            this.generateBtn.querySelector('span').textContent = '✨ Generate Response';
            this.generateBtn.disabled = false;
        }, 1500);
    }

    createResponse(customerMsg) {
        const tone = this.responseTone.value;
        const issueType = this.issueType.value;
        const company = this.companyName.value.trim() || 'Your Company';

        const includeSolution = this.includeSolution.checked;
        const includeTimeline = this.includeTimeline.checked;
        const includeNextSteps = this.includeNextSteps.checked;

        let response = this.getOpening(tone, company);
        response += this.acknowledgeIssue(customerMsg, tone);
        response += this.getAddressSection(issueType, includeSolution);
        response += this.getTimelineSection(includeTimeline);
        response += this.getNextStepsSection(includeNextSteps);
        response += this.getClosing(tone, company);

        return response;
    }

    getOpening(tone, company) {
        const openings = {
            professional: `Dear Customer,\n\nThank you for contacting ${company} Support. `,
            empathetic: `Dear Customer,\n\nI understand you're reaching out to ${company}, and I'm here to help. `,
            friendly: `Hi there! 👋\n\nThanks for reaching out to ${company}! `,
            urgent: `Dear Customer,\n\nThank you for bringing this to our attention at ${company}. `,
            apologetic: `Dear Customer,\n\nI'm very sorry for the experience you've had with ${company}. `
        };

        return openings[tone] || openings.professional;
    }

    acknowledgeIssue(customerMsg, tone) {
        const acknowledgments = {
            professional: 'I have received your message and understand your concern. ',
            empathetic: 'I can hear how important this matter is to you, and I want to help resolve it. ',
            friendly: 'I totally get what you\'re saying, and I\'m here to help sort this out! ',
            urgent: 'I understand the urgency of this situation and am prioritizing your case. ',
            apologetic: 'I sincerely apologize for the frustration this has caused. '
        };

        const issueLength = customerMsg.length;
        let detailLevel = '';

        if (issueLength > 200) {
            detailLevel = 'I appreciate you providing such detailed information about your situation. ';
        }

        return acknowledgments[tone] + detailLevel;
    }

    getAddressSection(issueType, includeSolution) {
        if (!includeSolution) return '';

        const solutions = {
            general: 'I\'ve reviewed your inquiry and can provide guidance on the best path forward. ',
            technical: 'I\'ve reviewed your technical issue and can provide several solutions to resolve this. ',
            billing: 'I\'ve reviewed your billing concern and can clarify the charges and available options. ',
            complaint: 'I take your complaint very seriously and am committed to making things right. ',
            feature: 'I appreciate your feature suggestion and have passed it along to our product team. ',
            bug: 'I\'ve identified this as a bug and our development team is working on a fix. '
        };

        return solutions[issueType] || solutions.general;
    }

    getTimelineSection(includeTimeline) {
        if (!includeTimeline) return '';

        const timelines = [
            'You can expect a resolution within the next 24-48 hours. ',
            'Our team typically resolves issues like this within 1-2 business days. ',
            'We\'re working on this and will provide an update by tomorrow. '
        ];

        return timelines[Math.floor(Math.random() * timelines.length)];
    }

    getNextStepsSection(includeNextSteps) {
        if (!includeNextSteps) return '';

        const nextSteps = [
            'In the meantime, please try clearing your browser cache and restarting your device.',
            'I\'ll keep you updated on our progress and notify you as soon as we have a resolution.',
            'If you have any additional questions or if the issue persists, please don\'t hesitate to reach out.'
        ];

        return nextSteps[Math.floor(Math.random() * nextSteps.length)];
    }

    getClosing(tone, company) {
        const closings = {
            professional: `Thank you for your patience and understanding.\n\nBest regards,\n${company} Support Team`,
            empathetic: `We value your business and are committed to ensuring your satisfaction.\n\nWarm regards,\n${company} Support Team`,
            friendly: `We\'re here to help whenever you need us!\n\nCheers,\n${company} Team`,
            urgent: `I\'ll personally ensure this gets the attention it deserves.\n\nSincerely,\n${company} Support`,
            apologetic: `Thank you for giving us the opportunity to make this right.\n\nWith sincere apologies,\n${company} Support Team`
        };

        return '\n\n' + closings[tone] || closings.professional;
    }

    generateAlternativeResponses(customerMsg, issueType, tone) {
        const alternatives = [];

        // Alternative 1: More concise
        alternatives.push({
            tone: 'Concise',
            response: `Hi there! Thanks for reaching out. I understand your concern and I'm here to help. I've reviewed your issue and am working on a solution. I'll get back to you within 24 hours with an update.

Best regards,
Support Team`
        });

        // Alternative 2: More detailed
        alternatives.push({
            tone: 'Detailed',
            response: `Dear Valued Customer,

Thank you for taking the time to contact us regarding this matter. I sincerely appreciate you bringing this to our attention, as your feedback helps us improve our services.

After carefully reviewing your message, I can see that this requires immediate attention. I have escalated your case to our specialized team who will investigate this thoroughly and provide you with a comprehensive solution.

You can expect to hear back from us within 24-48 hours with a detailed resolution. In the meantime, if you have any additional information that might help us resolve this faster, please don't hesitate to share it.

Thank you for your patience and understanding during this process.

Sincerely,
Customer Support Team`
        });

        // Alternative 3: Different tone
        const differentTones = ['Professional', 'Empathetic', 'Friendly'].filter(t => t !== tone);
        const altTone = differentTones[Math.floor(Math.random() * differentTones.length)];

        this.responseTone.value = altTone.toLowerCase();
        const altResponse = this.createResponse(customerMsg);
        this.responseTone.value = tone; // Reset original tone

        alternatives.push({
            tone: altTone,
            response: altResponse
        });

        return alternatives;
    }

    displayResults(response, customerMsg) {
        // Display main response
        this.responseContent.innerHTML = response.replace(/\n/g, '<br>');

        // Generate and display alternatives
        const alternatives = this.generateAlternativeResponses(
            customerMsg,
            this.issueType.value,
            this.responseTone.value
        );

        this.alternativeResponses.innerHTML = alternatives.map((alt, index) => `
            <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 border-l-4 border-blue-400">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-blue-300">${alt.tone} Tone</span>
                    <button class="copy-alt text-xs bg-gray-600 bg-opacity-50 text-gray-300 px-2 py-1 rounded hover:bg-opacity-70" data-response="${alt.response.replace(/"/g, '&quot;').replace(/\n/g, '\\n')}">
                        Copy
                    </button>
                </div>
                <p class="text-sm text-gray-200">${alt.response.replace(/\n/g, '<br>')}</p>
            </div>
        `).join('');

        // Add copy functionality to alternatives
        this.alternativeResponses.querySelectorAll('.copy-alt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const response = e.target.getAttribute('data-response').replace(/\\n/g, '\n');
                this.copyToClipboard(response);
            });
        });

        // Update metrics
        this.updateMetrics(response);

        this.resultSection.classList.remove('hidden');
        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    updateMetrics(response) {
        // Calculate scores (simplified version)
        const empathyKeywords = ['understand', 'appreciate', 'sorry', 'thank', 'value', 'care'];
        const clarityKeywords = ['clear', 'specific', 'step', 'next', 'timeline', 'solution'];
        const professionalKeywords = ['best regards', 'sincerely', 'professional', 'team', 'support'];

        const responseLower = response.toLowerCase();

        const empathyScore = Math.min(100, empathyKeywords.reduce((score, word) =>
            score + (responseLower.includes(word) ? 20 : 0), 40));
        const clarityScore = Math.min(100, clarityKeywords.reduce((score, word) =>
            score + (responseLower.includes(word) ? 15 : 0), 50));
        const professionalScore = Math.min(100, professionalKeywords.reduce((score, word) =>
            score + (responseLower.includes(word) ? 25 : 0), 40));

        const avgScore = (empathyScore + clarityScore + professionalScore) / 3;
        const toneGrade = avgScore >= 90 ? 'A+' : avgScore >= 80 ? 'A' : avgScore >= 70 ? 'B' : avgScore >= 60 ? 'C' : 'D';

        // Animate the scores
        this.animateNumber(this.empathyScore, empathyScore, '%');
        this.animateNumber(this.clarityScore, clarityScore, '%');
        this.animateNumber(this.professionalScore, professionalScore, '%');
        this.animateText(this.toneScore, toneGrade);
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

    animateText(element, text) {
        element.textContent = '';
        const chars = text.split('');
        chars.forEach((char, index) => {
            setTimeout(() => {
                element.textContent += char;
            }, index * 100);
        });
    }

    async copyResponse() {
        const response = this.responseContent.textContent.replace(/<br>/g, '\n');
        await this.copyToClipboard(response);
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccess('Response copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy response. Please select and copy manually.');
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

// Initialize the customer support drafts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CustomerSupportDrafts();
});