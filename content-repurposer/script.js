// Content Repurposer JavaScript
class ContentRepurposer {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.sourceContent = document.getElementById('sourceContent');
        this.contentType = document.getElementById('contentType');
        this.tone = document.getElementById('tone');
        this.hashtagOption = document.getElementById('hashtagOption');
        this.repurposeBtn = document.getElementById('repurposeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resultSection = document.getElementById('resultSection');
        this.platformContent = document.getElementById('platformContent');

        // Platform checkboxes
        this.twitterCheck = document.getElementById('twitterCheck');
        this.linkedinCheck = document.getElementById('linkedinCheck');
        this.instagramCheck = document.getElementById('instagramCheck');
        this.facebookCheck = document.getElementById('facebookCheck');
        this.newsletterCheck = document.getElementById('newsletterCheck');
        this.tiktokCheck = document.getElementById('tiktokCheck');

        // Statistics
        this.wordCount = document.getElementById('wordCount');
        this.readTime = document.getElementById('readTime');
        this.totalPosts = document.getElementById('totalPosts');
        this.totalWords = document.getElementById('totalWords');
        this.totalHashtags = document.getElementById('totalHashtags');
        this.savesTime = document.getElementById('savesTime');

        // Action buttons
        this.copyAllBtn = document.getElementById('copyAllBtn');
        this.exportBtn = document.getElementById('exportBtn');
    }

    bindEvents() {
        this.repurposeBtn.addEventListener('click', () => this.repurposeContent());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyAllBtn.addEventListener('click', () => this.copyAllContent());
        this.exportBtn.addEventListener('click', () => this.exportAllContent());

        // Real-time updates
        this.sourceContent.addEventListener('input', () => this.updateStats());
    }

    updateStats() {
        const text = this.sourceContent.value.trim();
        const words = text.split(/\s+/).filter(word => word.length > 0).length;
        const readTime = Math.ceil(words / 200); // Average reading speed

        this.wordCount.textContent = `${words} words`;
        this.readTime.textContent = `${readTime} min read`;
    }

    async repurposeContent() {
        const source = this.sourceContent.value.trim();

        if (!source) {
            this.showError('Please enter some content to repurpose.');
            return;
        }

        // Check if at least one platform is selected
        const selectedPlatforms = this.getSelectedPlatforms();
        if (selectedPlatforms.length === 0) {
            this.showError('Please select at least one platform.');
            return;
        }

        // Show loading state
        this.repurposeBtn.querySelector('span').textContent = 'Repurposing...';
        this.repurposeBtn.disabled = true;

        // Simulate AI processing
        setTimeout(() => {
            const repurposedContent = this.generatePlatformContent(source, selectedPlatforms);
            this.displayResults(repurposedContent);
            this.repurposeBtn.querySelector('span').textContent = '✨ Repurpose Content';
            this.repurposeBtn.disabled = false;
        }, 2000);
    }

    getSelectedPlatforms() {
        const platforms = [];
        if (this.twitterCheck.checked) platforms.push('twitter');
        if (this.linkedinCheck.checked) platforms.push('linkedin');
        if (this.instagramCheck.checked) platforms.push('instagram');
        if (this.facebookCheck.checked) platforms.push('facebook');
        if (this.newsletterCheck.checked) platforms.push('newsletter');
        if (this.tiktokCheck.checked) platforms.push('tiktok');
        return platforms;
    }

    generatePlatformContent(source, platforms) {
        const contentType = this.contentType.value;
        const tone = this.tone.value;
        const hashtagStrategy = this.hashtagOption.value;

        const content = {
            twitter: this.generateTwitterContent(source, contentType, tone, hashtagStrategy),
            linkedin: this.generateLinkedInContent(source, contentType, tone, hashtagStrategy),
            instagram: this.generateInstagramContent(source, contentType, tone, hashtagStrategy),
            facebook: this.generateFacebookContent(source, contentType, tone, hashtagStrategy),
            newsletter: this.generateNewsletterContent(source, contentType, tone),
            tiktok: this.generateTikTokContent(source, contentType, tone)
        };

        // Filter for selected platforms
        const result = {};
        platforms.forEach(platform => {
            if (content[platform]) {
                result[platform] = content[platform];
            }
        });

        return result;
    }

    generateTwitterContent(source, contentType, tone, hashtagStrategy) {
        const sentences = source.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const keyPoints = sentences.slice(0, 3).map(s => s.trim());

        const hooks = {
            professional: ['🔑 Key insight:', '💡 Important finding:', '📊 Analysis shows:'],
            casual: ['Just discovered:', 'Mind blown:', 'Hot take:'],
            enthusiastic: ['🚀 BREAKING:', '✨ AMAZING:', '🎯 GAME CHANGER:'],
            informative: ['📚 Research reveals:', '📈 Data indicates:', '🔍 Study shows:'],
            promotional: ['🎉 Excited to share:', '💼 Proud to announce:', '🌟 Big news:']
        };

        const hashtags = this.generateHashtags(source, 'twitter', hashtagStrategy, 3);

        const tweets = keyPoints.slice(0, 2).map((point, index) => {
            const hook = hooks[tone][index % hooks[tone].length];
            const tweet = `${hook} ${point}`;
            return tweet.length > 280 ? tweet.substring(0, 277) + '...' : tweet;
        });

        return tweets.map((tweet, index) => ({
            type: 'tweet',
            content: tweet,
            hashtags: hashtags[index % hashtags.length],
            characterCount: tweet.length + hashtags[index % hashtags.length].length + 1
        }));
    }

    generateLinkedInContent(source, contentType, tone, hashtagStrategy) {
        const paragraphs = source.split('\n\n').filter(p => p.trim().length > 0);
        const mainPoint = paragraphs[0] || '';
        const supportingPoints = paragraphs.slice(1, 3);

        const openers = {
            professional: ['I recently analyzed', 'Based on my research', 'The data suggests'],
            casual: ['I\'ve been thinking about', 'Here\'s something interesting', 'Check this out'],
            enthusiastic: ['I\'m thrilled to share', 'Excited to announce', 'Incredibly excited about'],
            informative: ['Recent findings indicate', 'Studies have shown', 'Analysis reveals'],
            promotional: ['Proud to present', 'Excited to launch', 'Happy to share']
        };

        const hashtags = this.generateHashtags(source, 'linkedin', hashtagStrategy, 5);

        const opener = openers[tone][Math.floor(Math.random() * openers[tone].length)];
        const content = `${opener} ${mainPoint}.\n\n${supportingPoints.join('\n\n')}`;

        return {
            type: 'linkedin',
            content: content,
            hashtags: hashtags.join(' '),
            callToAction: this.generateCallToAction(contentType, tone)
        };
    }

    generateInstagramContent(source, contentType, tone, hashtagStrategy) {
        const keyThemes = this.extractKeyThemes(source);
        const hashtags = this.generateHashtags(source, 'instagram', hashtagStrategy, 15);

        const captions = {
            professional: ['Transforming insights into action 💼', 'Professional development alert 📚', 'Industry insights unlocked 🔓'],
            casual: ['Just had to share this! 🤯', 'Mind = blown 🧠✨', 'Who else relates? 🙋‍♀️'],
            enthusiastic: ['GAME CHANGER ALERT! 🚀', 'Absolutely buzzing about this! ⚡', 'Can\'t contain my excitement! 🎉'],
            informative: ['Knowledge bomb incoming 💣', 'Learn something new daily 📖', 'Did you know? 🤔'],
            promotional: ['Big things happening! 🌟', 'Exciting developments ahead! 🎯', 'Proud moment! 🏆']
        };

        return keyThemes.map((theme, index) => ({
            type: 'instagram',
            content: `${captions[tone][index % captions[tone].length]}\n\n${theme}`,
            hashtags: hashtags.join(' '),
            suggestedImage: this.suggestImageType(contentType, index)
        }));
    }

    generateFacebookContent(source, contentType, tone, hashtagStrategy) {
        const summary = this.generateSummary(source, 150);
        const hashtags = this.generateHashtags(source, 'facebook', hashtagStrategy, 5);

        const engagementHooks = {
            professional: ['What are your thoughts on this?', 'How does this align with your experience?', 'I\'d love to hear your perspective.'],
            casual: ['What do you guys think?', 'Anyone else experienced this?', 'Let me know your thoughts!'],
            enthusiastic: ['Isn\'t this amazing?!', 'Who else is excited about this?', 'Share your excitement!'],
            informative: ['Did you find this helpful?', 'What other insights would you add?', 'Let\'s discuss this further.'],
            promotional: ['What are you most excited about?', 'How might this impact you?', 'Share your feedback!']
        };

        return {
            type: 'facebook',
            content: `${summary}\n\n${engagementHooks[tone][Math.floor(Math.random() * engagementHooks[tone].length)]}`,
            hashtags: hashtags.join(' '),
            suggestedMedia: 'Image or infographic would work well here'
        };
    }

    generateNewsletterContent(source, contentType, tone) {
        const subjectLines = {
            professional: ['Weekly Insights & Analysis', 'Industry Update & Key Takeaways', 'Professional Development Notes'],
            casual: ['What I\'ve been thinking about...', 'Interesting finds this week', 'Quick thoughts to share'],
            enthusiastic: ['Exciting Updates You Won\'t Want to Miss!', 'Incredible Insights Inside!', 'Game-Changing Content Alert!'],
            informative: ['Research Summary & Analysis', 'Data-Driven Insights', 'Educational Content Digest'],
            promotional: ['Big Announcements & Updates', 'Product Launch & News', 'Exclusive Updates for Subscribers']
        };

        const sections = source.split('\n\n').filter(p => p.trim().length > 0);
        const intro = this.generateNewsletterIntro(contentType, tone);
        const mainContent = sections.map((section, index) =>
            `## ${this.generateSectionHeader(contentType, index)}\n\n${section.trim()}`
        ).join('\n\n');

        const cta = this.generateNewsletterCTA(contentType, tone);

        return {
            type: 'newsletter',
            subject: subjectLines[tone][Math.floor(Math.random() * subjectLines[tone].length)],
            content: `${intro}\n\n${mainContent}\n\n---\n\n${cta}`,
            wordCount: mainContent.split(/\s+/).length
        };
    }

    generateTikTokContent(source, contentType, tone) {
        const keyPoints = this.extractKeyThemes(source);
        const hooks = {
            professional: ['3 Professional Insights You Need:', 'Industry Game-Changers:', 'Career-Boosting Tips:'],
            casual: ['3 Things That Blew My Mind:', 'Quick Thoughts That Matter:', 'Stuff I Learned Recently:'],
            enthusiastic: ['MIND-BLOWING INSIGHTS! 🤯', 'GAME-CHANGING TIPS! 🚀', 'CAN\'T BELIEVE THIS! ⚡'],
            informative: ['Educational Content Alert:', 'Learn Something New:', 'Quick Knowledge Boost:'],
            promotional: ['Exciting News Alert!', 'Big Announcement!', 'Can\'t Wait to Share!']
        };

        return keyPoints.slice(0, 3).map((point, index) => ({
            type: 'tiktok',
            hook: hooks[tone][index % hooks[tone].length],
            content: point,
            duration: '15-30 seconds',
            suggestedVisuals: this.suggestTikTokVisuals(contentType, index),
            trendingAudio: this.suggestTikTokAudio(contentType, tone)
        }));
    }

    generateHashtags(source, platform, strategy, count) {
        const keywords = this.extractKeywords(source);

        const platformHashtags = {
            twitter: ['#Tech', '#Innovation', '#Digital', '#AI', '#FutureTech', '#Startup', '#Business'],
            linkedin: ['#ProfessionalDevelopment', '#Leadership', '#Innovation', '#Strategy', '#Business', '#Technology'],
            instagram: ['#ContentCreation', '#DigitalMarketing', '#SocialMedia', '#Branding', '#Creative', '#Marketing'],
            facebook: ['#Community', '#Sharing', '#Learning', '#Growth', '#Connection', '#Engagement']
        };

        const allHashtags = [...keywords, ...platformHashtags[platform] || []];
        const selectedHashtags = allHashtags.slice(0, count);

        if (strategy === 'trending') {
            return selectedHashtags.map(tag => `#${tag}`).slice(0, count);
        } else if (strategy === 'minimal') {
            return selectedHashtags.slice(0, 2).map(tag => `#${tag}`);
        } else if (strategy === 'none') {
            return [];
        }

        return selectedHashtags.map(tag => `#${tag}`);
    }

    extractKeywords(source) {
        const words = source.toLowerCase().split(/\s+/);
        const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how']);

        const keywords = words
            .filter(word => word.length > 3 && !commonWords.has(word))
            .filter(word => /^[a-zA-Z]+$/.test(word))
            .slice(0, 10);

        return keywords.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    }

    extractKeyThemes(source) {
        const sentences = source.split(/[.!?]+/).filter(s => s.trim().length > 20);
        return sentences.slice(0, 3).map(s => s.trim());
    }

    generateSummary(source, maxLength) {
        const sentences = source.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let summary = '';

        for (const sentence of sentences) {
            if ((summary + sentence + '.').length <= maxLength) {
                summary += sentence.trim() + '. ';
            } else {
                break;
            }
        }

        return summary || source.substring(0, maxLength - 3) + '...';
    }

    generateCallToAction(contentType, tone) {
        const ctas = {
            professional: ['What are your thoughts on this? Share in the comments.', 'Follow for more industry insights.', 'Connect with me for similar discussions.'],
            casual: ['What do you think? Let me know below!', 'Drop a comment with your thoughts!', 'Share your experience in the comments.'],
            enthusiastic: ['Who else is excited about this?! 🚀', 'Let\'s discuss this amazing topic!', 'Share your excitement in the comments!'],
            informative: ['What additional insights would you add?', 'How has this impacted your work?', 'Share your knowledge with the community.'],
            promotional: ['Learn more by clicking the link below.', 'DM me for more information.', 'Visit our website for details.']
        };

        return ctas[tone][Math.floor(Math.random() * ctas[tone].length)];
    }

    generateNewsletterIntro(contentType, tone) {
        const intros = {
            professional: 'Welcome to this week\'s professional insights newsletter.',
            casual: 'Hey everyone! Here\'s what I\'ve been thinking about lately.',
            enthusiastic: 'Exciting to share some amazing insights with you all!',
            informative: 'This week\'s newsletter covers important industry developments.',
            promotional: 'Big announcements and exciting updates in this edition!'
        };

        return intros[tone] || intros.professional;
    }

    generateSectionHeader(contentType, index) {
        const headers = ['Key Insights', 'Analysis & Discussion', 'Practical Applications', 'Future Implications'];
        return headers[index % headers.length];
    }

    generateNewsletterCTA(contentType, tone) {
        const ctas = {
            professional: 'Thank you for reading. Stay tuned for next week\'s insights.',
            casual: 'Hope you found this interesting! Catch you next time.',
            enthusiastic: 'Excited for what\'s coming next week. Stay tuned!',
            informative: 'Continue learning with our upcoming content and resources.',
            promotional: 'Don\'t miss our upcoming announcements and product launches.'
        };

        return ctas[tone] || ctas.professional;
    }

    suggestImageType(contentType, index) {
        const images = ['Professional headshot', 'Infographic', 'Quote graphic', 'Behind-the-scenes photo', 'Product image'];
        return images[index % images.length];
    }

    suggestTikTokVisuals(contentType, index) {
        const visuals = ['Pointing to text overlays', 'Split screen content', 'Before/after comparison', 'Step-by-step demonstration'];
        return visuals[index % visuals.length];
    }

    suggestTikTokAudio(contentType, tone) {
        const audios = {
            professional: 'Professional motivational audio',
            casual: 'Trending casual audio',
            enthusiastic: 'High-energy trending song',
            informative: 'Educational background music',
            promotional: 'Upbeat promotional audio'
        };

        return audios[tone] || audios.professional;
    }

    displayResults(content) {
        this.platformContent.innerHTML = '';

        Object.entries(content).forEach(([platform, data]) => {
            const section = this.createPlatformSection(platform, data);
            this.platformContent.appendChild(section);
        });

        this.updateStatistics(content);
        this.resultSection.classList.remove('hidden');
        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    createPlatformSection(platform, data) {
        const section = document.createElement('div');
        section.className = 'platform-section bg-gray-700 bg-opacity-50 rounded-lg p-4 border-l-4';

        const platformConfig = {
            twitter: { icon: '🐦', name: 'Twitter / X', color: 'border-blue-500' },
            linkedin: { icon: '💼', name: 'LinkedIn', color: 'border-blue-600' },
            instagram: { icon: '📷', name: 'Instagram', color: 'border-pink-500' },
            facebook: { icon: '📘', name: 'Facebook', color: 'border-blue-700' },
            newsletter: { icon: '📧', name: 'Newsletter', color: 'border-green-500' },
            tiktok: { icon: '🎵', name: 'TikTok', color: 'border-black' }
        };

        const config = platformConfig[platform];
        section.classList.add(config.color);

        if (platform === 'twitter' && Array.isArray(data)) {
            section.innerHTML = `
                <h4 class="font-medium text-blue-300 mb-3 flex items-center gap-2">
                    <span class="text-xl">${config.icon}</span> ${config.name} Posts
                </h4>
                <div class="space-y-3">
                    ${data.map((tweet, index) => `
                        <div class="tweet-card bg-gray-800 bg-opacity-50 rounded-lg p-3">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded">Tweet ${index + 1}</span>
                                <span class="text-xs text-gray-400">${tweet.characterCount} chars</span>
                            </div>
                            <p class="text-gray-200 mb-2">${tweet.content}</p>
                            <p class="text-blue-400 text-sm">${tweet.hashtags}</p>
                            <button class="copy-tweet text-xs bg-gray-600 bg-opacity-50 text-gray-300 px-2 py-1 rounded mt-2 hover:bg-opacity-70" data-content="${tweet.content} ${tweet.hashtags}">
                                Copy Tweet
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (platform === 'instagram' && Array.isArray(data)) {
            section.innerHTML = `
                <h4 class="font-medium text-pink-300 mb-3 flex items-center gap-2">
                    <span class="text-xl">${config.icon}</span> ${config.name} Posts
                </h4>
                <div class="space-y-3">
                    ${data.map((post, index) => `
                        <div class="instagram-card bg-gray-800 bg-opacity-50 rounded-lg p-3">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-xs bg-pink-500 bg-opacity-20 text-pink-300 px-2 py-1 rounded">Post ${index + 1}</span>
                                <span class="text-xs text-gray-400">📷 ${post.suggestedImage}</span>
                            </div>
                            <p class="text-gray-200 mb-2">${post.content}</p>
                            <p class="text-pink-400 text-sm">${post.hashtags}</p>
                            <button class="copy-instagram text-xs bg-gray-600 bg-opacity-50 text-gray-300 px-2 py-1 rounded mt-2 hover:bg-opacity-70" data-content="${post.content} ${post.hashtags}">
                                Copy Caption
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (platform === 'tiktok' && Array.isArray(data)) {
            section.innerHTML = `
                <h4 class="font-medium text-black mb-3 flex items-center gap-2">
                    <span class="text-xl">${config.icon}</span> ${config.name} Videos
                </h4>
                <div class="space-y-3">
                    ${data.map((video, index) => `
                        <div class="tiktok-card bg-gray-800 bg-opacity-50 rounded-lg p-3">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-xs bg-black bg-opacity-20 text-gray-300 px-2 py-1 rounded">Video ${index + 1}</span>
                                <span class="text-xs text-gray-400">⏱️ ${video.duration}</span>
                            </div>
                            <p class="text-gray-200 font-medium mb-1">${video.hook}</p>
                            <p class="text-gray-300 text-sm mb-2">${video.content}</p>
                            <p class="text-xs text-gray-400">🎵 ${video.trendingAudio}</p>
                            <p class="text-xs text-gray-400">📸 ${video.suggestedVisuals}</p>
                            <button class="copy-tiktok text-xs bg-gray-600 bg-opacity-50 text-gray-300 px-2 py-1 rounded mt-2 hover:bg-opacity-70" data-content="${video.hook} ${video.content}">
                                Copy Script
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (platform === 'newsletter') {
            section.innerHTML = `
                <h4 class="font-medium text-green-300 mb-3 flex items-center gap-2">
                    <span class="text-xl">${config.icon}</span> ${config.name}
                </h4>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                    <div class="mb-3">
                        <span class="text-xs bg-green-500 bg-opacity-20 text-green-300 px-2 py-1 rounded">Subject Line</span>
                        <p class="text-green-200 font-medium mt-1">${data.subject}</p>
                    </div>
                    <div class="mb-3">
                        <span class="text-xs bg-gray-600 bg-opacity-50 text-gray-300 px-2 py-1 rounded">Content Preview</span>
                        <p class="text-gray-200 text-sm mt-1 max-h-32 overflow-y-auto">${data.content.substring(0, 200)}...</p>
                        <p class="text-xs text-gray-400 mt-1">${data.wordCount} words</p>
                    </div>
                    <button class="copy-newsletter text-xs bg-gray-600 bg-opacity-50 text-gray-300 px-2 py-1 rounded hover:bg-opacity-70" data-subject="${data.subject}" data-content="${data.content}">
                        Copy Full Newsletter
                    </button>
                </div>
            `;
        } else {
            section.innerHTML = `
                <h4 class="font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <span class="text-xl">${config.icon}</span> ${config.name} Post
                </h4>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                    <p class="text-gray-200 mb-2">${data.content}</p>
                    ${data.hashtags ? `<p class="text-gray-400 text-sm mb-2">${data.hashtags}</p>` : ''}
                    ${data.callToAction ? `<p class="text-gray-300 text-sm italic mb-2">${data.callToAction}</p>` : ''}
                    <button class="copy-platform text-xs bg-gray-600 bg-opacity-50 text-gray-300 px-2 py-1 rounded hover:bg-opacity-70" data-content="${data.content}${data.hashtags ? ' ' + data.hashtags : ''}${data.callToAction ? '\n\n' + data.callToAction : ''}">
                        Copy Post
                    </button>
                </div>
            `;
        }

        // Add copy functionality
        section.querySelectorAll('button[data-content]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const content = e.target.getAttribute('data-content');
                this.copyToClipboard(content);
            });
        });

        if (section.querySelector('.copy-newsletter')) {
            section.querySelector('.copy-newsletter').addEventListener('click', (e) => {
                const subject = e.target.getAttribute('data-subject');
                const content = e.target.getAttribute('data-content');
                const fullContent = `Subject: ${subject}\n\n${content}`;
                this.copyToClipboard(fullContent);
            });
        }

        return section;
    }

    updateStatistics(content) {
        let totalPosts = 0;
        let totalWords = 0;
        let totalHashtags = 0;

        Object.entries(content).forEach(([platform, data]) => {
            if (platform === 'twitter' && Array.isArray(data)) {
                totalPosts += data.length;
                totalWords += data.reduce((sum, tweet) => sum + tweet.content.split(/\s+/).length, 0);
                totalHashtags += data.reduce((sum, tweet) => sum + tweet.hashtags.split(/\s+/).filter(h => h).length, 0);
            } else if (platform === 'instagram' && Array.isArray(data)) {
                totalPosts += data.length;
                totalWords += data.reduce((sum, post) => sum + post.content.split(/\s+/).length, 0);
                totalHashtags += data.reduce((sum, post) => sum + post.hashtags.split(/\s+/).filter(h => h).length, 0);
            } else if (platform === 'tiktok' && Array.isArray(data)) {
                totalPosts += data.length;
                totalWords += data.reduce((sum, video) => sum + (video.hook + ' ' + video.content).split(/\s+/).length, 0);
            } else if (platform === 'newsletter') {
                totalPosts += 1;
                totalWords += data.wordCount;
            } else {
                totalPosts += 1;
                totalWords += data.content.split(/\s+/).length;
                if (data.hashtags) {
                    totalHashtags += data.hashtags.split(/\s+/).filter(h => h).length;
                }
            }
        });

        this.animateNumber(this.totalPosts, totalPosts);
        this.animateNumber(this.totalWords, totalWords);
        this.animateNumber(this.totalHashtags, totalHashtags);

        // Estimate time saved (2 hours of work saved)
        const timeSaved = Math.min(5, Math.max(1, totalPosts)) + 'h';
        this.savesTime.textContent = timeSaved;
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
        this.sourceContent.value = '';
        this.resultSection.classList.add('hidden');
        this.updateStats();
        this.sourceContent.focus();
    }

    async copyAllContent() {
        const platforms = this.platformContent.querySelectorAll('.platform-section');
        let allContent = 'CONTENT REPURPOSING REPORT\n==========================\n\n';

        platforms.forEach(section => {
            const platformName = section.querySelector('h4').textContent.trim();
            allContent += `${platformName}\n${'='.repeat(platformName.length)}\n\n`;

            const textContents = section.querySelectorAll('p.text-gray-200, p.text-gray-300');
            textContents.forEach(p => {
                if (p.textContent.trim() && !p.textContent.includes('Copy')) {
                    allContent += p.textContent.trim() + '\n\n';
                }
            });
        });

        allContent += `\nGenerated on: ${new Date().toLocaleString()}\nTool: Content Repurposer by Philemon Ofotan`;

        try {
            await navigator.clipboard.writeText(allContent);
            this.showSuccess('All content copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy content. Please select and copy manually.');
        }
    }

    exportAllContent() {
        const platforms = this.platformContent.querySelectorAll('.platform-section');
        let allContent = 'CONTENT REPURPOSING REPORT\n==========================\n\n';
        allContent += `Original Content:\n${'='.repeat(50)}\n${this.sourceContent.value}\n\n${'='.repeat(50)}\n\n`;

        platforms.forEach(section => {
            const platformName = section.querySelector('h4').textContent.trim();
            allContent += `${platformName}\n${'='.repeat(platformName.length)}\n\n`;

            const textContents = section.querySelectorAll('p.text-gray-200, p.text-gray-300');
            textContents.forEach(p => {
                if (p.textContent.trim() && !p.textContent.includes('Copy')) {
                    allContent += p.textContent.trim() + '\n\n';
                }
            });
        });

        allContent += `\nGenerated on: ${new Date().toLocaleString()}\nTool: Content Repurposer by Philemon Ofotan`;

        // Create and download file
        const blob = new Blob([allContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `content-repurposing-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Content repurposing report exported successfully!');
    }

    async copyToClipboard(content) {
        try {
            await navigator.clipboard.writeText(content);
            this.showSuccess('Content copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy content. Please select and copy manually.');
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

// Initialize the content repurposer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContentRepurposer();
});