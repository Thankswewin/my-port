// Naija SME Copy Assistant JavaScript
class SMECopyAssistant {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.typeSelect = document.getElementById('smeType');
        this.platformSelect = document.getElementById('smePlatform');
        this.offerInput = document.getElementById('smeOffer');
        this.generateBtn = document.getElementById('smeGenerateBtn');
        this.outputDiv = document.getElementById('smeOutput');
        this.resultSection = document.getElementById('resultSection');
        this.copyAllBtn = document.getElementById('copyAllBtn');
        this.regenerateBtn = document.getElementById('regenerateBtn');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateCaptions());
        this.copyAllBtn.addEventListener('click', () => this.copyAllCaptions());
        this.regenerateBtn.addEventListener('click', () => this.generateCaptions());
    }

    generateCaptions() {
        const type = this.typeSelect.value;
        const platform = this.platformSelect.value;
        const offer = (this.offerInput.value || 'a special offer').trim();

        if (!offer) {
            this.showError('Please enter an offer or promotion to generate captions.');
            return;
        }

        // Show loading state
        this.generateBtn.textContent = 'Generating...';
        this.generateBtn.disabled = true;

        // Simulate AI processing
        setTimeout(() => {
            const captions = this.createCaptions(type, platform, offer);
            this.displayCaptions(captions);
            this.generateBtn.textContent = 'Generate Captions (3 Ideas)';
            this.generateBtn.disabled = false;
        }, 1000);
    }

    createCaptions(type, platform, offer) {
        const typeEmojis = {
            'fashion brand': '👗',
            'food delivery': '🍜',
            'tech startup': '💻',
            'hair salon': '💇‍♀️',
            'online course': '📚'
        };

        const platformHashtags = {
            'Instagram': '#Instagram #NaijaBusiness',
            'Twitter': '#TwitterX #NaijaTech',
            'WhatsApp': '#WhatsAppBiz #SupportLocal',
            'TikTok': '#TikTok #NaijaContent'
        };

        const emoji = typeEmojis[type] || '🛍️';
        const hashtag = platformHashtags[platform] || '#NaijaBusiness';

        return [
            `${emoji} ${offer} just dropped!\n${type} serving you better every day. Send a DM to grab yours now. ${hashtag} #SupportSmallBusiness`,

            `🔥 Lagos, are you ready? ${offer} for our amazing customers.\nTap the link in bio or send "${type.split(' ')[0]}" to chat and order. #MadeInNigeria`,

            `🎯 Don't sleep on this! ${offer} available for a limited time only.\nTell a friend, save this post, and let's grow together. ${hashtag} #ShopLocalNigeria`
        ];
    }

    displayCaptions(captions) {
        this.outputDiv.innerHTML = captions.map((caption, index) => `
            <div class="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs bg-emerald-500 bg-opacity-20 text-emerald-300 px-2 py-1 rounded">Caption ${index + 1}</span>
                    <button class="copy-single text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded hover:bg-opacity-30" data-caption="${caption.replace(/"/g, '&quot;')}">
                        Copy
                    </button>
                </div>
                <p class="whitespace-pre-wrap text-gray-200">${caption.replace(/\n/g, '<br>')}</p>
            </div>
        `).join('');

        this.resultSection.classList.remove('hidden');

        // Add copy functionality to individual caption buttons
        this.outputDiv.querySelectorAll('.copy-single').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const caption = e.target.getAttribute('data-caption');
                this.copyToClipboard(caption);
            });
        });

        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async copyAllCaptions() {
        const captions = Array.from(this.outputDiv.querySelectorAll('.copy-single'))
            .map(btn => btn.getAttribute('data-caption'));

        const allCaptions = captions.join('\n\n---\n\n');

        try {
            await navigator.clipboard.writeText(allCaptions);
            this.showSuccess('All captions copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy captions. Please select and copy manually.');
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccess('Caption copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy caption. Please select and copy manually.');
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

// Initialize the SME copy assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SMECopyAssistant();
});