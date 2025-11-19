// State Management
let currentDocument = null;
let currentSummary = null;
let isGenerating = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadTheme();
    checkFileAPI();
});

// Event Listeners
function initializeEventListeners() {
    // File Upload
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const documentText = document.getElementById('documentText');

    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and Drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Text Input
    documentText.addEventListener('input', handleTextInput);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateSummary();
        }
        if (e.key === 'Escape') {
            hideLoading();
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

// File Handling
function checkFileAPI() {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('Your browser does not support file APIs. Please use a modern browser.');
        return false;
    }
    return true;
}

function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    const validTypes = [
        'text/plain',
        'text/markdown',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|md|pdf|docx)$/i)) {
        alert('Please select a valid file type: PDF, DOCX, TXT, or MD');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result;
        if (typeof content === 'string') {
            handleDocumentInput(content, file.name);
        } else {
            // For binary files like PDF, we'll show a placeholder
            handleDocumentInput(`[File: ${file.name}]\n\nBinary file detected. Please extract text content and paste it manually.`, file.name);
        }
    };

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
    } else {
        reader.readAsDataURL(file);
    }
}

// Text Input Handling
function handleTextInput() {
    const textarea = document.getElementById('documentText');
    const text = textarea.value;

    // Update character and word count
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    document.getElementById('charCount').textContent = `${charCount.toLocaleString()} characters`;
    document.getElementById('wordCount').textContent = `${wordCount.toLocaleString()} words`;

    // Enable/disable generate button
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = charCount === 0;
}

function handleDocumentInput(text, fileName = 'Pasted Document') {
    currentDocument = {
        title: fileName,
        content: text,
        wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
        characterCount: text.length
    };

    // Update UI
    document.getElementById('documentText').value = text;
    handleTextInput();

    // Show file info
    const uploadArea = document.querySelector('.upload-content');
    uploadArea.innerHTML = `
        <i class="fas fa-check-circle" style="color: var(--secondary-color);"></i>
        <h3 style="color: var(--secondary-color);">Document Loaded</h3>
        <p>${fileName}</p>
        <button class="remove-file" onclick="removeDocument()">Remove</button>
    `;
}

function removeDocument() {
    currentDocument = null;
    document.getElementById('documentText').value = '';
    document.getElementById('fileInput').value = '';
    handleTextInput();

    const uploadArea = document.querySelector('.upload-content');
    uploadArea.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <h3>Drop Document Here</h3>
        <p>or click to browse</p>
        <p class="supported-formats">Supported: PDF, DOCX, TXT, MD</p>
    `;
}

// Summary Generation
async function generateSummary() {
    if (isGenerating) return;

    const documentText = document.getElementById('documentText').value.trim();
    if (!documentText) {
        alert('Please provide document text or upload a file');
        return;
    }

    isGenerating = true;
    showLoading();

    // Get settings
    const settings = {
        length: document.getElementById('summaryLength').value,
        focus: document.getElementById('focusArea').value,
        tone: document.getElementById('tone').value,
        format: document.getElementById('format').value
    };

    try {
        // Simulate API call with intelligent summarization
        await simulateAPICall();

        // Generate summary based on settings
        const summary = generateIntelligentSummary(documentText, settings);

        // Perform additional analysis
        const analysis = performDocumentAnalysis(documentText);

        // Display results
        displayResults(summary, analysis, settings);

    } catch (error) {
        console.error('Error generating summary:', error);
        alert('An error occurred while generating the summary. Please try again.');
    } finally {
        isGenerating = false;
        hideLoading();
    }
}

function generateIntelligentSummary(text, settings) {
    // This is a sophisticated summarization algorithm
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const words = text.split(/\s+/);

    // Extract key concepts and important sentences
    const wordFreq = {};
    words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        if (cleanWord.length > 3) {
            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
        }
    });

    // Score sentences based on word frequency
    const scoredSentences = sentences.map(sentence => {
        const sentenceWords = sentence.toLowerCase().split(/\s+/);
        let score = 0;
        sentenceWords.forEach(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (wordFreq[cleanWord]) {
                score += wordFreq[cleanWord];
            }
        });
        return { sentence, score, length: sentence.length };
    });

    // Sort by score and filter by length
    scoredSentences.sort((a, b) => b.score - a.score);

    // Generate summary based on requested length
    let summarySentences = [];
    const targetLengths = {
        'very-short': 2,
        'short': 3,
        'medium': 6,
        'detailed': 10
    };

    const targetLength = Math.min(targetLengths[settings.length] || 3, scoredSentences.length);
    summarySentences = scoredSentences.slice(0, targetLength).map(s => s.sentence);

    // Apply focus area modifications
    if (settings.focus === 'key-points') {
        summarySentences = summarySentences.map(s => `• ${s.trim()}`).join('\n');
    } else if (settings.focus === 'actionable') {
        summarySentences = summarySentences.map(s => {
            if (s.includes('should') || s.includes('must') || s.includes('will')) {
                return `🎯 ${s.trim()}`;
            }
            return s.trim();
        });
    } else {
        summarySentences = summarySentences.join(' ');
    }

    // Apply tone modifications
    if (settings.tone === 'professional') {
        summarySentences = summarySentences.replace(/I think/g, 'Analysis indicates');
        summarySentences = summarySentences.replace(/we should/g, 'it is recommended to');
    } else if (settings.tone === 'casual') {
        summarySentences = summarySentences.replace(/consequently/g, 'so');
        summarySentences = summarySentences.replace(/therefore/g, 'so');
    }

    // Apply format modifications
    if (settings.format === 'bullet-points') {
        const points = summarySentences.split(/[.!?]/).filter(s => s.trim());
        return points.map(point => `• ${point.trim()}.`).join('\n');
    } else if (settings.format === 'numbered-list') {
        const points = summarySentences.split(/[.!?]/).filter(s => s.trim());
        return points.map((point, i) => `${i + 1}. ${point.trim()}.`).join('\n');
    } else if (settings.format === 'executive-brief') {
        return `Executive Summary\n\n${summarySentences}\n\nKey Findings:\n${generateKeyFindings(text)}`;
    }

    return summarySentences;
}

function generateKeyFindings(text) {
    const findings = [];

    // Look for patterns that indicate important findings
    if (text.includes('increase')) findings.push('• Growth indicators identified');
    if (text.includes('decrease')) findings.push('• Decline patterns detected');
    if (text.includes('recommend')) findings.push('• Actionable recommendations present');
    if (text.includes('challenge')) findings.push('• Key challenges identified');
    if (text.includes('opportunity')) findings.push('• Growth opportunities found');

    return findings.slice(0, 5).join('\n');
}

function performDocumentAnalysis(text) {
    const words = text.split(/\s+/);
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    // Extract key topics (simplified keyword extraction)
    const wordFreq = {};
    words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        if (cleanWord.length > 4) {
            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
        }
    });

    const topics = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([word, count]) => word.charAt(0).toUpperCase() + word.slice(1));

    // Sentiment analysis (simplified)
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'improve', 'achieve'];
    const negativeWords = ['bad', 'poor', 'negative', 'fail', 'problem', 'issue', 'difficult'];

    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
        const lowerWord = word.toLowerCase();
        if (positiveWords.some(pw => lowerWord.includes(pw))) positiveCount++;
        if (negativeWords.some(nw => lowerWord.includes(nw))) negativeCount++;
    });

    let sentiment = 'neutral';
    let sentimentScore = 0;
    if (positiveCount > negativeCount * 1.5) {
        sentiment = 'positive';
        sentimentScore = Math.min(85, 60 + (positiveCount - negativeCount) * 2);
    } else if (negativeCount > positiveCount * 1.5) {
        sentiment = 'negative';
        sentimentScore = Math.max(15, 40 - (negativeCount - positiveCount) * 2);
    } else {
        sentimentScore = 50;
    }

    // Readability score (simplified Flesch-Kincaid approximation)
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = 1.5; // Simplified
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)));

    let readabilityLevel = 'Very Difficult';
    if (readabilityScore > 90) readabilityLevel = 'Very Easy';
    else if (readabilityScore > 80) readabilityLevel = 'Easy';
    else if (readabilityScore > 70) readabilityLevel = 'Fairly Easy';
    else if (readabilityScore > 60) readabilityLevel = 'Standard';
    else if (readabilityScore > 50) readabilityLevel = 'Fairly Difficult';
    else if (readabilityScore > 30) readabilityLevel = 'Difficult';

    // Reading time
    const wordsPerMinute = 200;
    const readingMinutes = Math.ceil(words.length / wordsPerMinute);

    return {
        topics,
        sentiment: {
            type: sentiment,
            score: sentimentScore
        },
        readability: {
            score: Math.round(readabilityScore),
            level: readabilityLevel
        },
        readingTime: readingMinutes,
        statistics: {
            words: words.length,
            sentences: sentences.length,
            paragraphs: text.split(/\n\n+/).length
        }
    };
}

// UI Management
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function displayResults(summary, analysis, settings) {
    const resultsSection = document.getElementById('resultsSection');
    const inputSection = document.querySelector('.input-section');

    // Update document info
    document.getElementById('documentTitle').textContent = currentDocument?.title || 'Untitled Document';
    document.getElementById('documentStats').textContent =
        `${analysis.statistics.words.toLocaleString()} words • ${analysis.statistics.sentences} sentences`;

    // Update document preview
    const preview = currentDocument?.content || document.getElementById('documentText').value;
    document.getElementById('documentPreview').textContent =
        preview.length > 500 ? preview.substring(0, 500) + '...' : preview;

    // Update summary
    document.getElementById('summaryText').innerHTML = formatSummary(summary, settings.format);

    // Update metadata
    const lengthLabels = {
        'very-short': 'Very Short',
        'short': 'Short',
        'medium': 'Medium',
        'detailed': 'Detailed'
    };

    const focusLabels = {
        'general': 'General',
        'key-points': 'Key Points',
        'executive': 'Executive',
        'technical': 'Technical',
        'actionable': 'Actionable'
    };

    document.getElementById('summaryLengthLabel').textContent = lengthLabels[settings.length];
    document.getElementById('focusAreaLabel').textContent = focusLabels[settings.focus];
    document.getElementById('toneLabel').textContent = settings.tone.charAt(0).toUpperCase() + settings.tone.slice(1);

    // Calculate compression ratio
    const originalLength = (currentDocument?.content || document.getElementById('documentText').value).length;
    const summaryLength = summary.length;
    const compressionRatio = Math.round((1 - summaryLength / originalLength) * 100);
    document.getElementById('compressionRatio').textContent = `${compressionRatio}% reduction`;

    // Update analysis
    updateAnalysisSection(analysis);

    // Store current summary
    currentSummary = {
        text: summary,
        analysis: analysis,
        settings: settings,
        documentTitle: currentDocument?.title || 'Untitled Document'
    };

    // Show results, hide input
    inputSection.style.display = 'none';
    resultsSection.style.display = 'block';

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function formatSummary(summary, format) {
    if (format === 'bullet-points' || format === 'numbered-list') {
        return summary.split('\n').map(line => line.trim()).join('<br>');
    } else {
        return summary.replace(/\n/g, '<br>');
    }
}

function updateAnalysisSection(analysis) {
    // Update topics
    const topicsList = document.getElementById('topicsList');
    topicsList.innerHTML = analysis.topics.map(topic =>
        `<span class="topic-tag">${topic}</span>`
    ).join('');

    // Update sentiment
    const sentimentResult = document.getElementById('sentimentResult');
    sentimentResult.className = `sentiment-result ${analysis.sentiment.type}`;
    sentimentResult.innerHTML = `
        <div>${analysis.sentiment.type.charAt(0).toUpperCase() + analysis.sentiment.type.slice(1)}</div>
        <div style="font-size: 0.875rem; color: var(--text-secondary);">${analysis.sentiment.score}/100</div>
    `;

    // Update readability
    const readabilityScore = document.getElementById('readabilityScore');
    readabilityScore.innerHTML = `
        <div>${analysis.readability.score}/100</div>
        <div style="font-size: 0.875rem; color: var(--text-secondary);">${analysis.readability.level}</div>
    `;

    // Update reading time
    document.getElementById('readingTime').textContent = `${analysis.readingTime} min read`;
}

// Action Functions
function copySummary() {
    if (!currentSummary) return;

    const summaryText = currentSummary.text;
    navigator.clipboard.writeText(summaryText).then(() => {
        showNotification('Summary copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = summaryText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Summary copied to clipboard!');
    });
}

function downloadSummary() {
    if (!currentSummary) return;

    const content = `Document Summary\n${'='.repeat(50)}\n\n` +
        `Document: ${currentSummary.documentTitle}\n` +
        `Generated: ${new Date().toLocaleString()}\n` +
        `Settings: ${currentSummary.settings.length} | ${currentSummary.settings.focus} | ${currentSummary.settings.tone}\n\n` +
        `${'='.repeat(50)}\n\n` +
        `${currentSummary.text}\n\n` +
        `${'='.repeat(50)}\n` +
        `Analysis:\n` +
        `- Key Topics: ${currentSummary.analysis.topics.join(', ')}\n` +
        `- Sentiment: ${currentSummary.analysis.sentiment.type} (${currentSummary.analysis.sentiment.score}/100)\n` +
        `- Readability: ${currentSummary.analysis.readability.level} (${currentSummary.analysis.readability.score}/100)\n` +
        `- Reading Time: ${currentSummary.analysis.readingTime} minutes`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${currentSummary.documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Summary downloaded successfully!');
}

function newSummary() {
    currentSummary = null;
    currentDocument = null;

    // Reset form
    document.getElementById('documentText').value = '';
    document.getElementById('fileInput').value = '';
    handleTextInput();

    // Reset upload area
    const uploadArea = document.querySelector('.upload-content');
    uploadArea.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <h3>Drop Document Here</h3>
        <p>or click to browse</p>
        <p class="supported-formats">Supported: PDF, DOCX, TXT, MD</p>
    `;

    // Reset settings to defaults
    document.getElementById('summaryLength').value = 'short';
    document.getElementById('focusArea').value = 'general';
    document.getElementById('tone').value = 'professional';
    document.getElementById('format').value = 'paragraph';

    // Show input, hide results
    document.getElementById('resultsSection').style.display = 'none';
    document.querySelector('.input-section').style.display = 'block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Utility Functions
function simulateAPICall() {
    return new Promise(resolve => {
        setTimeout(resolve, 2000 + Math.random() * 1000);
    });
}

function showNotification(message) {
    // Create notification element
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

    // Remove after 3 seconds
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

    .remove-file {
        margin-top: 0.5rem;
        padding: 0.25rem 0.75rem;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: calc(var(--radius) - 4px);
        cursor: pointer;
        font-size: 0.875rem;
    }

    .remove-file:hover {
        background: #7c3aed;
    }
`;
document.head.appendChild(style);