// State Management
let chatHistory = [];
let knowledgeBase = [];
let questionCount = 0;
let isVoiceInputActive = false;
let currentCategory = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadTheme();
    loadKnowledgeBase();
    initializeChatInterface();
});

// Event Listeners
function initializeEventListeners() {
    // Chat input
    const questionInput = document.getElementById('questionInput');
    const sendBtn = document.getElementById('sendBtn');

    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendQuestion();
        }
    });

    sendBtn.addEventListener('click', sendQuestion);

    // Knowledge search
    const knowledgeSearch = document.getElementById('knowledgeSearch');
    knowledgeSearch.addEventListener('input', (e) => {
        searchKnowledgeBase(e.target.value);
    });

    // File upload
    const kbFileInput = document.getElementById('kbFileInput');
    kbFileInput.addEventListener('change', handleFileUpload);

    // Settings sliders
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const valueSpan = e.target.parentElement.querySelector('.range-value');
            if (valueSpan) {
                valueSpan.textContent = `${e.target.value}%`;
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            showKnowledgeBaseManager();
        }
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            questionInput.focus();
        }
    });
}

// Theme Management
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');

    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle i');

    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    }
}

// Knowledge Base Management
function loadKnowledgeBase() {
    // Initialize with sample knowledge base
    knowledgeBase = [
        {
            id: 1,
            title: 'Employee Handbook 2024',
            category: 'hr',
            content: 'The employee handbook contains all company policies, procedures, and guidelines for employees. It covers topics such as code of conduct, benefits, leave policies, and workplace expectations.',
            lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            size: '2.4 MB',
            type: 'pdf'
        },
        {
            id: 2,
            title: 'IT Security Policy',
            category: 'it',
            content: 'IT security policy outlines the rules and procedures for protecting company information systems and data. It includes password requirements, acceptable use policies, and incident response procedures.',
            lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            size: '1.2 MB',
            type: 'docx'
        },
        {
            id: 3,
            title: 'Expense Guidelines',
            category: 'finance',
            content: 'Expense guidelines provide instructions on how to submit expense reports, what expenses are reimbursable, and the approval process for business expenses.',
            lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            size: '856 KB',
            type: 'pdf'
        },
        {
            id: 4,
            title: 'Project Management Tools Guide',
            category: 'operations',
            content: 'Guide to project management tools used in the organization, including Jira, Asana, and Microsoft Project. Includes best practices and workflows.',
            lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            size: '1.5 MB',
            type: 'pdf'
        },
        {
            id: 5,
            title: 'Remote Work Policy',
            category: 'hr',
            content: 'Remote work policy outlines the guidelines for employees working remotely, including expectations, communication protocols, and equipment requirements.',
            lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            size: '1.1 MB',
            type: 'pdf'
        },
        {
            id: 6,
            title: 'Software License Management',
            category: 'it',
            content: 'Procedures for managing software licenses, compliance requirements, and procurement processes for new software tools.',
            lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            size: '745 KB',
            type: 'docx'
        }
    ];

    updateKnowledgeBaseStats();
    renderDocumentList();
}

function updateKnowledgeBaseStats() {
    const kbSizeElement = document.getElementById('kbSize');
    kbSizeElement.textContent = `${knowledgeBase.length} documents in knowledge base`;

    // Update category counts
    const categoryCounts = {
        all: knowledgeBase.length,
        hr: knowledgeBase.filter(doc => doc.category === 'hr').length,
        it: knowledgeBase.filter(doc => doc.category === 'it').length,
        finance: knowledgeBase.filter(doc => doc.category === 'finance').length,
        operations: knowledgeBase.filter(doc => doc.category === 'operations').length
    };

    // Update category list counts
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        const categoryName = item.querySelector('span').textContent.toLowerCase().replace(' ', '-');
        const countElement = item.querySelector('.count');
        if (categoryCounts[categoryName] !== undefined) {
            countElement.textContent = categoryCounts[categoryName];
        }
    });
}

function searchKnowledgeBase(query) {
    if (!query.trim()) {
        renderDocumentList();
        return;
    }

    const filteredDocs = knowledgeBase.filter(doc =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.content.toLowerCase().includes(query.toLowerCase())
    );

    renderDocumentList(filteredDocs);
}

function filterByCategory(category) {
    currentCategory = category;

    // Update active state
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(category)) {
            item.classList.add('active');
        }
    });

    // Filter documents
    if (category === 'all') {
        renderDocumentList();
    } else {
        const filteredDocs = knowledgeBase.filter(doc => doc.category === category);
        renderDocumentList(filteredDocs);
    }
}

function renderDocumentList(docs = knowledgeBase) {
    const documentList = document.getElementById('documentList');
    if (!documentList) return;

    const recentDocs = docs
        .sort((a, b) => b.lastUpdated - a.lastUpdated)
        .slice(0, 4);

    documentList.innerHTML = recentDocs.map(doc => {
        const daysAgo = Math.floor((Date.now() - doc.lastUpdated) / (24 * 60 * 60 * 1000));
        const timeAgo = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

        const icon = doc.type === 'pdf' ? 'fa-file-pdf' : doc.type === 'docx' ? 'fa-file-word' : 'fa-file-alt';

        return `
            <div class="document-item" onclick="viewDocument(${doc.id})">
                <i class="fas ${icon}"></i>
                <div class="document-info">
                    <span class="document-title">${doc.title}</span>
                    <span class="document-meta">${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Chat Interface
function initializeChatInterface() {
    // Welcome message is already in HTML
    updateChatStats();
}

function updateChatStats() {
    const questionCountElement = document.getElementById('questionCount');
    questionCountElement.textContent = `${questionCount} questions asked`;
}

function sendQuestion() {
    const questionInput = document.getElementById('questionInput');
    const question = questionInput.value.trim();

    if (!question) return;

    // Add user message
    addMessage('user', question);

    // Clear input
    questionInput.value = '';

    // Update stats
    questionCount++;
    updateChatStats();

    // Show loading
    showLoading();

    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(question);
        addMessage('assistant', response);
        hideLoading();
    }, 1500 + Math.random() * 1000);
}

function addMessage(sender, content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content user-content">
                <p>${escapeHtml(content)}</p>
                <span class="message-time">${formatTime(new Date())}</span>
            </div>
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="assistant-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${content}</p>
                <div class="message-actions">
                    <button onclick="copyMessage('${escapeHtml(content).replace(/'/g, "\\'")}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button onclick="likeMessage(this)">
                        <i class="fas fa-thumbs-up"></i> Helpful
                    </button>
                    <button onclick="dislikeMessage(this)">
                        <i class="fas fa-thumbs-down"></i> Not Helpful
                    </button>
                </div>
                <span class="message-time">${formatTime(new Date())}</span>
            </div>
        `;
    }

    // Remove welcome message if it exists
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add to history
    chatHistory.push({ sender, content, timestamp: new Date() });
}

function generateAIResponse(question) {
    const lowerQuestion = question.toLowerCase();

    // Check against knowledge base
    const relevantDoc = knowledgeBase.find(doc =>
        doc.title.toLowerCase().includes(lowerQuestion) ||
        doc.content.toLowerCase().includes(lowerQuestion)
    );

    if (relevantDoc) {
        return generateResponseFromDocument(relevantDoc, question);
    }

    // Predefined responses for common questions
    const responses = {
        'how do i reset my password': 'To reset your password: 1) Go to the login page and click "Forgot Password" 2) Enter your email address 3) Check your email for reset instructions 4) Create a new password following our security requirements. For additional help, contact IT support at it-support@company.com.',
        'what are the working hours': 'Our standard working hours are Monday to Friday, 9:00 AM to 6:00 PM. We have a flexible work policy that allows employees to adjust their start and end times within core hours of 10:00 AM to 4:00 PM. Remote work options are available based on your role and manager approval.',
        'how do i request leave': 'To request leave: 1) Log into the HR portal 2) Navigate to "Time Off" section 3) Select the type of leave and dates 4) Submit your request for manager approval 5) Wait for confirmation email. Please submit requests at least 2 weeks in advance for planned leave.',
        'where can i find it support': 'IT support is available through multiple channels: 1) Create a ticket at it-helpdesk.company.com 2) Email it-support@company.com 3) Call extension 1234 for urgent issues 4) Visit the IT office on the 3rd floor. Response times: 2-4 hours for urgent issues, 24 hours for standard requests.',
        'benefits': 'Our benefits package includes: Health insurance (medical, dental, vision), 401(k) with company match, paid time off (20 days vacation + 10 sick days), parental leave, professional development budget, wellness program, and employee assistance program. Details are in the Employee Handbook.',
        'expense': 'For expense reimbursement: 1) Keep all receipts 2) Use the expense mobile app or web portal 3) Submit expenses within 30 days 4) Include business purpose and client/project code 5) Manager approval required. Most expenses are reimbursed within 5 business days after approval.',
        'remote work': 'Our remote work policy allows: Up to 3 days remote work per week for eligible roles, remote work for full-time by manager approval, required home office equipment provided, regular check-ins with your team. All remote work arrangements must be documented in the HR system.',
        'training': 'Professional development opportunities include: Annual $2000 training budget, online learning platform access, internal workshops and seminars, tuition reimbursement for job-related courses, mentorship program, conference attendance. Discuss development goals with your manager during performance reviews.',
        'equipment': 'Standard equipment provided: Laptop computer, monitor, keyboard, mouse, phone (if needed), home office stipend for remote workers. Additional equipment requires manager approval and IT procurement. All equipment remains company property and must be returned upon employment termination.'
    };

    // Find the best matching response
    for (const [key, response] of Object.entries(responses)) {
        if (lowerQuestion.includes(key)) {
            return response;
        }
    }

    // Check for policy-related questions
    if (lowerQuestion.includes('policy') || lowerQuestion.includes('handbook')) {
        return 'You can find all company policies in the Employee Handbook 2024, which is available in the HR documents section. Key policy areas include code of conduct, leave policies, remote work guidelines, and safety procedures. For specific policy questions, please contact HR at hr@company.com.';
    }

    // Check for benefits-related questions
    if (lowerQuestion.includes('benefit') || lowerQuestion.includes('insurance') || lowerQuestion.includes('401k')) {
        return 'Detailed benefits information is available in the Employee Handbook and the Benefits Portal. Our comprehensive benefits package includes health insurance, retirement plans, paid time off, and wellness programs. For personal benefits questions, please contact the HR benefits specialist at benefits@company.com.';
    }

    // Default response
    return `I understand you're asking about "${question}". While I don't have specific information about this in my knowledge base, I can help you in several ways:

1. **Search our documents**: The knowledge base contains company policies, procedures, and guidelines
2. **Contact the right department**: Let me know what type of information you need and I can direct you to the appropriate contact
3. **General guidance**: I can provide general information about common workplace topics

Could you provide more details about what you're looking for, or would you like me to search our documents for related information?`;
}

function generateResponseFromDocument(doc, question) {
    return `Based on the "${doc.title}" document in our knowledge base:

${doc.content}

For more detailed information, you can access the full document in the knowledge base manager. If you need specific clarification, please let me know what aspect you'd like me to explain further.`;
}

function askSuggestedQuestion(question) {
    document.getElementById('questionInput').value = question;
    sendQuestion();
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function copyMessage(content) {
    navigator.clipboard.writeText(content).then(() => {
        showNotification('Message copied to clipboard!');
    });
}

function likeMessage(button) {
    button.innerHTML = '<i class="fas fa-thumbs-up"></i> Liked';
    button.style.color = 'var(--success-color)';
    button.disabled = true;
}

function dislikeMessage(button) {
    button.innerHTML = '<i class="fas fa-thumbs-down"></i> Noted';
    button.style.color = 'var(--error-color)';
    button.disabled = true;
}

function clearChat() {
    if (confirm('Are you sure you want to clear all messages?')) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="assistant-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Hello! I'm your internal knowledge assistant. I can help you find information, answer questions, and provide insights based on your organization's knowledge base.</p>
                    <div class="suggested-questions">
                        <h4>Suggested Questions:</h4>
                        <button class="suggested-btn" onclick="askSuggestedQuestion('What are our company policies?')">
                            What are our company policies?
                        </button>
                        <button class="suggested-btn" onclick="askSuggestedQuestion('How do I request time off?')">
                            How do I request time off?
                        </button>
                        <button class="suggested-btn" onclick="askSuggestedQuestion('What tools do we use for project management?')">
                            What tools do we use for project management?
                        </button>
                        <button class="suggested-btn" onclick="askSuggestedQuestion('Where can I find IT support?')">
                            Where can I find IT support?
                        </button>
                    </div>
                </div>
            </div>
        `;
        chatHistory = [];
    }
}

function exportChat() {
    if (chatHistory.length === 0) {
        alert('No chat history to export');
        return;
    }

    const chatContent = `Knowledge QA Chat Export\n${'='.repeat(50)}\n\n` +
        `Date: ${new Date().toLocaleString()}\n` +
        `Total Questions: ${questionCount}\n\n` +
        `${'='.repeat(50)}\n\n` +
        chatHistory.map(msg =>
            `[${msg.timestamp.toLocaleString()}] ${msg.sender.toUpperCase()}:\n${msg.content}\n`
        ).join('\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-qa-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Chat exported successfully!');
}

function toggleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice input is not supported in your browser');
        return;
    }

    const voiceBtn = document.querySelector('.voice-btn');
    const questionInput = document.getElementById('questionInput');

    if (isVoiceInputActive) {
        stopVoiceInput();
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Input';
    } else {
        startVoiceInput();
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
    }
}

function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('questionInput').value = transcript;
        stopVoiceInput();
        sendQuestion();
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        stopVoiceInput();
        alert('Voice input failed. Please try again.');
    };

    recognition.onend = function() {
        stopVoiceInput();
    };

    recognition.start();
    isVoiceInputActive = true;
    window.currentRecognition = recognition;
}

function stopVoiceInput() {
    isVoiceInputActive = false;
    if (window.currentRecognition) {
        window.currentRecognition.stop();
        window.currentRecognition = null;
    }
    const voiceBtn = document.querySelector('.voice-btn');
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Input';
}

// Modal Management
function showKnowledgeBaseManager() {
    const modal = document.getElementById('kbManagerModal');
    modal.classList.add('active');
    switchTab('upload');
}

function showAnalytics() {
    const modal = document.getElementById('analyticsModal');
    modal.classList.add('active');
}

function showSettings() {
    const modal = document.getElementById('kbManagerModal');
    modal.classList.add('active');
    switchTab('settings');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

function switchTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.style.display = 'none');

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }

    // Add active class to clicked button
    event.target.classList.add('active');
}

// File Upload
function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];

    for (const file of files) {
        if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|txt|md)$/i)) {
            alert(`Invalid file type: ${file.name}. Please upload PDF, DOCX, TXT, or MD files.`);
            continue;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert(`File too large: ${file.name}. Maximum file size is 10MB.`);
            continue;
        }

        // Simulate processing
        setTimeout(() => {
            const newDoc = {
                id: knowledgeBase.length + 1,
                title: file.name,
                category: 'auto-categorize' in document.getElementById('autoCategorize') && document.getElementById('autoCategorize').checked ? categorizeFile(file.name) : 'hr',
                content: `Uploaded content from ${file.name}. This document has been processed and added to the knowledge base.`,
                lastUpdated: new Date(),
                size: formatFileSize(file.size),
                type: file.name.split('.').pop().toLowerCase()
            };

            knowledgeBase.push(newDoc);
            updateKnowledgeBaseStats();
            renderDocumentList();
            showNotification(`${file.name} uploaded successfully!`);
        }, 1000);
    }

    // Clear file input
    event.target.value = '';
}

function categorizeFile(fileName) {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('hr') || lowerName.includes('employee') || lowerName.includes('handbook')) return 'hr';
    if (lowerName.includes('it') || lowerName.includes('security') || lowerName.includes('software')) return 'it';
    if (lowerName.includes('finance') || lowerName.includes('expense') || lowerName.includes('budget')) return 'finance';
    if (lowerName.includes('operation') || lowerName.includes('process') || lowerName.includes('workflow')) return 'operations';
    return 'hr'; // default
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Document Management
function viewDocument(docId) {
    const doc = knowledgeBase.find(d => d.id === docId);
    if (doc) {
        alert(`Document: ${doc.title}\n\nCategory: ${doc.category}\nSize: ${doc.size}\nLast Updated: ${doc.lastUpdated.toLocaleDateString()}\n\n${doc.content}`);
    }
}

function editDocument(docId) {
    const doc = knowledgeBase.find(d => d.id === docId);
    if (doc) {
        const newTitle = prompt('Edit document title:', doc.title);
        if (newTitle && newTitle.trim()) {
            doc.title = newTitle.trim();
            doc.lastUpdated = new Date();
            renderDocumentList();
            showNotification('Document updated successfully!');
        }
    }
}

function deleteDocument(docId) {
    if (confirm('Are you sure you want to delete this document?')) {
        knowledgeBase = knowledgeBase.filter(d => d.id !== docId);
        updateKnowledgeBaseStats();
        renderDocumentList();
        showNotification('Document deleted successfully!');
    }
}

function refreshKnowledgeBase() {
    showLoading();
    setTimeout(() => {
        updateKnowledgeBaseStats();
        renderDocumentList();
        hideLoading();
        showNotification('Knowledge base refreshed!');
    }, 1000);
}

function saveKnowledgeBaseSettings() {
    // Simulate saving settings
    showLoading();
    setTimeout(() => {
        hideLoading();
        closeModal('kbManagerModal');
        showNotification('Settings saved successfully!');
    }, 1000);
}

// UI Utilities
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .user-message {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
        gap: 1rem;
    }

    .assistant-message {
        display: flex;
        margin-bottom: 1.5rem;
        gap: 1rem;
    }

    .user-content {
        background: var(--primary-color);
        color: white;
        padding: 1rem;
        border-radius: var(--radius);
        max-width: 70%;
        position: relative;
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        background: var(--bg-tertiary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
        font-size: 1.25rem;
        flex-shrink: 0;
    }

    .message-time {
        font-size: 0.75rem;
        color: var(--text-tertiary);
        margin-top: 0.5rem;
        display: block;
    }

    .user-content .message-time {
        color: rgba(255, 255, 255, 0.7);
    }

    .message-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .assistant-message:hover .message-actions {
        opacity: 1;
    }

    .message-actions button {
        background: var(--bg-tertiary);
        border: none;
        border-radius: calc(var(--radius) - 6px);
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .message-actions button:hover {
        background: var(--primary-color);
        color: white;
    }

    .message-actions button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);