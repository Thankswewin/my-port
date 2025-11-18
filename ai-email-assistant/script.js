// AI Email Assistant JavaScript
class EmailAssistant {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.toneSelect = document.getElementById('emailTone');
        this.inputTextarea = document.getElementById('emailInput');
        this.generateBtn = document.getElementById('emailGenerateBtn');
        this.outputDiv = document.getElementById('emailOutput');
        this.resultSection = document.getElementById('resultSection');
        this.copyBtn = document.getElementById('copyBtn');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateEmail());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    generateEmail() {
        const notes = this.inputTextarea.value.trim();

        if (!notes) {
            this.showError('Please add some notes to generate an email.');
            return;
        }

        // Show loading state
        this.generateBtn.textContent = 'Generating...';
        this.generateBtn.disabled = true;

        // Simulate AI processing (in real implementation, this would call an AI API)
        setTimeout(() => {
            const email = this.createEmailFromNotes(notes, this.toneSelect.value);
            this.displayResult(email);
            this.generateBtn.textContent = 'Generate Email';
            this.generateBtn.disabled = false;
        }, 1000);
    }

    createEmailFromNotes(notes, tone) {
        let greeting, closing, signature;

        // Set tone-specific elements
        switch (tone) {
            case 'friendly':
                greeting = 'Hello,';
                closing = 'Best regards,';
                signature = 'Philemon';
                break;
            case 'direct':
                greeting = 'Hi,';
                closing = 'Sincerely,';
                signature = 'Philemon Ofotan';
                break;
            default: // professional
                greeting = 'Dear Hiring Manager,';
                closing = 'Kind regards,';
                signature = 'Philemon Ofotan';
        }

        // Create email body
        const emailBody = [
            greeting,
            '',
            'Thank you for taking the time to speak with me.',
            this.capitalizeFirstLetter(notes),
            '',
            'If you need any additional information from me, I would be happy to provide it.',
            '',
            closing,
            signature
        ];

        return emailBody.join('\n');
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    displayResult(email) {
        this.outputDiv.textContent = email;
        this.resultSection.classList.remove('hidden');
        this.outputDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.outputDiv.textContent);
            this.showSuccess('Email copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy email. Please select and copy manually.');
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

// Initialize the email assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailAssistant();
});