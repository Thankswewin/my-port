console.log('=== PORTFOLIO DEMOS STARTING ===');

// Wait for DOM to be fully loaded - this approach works!
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - connecting all demos...');

  try {
    connectEmailAssistant();
    connectSMEAssistant();
    connectInterviewAssistant();
    connectMeetingAssistant();
    initializePageFeatures();
    console.log('All demos connected successfully!');
  } catch (error) {
    console.error('Error connecting demos:', error);
  }
});

function connectEmailAssistant() {
  console.log('Connecting Email Assistant...');
  const emailBtn = document.getElementById('emailGenerateBtn');
  const emailInput = document.getElementById('emailInput');
  const emailTone = document.getElementById('emailTone');
  const emailOutput = document.getElementById('emailOutput');

  console.log('Email elements found:', {
    btn: !!emailBtn,
    input: !!emailInput,
    tone: !!emailTone,
    output: !!emailOutput
  });

  if (emailBtn && emailInput && emailTone && emailOutput) {
    emailBtn.addEventListener('click', function() {
      console.log('Email button clicked!');
      const notes = (emailInput.value || '').trim();
      const tone = emailTone.value;

      if (!notes) {
        emailOutput.textContent = 'Please add a few notes so I can generate an email.';
        return;
      }

      let greeting = 'Dear Hiring Manager,';
      let closing = 'Kind regards,\nPhilemon Ofotan';

      if (tone === 'friendly') {
        greeting = 'Hello,';
        closing = 'Best regards,\nPhilemon';
      } else if (tone === 'direct') {
        greeting = 'Hi,';
        closing = 'Sincerely,\nPhilemon Ofotan';
      }

      const body = [
        `${greeting}`,
        '',
        `Thank you for taking the time to speak with me. ${notes[0].toUpperCase() + notes.slice(1)}`,
        '',
        'If you need any additional information from me, I will be happy to provide it.',
        '',
        closing
      ].join('\n');

      emailOutput.textContent = body;
      console.log('Email generated successfully');
    });
    console.log('Email Assistant connected');
  } else {
    console.error('Email Assistant - missing elements');
  }
}

function connectSMEAssistant() {
  console.log('Connecting SME Assistant...');
  const smeBtn = document.getElementById('smeGenerateBtn');
  const smeType = document.getElementById('smeType');
  const smePlatform = document.getElementById('smePlatform');
  const smeOffer = document.getElementById('smeOffer');
  const smeOutput = document.getElementById('smeOutput');

  console.log('SME elements found:', {
    btn: !!smeBtn,
    type: !!smeType,
    platform: !!smePlatform,
    offer: !!smeOffer,
    output: !!smeOutput
  });

  if (smeBtn && smeType && smePlatform && smeOffer && smeOutput) {
    smeBtn.addEventListener('click', function() {
      console.log('SME button clicked!');
      const type = smeType.value;
      const platform = smePlatform.value;
      const offer = (smeOffer.value || 'a special offer').trim();

      const captions = [
        `1️⃣ ${offer} just dropped!\n${type} serving you better every day. Send a DM to grab yours now. #${platform.replace(/\s|\/|-/g,'')} #NaijaBusiness`,
        `2️⃣ Lagos, are you ready? ${offer} for our amazing customers.\nTap the link in bio or send "${type.split(' ')[0]}" to chat and order.`,
        `3️⃣ Don't sleep on this! ${offer} available for a limited time only.\nTell a friend, save this post, and let's grow together. #SupportSmallBusiness`
      ];

      smeOutput.innerHTML = captions.map(c => `<p>${c.replace(/\n/g, '<br>')}</p>`).join('');
      console.log('SME captions generated successfully');
    });
    console.log('SME Assistant connected');
  } else {
    console.error('SME Assistant - missing elements');
  }
}

function connectInterviewAssistant() {
  console.log('Connecting Interview Assistant...');
  const interviewBtn = document.getElementById('interviewGenerateBtn');
  const interviewRole = document.getElementById('interviewRole');
  const interviewFocus = document.getElementById('interviewFocus');
  const interviewOutput = document.getElementById('interviewOutput');

  console.log('Interview elements found:', {
    btn: !!interviewBtn,
    role: !!interviewRole,
    focus: !!interviewFocus,
    output: !!interviewOutput
  });

  if (interviewBtn && interviewRole && interviewFocus && interviewOutput) {
    interviewBtn.addEventListener('click', function() {
      console.log('Interview button clicked!');
      const role = (interviewRole.value || 'this role').trim();
      const focus = interviewFocus.value;

      const baseQuestions = {
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

      const questions = baseQuestions[focus] || baseQuestions.technical;

      interviewOutput.innerHTML = questions
        .map((q, i) => `<p>${i + 1}. ${q}</p>`)
        .join('');
      console.log('Interview questions generated successfully');
    });
    console.log('Interview Assistant connected');
  } else {
    console.error('Interview Assistant - missing elements');
  }
}

function connectMeetingAssistant() {
  console.log('Connecting Meeting Assistant...');
  const meetingBtn = document.getElementById('meetingGenerateBtn');
  const meetingInput = document.getElementById('meetingInput');
  const meetingDecisions = document.getElementById('meetingDecisions');
  const meetingActions = document.getElementById('meetingActions');
  const meetingHighlights = document.getElementById('meetingHighlights');

  console.log('Meeting elements found:', {
    btn: !!meetingBtn,
    input: !!meetingInput,
    decisions: !!meetingDecisions,
    actions: !!meetingActions,
    highlights: !!meetingHighlights
  });

  if (meetingBtn && meetingInput && meetingDecisions && meetingActions && meetingHighlights) {
    meetingBtn.addEventListener('click', function() {
      console.log('Meeting button clicked!');
      const raw = (meetingInput.value || '').trim();

      if (!raw) {
        meetingDecisions.textContent = 'Add some notes to see a summary.';
        meetingActions.textContent = '';
        meetingHighlights.textContent = '';
        return;
      }

      const lines = raw.split(/[\n]/).map(l => l.trim()).filter(Boolean);

      const decisions = [];
      const actions = [];
      const highlights = [];

      lines.forEach(line => {
        if (/decision:|agreed:|approved:|decided to|we will|confirmed|finalized/i.test(line)) {
          const cleanDecision = line.replace(/decision:|agreed:|approved:|decided to/i, '').trim();
          if (cleanDecision) decisions.push(cleanDecision);
        }
        else if (/delay.*to phase|approve.*budget|increase.*budget/i.test(line)) {
          decisions.push(line);
        }
        else if (/:.*fix.*by|:.*schedule.*|:.*prepare.*|:.*review.*|:.*update.*|:.*send.*/i.test(line)) {
          const match = line.match(/([^:]+):\s*(.+)/i);
          if (match) {
            const owner = match[1].trim();
            const action = match[2].trim();
            actions.push(`${owner}: ${action}`);
          } else {
            actions.push(`Unassigned: ${line}`);
          }
        }
        else if (/fix by|schedule for|prepare|review|update|send|next step/i.test(line)) {
          actions.push(`Unassigned: ${line}`);
        }
        else if (/\d+|target|launch|bug|budget|risk|downtime|%|ready/i.test(line)) {
          highlights.push(line);
        }
      });

      const finalDecisions = decisions.length > 0 ? decisions : ['No clear items detected.'];

      const renderList = (container, items) => {
        container.innerHTML = items.map(i => `<p>• ${i}</p>`).join('');
      };

      renderList(meetingDecisions, finalDecisions);
      renderList(meetingActions, actions);
      renderList(meetingHighlights, highlights);
      console.log('Meeting notes processed successfully');
    });
    console.log('Meeting Assistant connected');
  } else {
    console.error('Meeting Assistant - missing elements');
  }
}

function initializePageFeatures() {
  console.log('Initializing page features...');

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
    console.log('Mobile menu initialized');
  }

  // Year
  const yearSpan = document.getElementById('yearSpan');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Hero headline animation
  const headline = document.getElementById('heroHeadline');
  if (headline) {
    const text = headline.textContent;
    headline.textContent = '';
    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.classList.add('letter-animated');
      headline.appendChild(span);
      setTimeout(() => span.classList.add('animate'), 200 + index * 25);
    });
  }

  // Back to top
  const goToTop = document.getElementById('goToTop');
  if (goToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        goToTop.classList.remove('opacity-0');
        goToTop.classList.add('opacity-100');
      } else {
        goToTop.classList.add('opacity-0');
        goToTop.classList.remove('opacity-100');
      }
    });
    goToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  console.log('Page features initialized');
}

console.log('=== PORTFOLIO DEMOS SETUP COMPLETE ===');