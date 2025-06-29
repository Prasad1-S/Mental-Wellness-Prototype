$(document).ready(function() {
    // Application state
    let currentInteractionType = '';
    let conversationStep = 0;
    let userRating = 0;
    let journalEntry = '';

    // Initialize the application
    initApp();

    // Sentiment analysis keywords
    const sentimentKeywords = {
        positive: ['happy', 'good', 'great', 'awesome', 'wonderful', 'amazing', 'fantastic', 'excellent', 'perfect', 'love', 'joy', 'excited', 'grateful', 'blessed', 'peaceful', 'calm', 'content', 'satisfied', 'accomplished', 'proud'],
        negative: ['sad', 'bad', 'terrible', 'awful', 'horrible', 'depressed', 'anxious', 'worried', 'stressed', 'angry', 'frustrated', 'disappointed', 'lonely', 'tired', 'exhausted', 'overwhelmed', 'upset', 'hurt', 'pain', 'difficult'],
        neutral: ['okay', 'fine', 'normal', 'usual', 'regular', 'average', 'nothing', 'same', 'typical', 'ordinary']
    };

    // Chatbot responses
    const responses = {
        journal: {
            initial: "I'm here to listen. How was your day today? Feel free to share whatever is on your mind.",
            followUp: {
                positive: [
                    "That sounds wonderful! I'm so glad you had a good day. What made it particularly special?",
                    "It's beautiful to hear the joy in your words. What are you most grateful for today?",
                    "Your positive energy is contagious! What would you like to carry forward from today?"
                ],
                negative: [
                    "I hear you, and I want you to know that it's okay to have difficult days. You're not alone in this.",
                    "Thank you for sharing that with me. It takes courage to express difficult feelings. How can we make tomorrow a little brighter?",
                    "I'm sorry you're going through this. Remember that difficult days don't last, but resilient people like you do."
                ],
                neutral: [
                    "Sometimes ordinary days are just what we need. Is there anything you'd like to explore about today?",
                    "Even quiet days have their own value. What small moment stood out to you today?",
                    "Every day is a gift, even the simple ones. What are you hoping for tomorrow?"
                ]
            },
            rating: {
                1: "I'm sorry to hear you had such a challenging day. Please know that you're stronger than you realize, and tomorrow is a new opportunity.",
                2: "Difficult days are part of life's journey. What's one small thing that could make tomorrow feel a little lighter?",
                3: "Some days are just okay, and that's perfectly normal. Is there something specific you'd like to talk about?",
                4: "It sounds like you had a pretty good day overall! What contributed to that positive feeling?",
                5: "What a wonderful day you've had! I love hearing about the good moments. What made it so special?"
            }
        },
        motivation: {
            quotes: [
                "You are braver than you believe, stronger than you seem, and smarter than you think. - A.A. Milne",
                "The only way to do great work is to love what you do. - Steve Jobs",
                "Your limitation—it's only your imagination.",
                "Push yourself, because no one else is going to do it for you.",
                "Great things never come from comfort zones.",
                "Don't stop when you're tired. Stop when you're done.",
                "Success doesn't just find you. You have to go out and get it.",
                "The harder you work for something, the greater you'll feel when you achieve it.",
                "Don't wait for opportunity. Create it.",
                "Sometimes we're tested not to show our weaknesses, but to discover our strengths."
            ],
            encouragement: [
                "Remember, every expert was once a beginner. You're on your own unique journey, and that's exactly where you need to be.",
                "Your mental health journey is not a destination, it's a continuous path of growth and self-discovery.",
                "You've overcome challenges before, and you have the strength to overcome whatever you're facing now.",
                "Taking care of your mental health is not selfish—it's essential. You deserve peace and happiness.",
                "Progress isn't always linear. Some days will be harder than others, and that's completely okay."
            ]
        }
    };

    // Task content
    const taskContent = {
        breathing: {
            title: "Breathing Exercise",
            content: `
                <div class="breathing-instructions">
                    <p>Follow the circle with your breath:</p>
                    <p><strong>Inhale</strong> as it expands, <strong>exhale</strong> as it contracts</p>
                </div>
                <div class="breathing-circle">
                    Breathe
                </div>
                <div class="text-center">
                    <p>Focus on your breath for the next few minutes. Let your thoughts come and go naturally.</p>
                    <button class="affirmation-btn" onclick="completeTask('breathing')">Complete Exercise</button>
                </div>
            `
        },
        gratitude: {
            title: "Gratitude Practice",
            content: `
                <div class="text-center mb-1">
                    <p>List three things you're grateful for today:</p>
                </div>
                <input type="text" class="gratitude-input" placeholder="1. I'm grateful for..." maxlength="100">
                <input type="text" class="gratitude-input" placeholder="2. I'm grateful for..." maxlength="100">
                <input type="text" class="gratitude-input" placeholder="3. I'm grateful for..." maxlength="100">
                <button class="gratitude-submit" onclick="submitGratitude()">Save Gratitude List</button>
            `
        },
        mindfulness: {
            title: "Mindful Moment",
            content: `
                <div class="text-center">
                    <p>Take a moment to ground yourself in the present:</p>
                    <br>
                    <p><strong>5 things you can see</strong></p>
                    <p><strong>4 things you can touch</strong></p>
                    <p><strong>3 things you can hear</strong></p>
                    <p><strong>2 things you can smell</strong></p>
                    <p><strong>1 thing you can taste</strong></p>
                    <br>
                    <p>Take your time with each sense. Notice the details.</p>
                    <br>
                    <button class="affirmation-btn" onclick="completeTask('mindfulness')">Complete Practice</button>
                </div>
            `
        },
        affirmation: {
            title: "Positive Affirmations",
            content: `
                <div class="affirmation-text" id="current-affirmation">
                    I am worthy of love and respect, including from myself.
                </div>
                <div class="text-center">
                    <p>Read this affirmation aloud or silently. Let it resonate with you.</p>
                    <br>
                    <button class="affirmation-btn" onclick="getNewAffirmation()">New Affirmation</button>
                    <button class="affirmation-btn" onclick="completeTask('affirmation')" style="margin-top: 0.5rem;">Complete Practice</button>
                </div>
            `
        }
    };

    // Positive affirmations array
    const affirmations = [
        "I am worthy of love and respect, including from myself.",
        "I have the power to create positive change in my life.",
        "My feelings are valid, and I honor them.",
        "I am resilient and can handle whatever comes my way.",
        "I choose to focus on what I can control.",
        "I am growing and learning every day.",
        "I deserve happiness and peace.",
        "My mental health is a priority, and I take care of it.",
        "I am enough, exactly as I am.",
        "I have overcome challenges before, and I can do it again.",
        "I choose self-compassion over self-criticism.",
        "Every day is a new opportunity to grow.",
        "I trust in my ability to navigate life's challenges.",
        "I am surrounded by love and support.",
        "I celebrate my progress, no matter how small."
    ];

    // Initialize application
    function initApp() {
        loadStoredData();
        bindEventHandlers();
        showWelcomeScreen();
    }

    // Event handlers
    function bindEventHandlers() {
        // Interaction type selection
        $('.option-btn').on('click', function() {
            const type = $(this).data('type');
            handleInteractionTypeSelection(type);
        });

        // Back buttons
        $('#back-btn, #task-back-btn, #journal-back-btn').on('click', function() {
            showWelcomeScreen();
        });

        // Send message
        $('#send-btn').on('click', sendMessage);
        $('#user-input').on('keypress', function(e) {
            if (e.which === 13) {
                sendMessage();
            }
        });

        // Rating system
        $('.star-btn').on('click', function() {
            const rating = parseInt($(this).data('rating'));
            selectRating(rating);
        });

        // Task cards
        $('.task-card').on('click', function() {
            const taskType = $(this).data('task');
            openTaskModal(taskType);
        });

        // Modal close
        $('#close-modal').on('click', closeModal);
        $('#close-journal-editor').on('click', closeJournalEditor);
        $(document).on('click', function(e) {
            if ($(e.target).is('#task-modal')) {
                closeModal();
            }
            if ($(e.target).is('#journal-editor-modal')) {
                closeJournalEditor();
            }
        });

        // Journal functionality
        $('#new-entry-btn').on('click', openJournalEditor);
        $('#save-entry-btn').on('click', saveJournalEntry);
        $('#cancel-entry-btn').on('click', closeJournalEditor);

        // Mood selection
        $(document).on('click', '.mood-btn', function() {
            $('.mood-btn').removeClass('selected');
            $(this).addClass('selected');
        });
    }

    // Screen management
    function showScreen(screenId) {
        $('.screen').removeClass('active');
        $(`#${screenId}`).addClass('active');
    }

    function showWelcomeScreen() {
        showScreen('welcome-screen');
        resetConversation();
    }

    function showChatScreen() {
        showScreen('chat-screen');
        $('#chat-messages').empty();
        $('#user-input').focus();
    }

    function showTaskScreen() {
        showScreen('task-screen');
    }

    function showUserJournalScreen() {
        showScreen('user-journal-screen');
        loadJournalEntries();
    }

    // Interaction type handling
    function handleInteractionTypeSelection(type) {
        currentInteractionType = type;
        conversationStep = 0;

        if (type === 'tasks') {
            showTaskScreen();
        } else if (type === 'user-journal') {
            showUserJournalScreen();
        } else {
            showChatScreen();
            startConversation(type);
        }
    }

    // Conversation management
    function startConversation(type) {
        setTimeout(() => {
            if (type === 'journal') {
                addBotMessage(responses.journal.initial);
                setTimeout(() => {
                    showRatingContainer();
                }, 1000);
            } else if (type === 'motivation') {
                const randomQuote = responses.motivation.quotes[Math.floor(Math.random() * responses.motivation.quotes.length)];
                const randomEncouragement = responses.motivation.encouragement[Math.floor(Math.random() * responses.motivation.encouragement.length)];
                
                addBotMessage(randomQuote);
                setTimeout(() => {
                    addBotMessage(randomEncouragement);
                }, 2000);
                setTimeout(() => {
                    addBotMessage("How are you feeling right now? I'm here to support you.");
                }, 4000);
            }
        }, 500);
    }

    function resetConversation() {
        currentInteractionType = '';
        conversationStep = 0;
        userRating = 0;
        journalEntry = '';
        hideRatingContainer();
        $('#user-input').val('');
    }

    // Message handling
    function sendMessage() {
        const message = $('#user-input').val().trim();
        if (!message) return;

        addUserMessage(message);
        $('#user-input').val('');

        if (currentInteractionType === 'journal' && conversationStep === 0) {
            journalEntry = message;
            conversationStep++;
            
            // Analyze sentiment and respond
            const sentiment = analyzeSentiment(message);
            const responses_array = responses.journal.followUp[sentiment];
            const randomResponse = responses_array[Math.floor(Math.random() * responses_array.length)];
            
            setTimeout(() => {
                addBotMessage(randomResponse);
                if (userRating > 0) {
                    setTimeout(() => {
                        const ratingResponse = responses.journal.rating[userRating];
                        addBotMessage(ratingResponse);
                        saveJournalEntry(message, sentiment, userRating);
                    }, 2000);
                }
            }, 1500);
        } else {
            // General conversation response
            setTimeout(() => {
                const sentiment = analyzeSentiment(message);
                let response = "Thank you for sharing that with me. ";
                
                if (sentiment === 'positive') {
                    response += "I can sense the positivity in your words. Keep holding onto that feeling.";
                } else if (sentiment === 'negative') {
                    response += "I hear that you're going through something difficult. Remember, you're not alone.";
                } else {
                    response += "I appreciate you opening up. Every feeling you have is valid.";
                }
                
                addBotMessage(response);
            }, 1500);
        }
    }

    function addUserMessage(message) {
        const messageHtml = `<div class="message user">${escapeHtml(message)}</div>`;
        $('#chat-messages').append(messageHtml);
        scrollToBottom();
    }

    function addBotMessage(message) {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const messageHtml = `<div class="message bot">${message}</div>`;
            $('#chat-messages').append(messageHtml);
            scrollToBottom();
        }, 1000 + Math.random() * 1000); // Random delay for more natural feel
    }

    function showTypingIndicator() {
        const typingHtml = '<div id="typing-indicator" class="typing-indicator"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
        $('#chat-messages').append(typingHtml);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        $('#typing-indicator').remove();
    }

    function scrollToBottom() {
        const chatContainer = $('.chat-container');
        chatContainer.scrollTop(chatContainer[0].scrollHeight);
    }

    // Rating system
    function showRatingContainer() {
        $('#rating-container').removeClass('hidden');
    }

    function hideRatingContainer() {
        $('#rating-container').addClass('hidden');
        $('.star-btn').removeClass('active');
    }

    function selectRating(rating) {
        userRating = rating;
        
        // Update star display
        $('.star-btn').each(function(index) {
            if (index < rating) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });

        // If journal entry exists, provide rating-based response
        if (journalEntry && conversationStep > 0) {
            setTimeout(() => {
                const ratingResponse = responses.journal.rating[rating];
                addBotMessage(ratingResponse);
                saveJournalEntry(journalEntry, analyzeSentiment(journalEntry), rating);
                hideRatingContainer();
            }, 1000);
        }
    }

    // Sentiment analysis
    function analyzeSentiment(text) {
        const lowercaseText = text.toLowerCase();
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;

        // Count keyword matches
        sentimentKeywords.positive.forEach(word => {
            if (lowercaseText.includes(word)) positiveCount++;
        });

        sentimentKeywords.negative.forEach(word => {
            if (lowercaseText.includes(word)) negativeCount++;
        });

        sentimentKeywords.neutral.forEach(word => {
            if (lowercaseText.includes(word)) neutralCount++;
        });

        // Determine overall sentiment
        if (positiveCount > negativeCount && positiveCount > neutralCount) {
            return 'positive';
        } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
            return 'negative';
        } else {
            return 'neutral';
        }
    }

    // Task management
    function openTaskModal(taskType) {
        const task = taskContent[taskType];
        $('#modal-title').text(task.title);
        $('#modal-body').html(task.content);
        $('#task-modal').addClass('active');
    }

    function closeModal() {
        $('#task-modal').removeClass('active');
    }

    // Task completion functions (global scope for onclick handlers)
    window.completeTask = function(taskType) {
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        const today = new Date().toDateString();
        
        completedTasks.push({
            type: taskType,
            date: today,
            timestamp: Date.now()
        });
        
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        
        // Show completion message
        $('#modal-body').html(`
            <div class="text-center">
                <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Well done!</h3>
                <p>You've completed the ${taskContent[taskType].title.toLowerCase()}. Great job taking care of your mental wellness!</p>
                <button class="affirmation-btn" onclick="closeModal()" style="margin-top: 1rem;">Close</button>
            </div>
        `);
    };

    window.submitGratitude = function() {
        const gratitudeItems = [];
        $('.gratitude-input').each(function() {
            const value = $(this).val().trim();
            if (value) {
                gratitudeItems.push(value);
            }
        });

        if (gratitudeItems.length === 0) {
            alert('Please enter at least one thing you\'re grateful for.');
            return;
        }

        // Save gratitude list
        const gratitudeLists = JSON.parse(localStorage.getItem('gratitudeLists') || '[]');
        gratitudeLists.push({
            items: gratitudeItems,
            date: new Date().toDateString(),
            timestamp: Date.now()
        });
        localStorage.setItem('gratitudeLists', JSON.stringify(gratitudeLists));

        // Show completion
        $('#modal-body').html(`
            <div class="text-center">
                <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;">
                    <i class="fas fa-heart"></i>
                </div>
                <h3>Beautiful!</h3>
                <p>Your gratitude list has been saved. Practicing gratitude regularly can improve your overall well-being.</p>
                <div style="text-align: left; margin: 1rem 0; padding: 1rem; background: var(--background-color); border-radius: 8px;">
                    ${gratitudeItems.map(item => `<p>• ${escapeHtml(item)}</p>`).join('')}
                </div>
                <button class="affirmation-btn" onclick="closeModal()">Close</button>
            </div>
        `);
    };

    window.getNewAffirmation = function() {
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        $('#current-affirmation').text(randomAffirmation);
    };

    // Journal functionality
    function openJournalEditor() {
        resetJournalForm();
        $('#journal-editor-modal').addClass('active');
        $('#entry-content').focus();
    }

    function closeJournalEditor() {
        $('#journal-editor-modal').removeClass('active');
        resetJournalForm();
    }

    function resetJournalForm() {
        $('#entry-title').val('');
        $('#entry-content').val('');
        $('#entry-tags').val('');
        $('.mood-btn').removeClass('selected');
    }

    function saveJournalEntry() {
        const title = $('#entry-title').val().trim();
        const content = $('#entry-content').val().trim();
        const tags = $('#entry-tags').val().trim();
        const selectedMood = $('.mood-btn.selected').data('mood');

        if (!content) {
            alert('Please write something in your journal entry.');
            return;
        }

        const journalEntries = JSON.parse(localStorage.getItem('userJournalEntries') || '[]');
        
        const newEntry = {
            id: Date.now(),
            title: title || 'Untitled Entry',
            content: content,
            mood: selectedMood || 'neutral',
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };
        
        journalEntries.unshift(newEntry); // Add to beginning of array
        localStorage.setItem('userJournalEntries', JSON.stringify(journalEntries));
        
        closeJournalEditor();
        loadJournalEntries();
    }

    function loadJournalEntries() {
        const journalEntries = JSON.parse(localStorage.getItem('userJournalEntries') || '[]');
        const $container = $('#journal-entries');
        const $emptyState = $('#empty-journal');

        if (journalEntries.length === 0) {
            $container.hide();
            $emptyState.show();
        } else {
            $emptyState.hide();
            $container.show();
            
            const entriesHtml = journalEntries.map(entry => createJournalEntryHTML(entry)).join('');
            $container.html(entriesHtml);
        }
    }

    function createJournalEntryHTML(entry) {
        const moodEmoji = getMoodEmoji(entry.mood);
        const tagsHtml = entry.tags.map(tag => `<span class="journal-tag">${escapeHtml(tag)}</span>`).join('');
        
        return `
            <div class="journal-entry" data-id="${entry.id}">
                <div class="journal-entry-header">
                    <div>
                        <h3 class="journal-entry-title">${escapeHtml(entry.title)}</h3>
                        <p class="journal-entry-date">${entry.date}</p>
                    </div>
                    <div class="journal-entry-mood">${moodEmoji}</div>
                </div>
                <div class="journal-entry-content">${escapeHtml(entry.content)}</div>
                ${entry.tags.length > 0 ? `<div class="journal-entry-tags">${tagsHtml}</div>` : ''}
            </div>
        `;
    }

    function getMoodEmoji(mood) {
        const moodEmojis = {
            'very-happy': '😄',
            'happy': '😊',
            'neutral': '😐',
            'sad': '😔',
            'very-sad': '😢'
        };
        return moodEmojis[mood] || '😐';
    }

    // Global function for HTML onclick
    window.openJournalEditor = openJournalEditor;

    // Data persistence
    function saveJournalEntry(entry, sentiment, rating) {
        const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        
        journalEntries.push({
            entry: entry,
            sentiment: sentiment,
            rating: rating,
            date: new Date().toDateString(),
            timestamp: Date.now()
        });
        
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }

    function loadStoredData() {
        // Load and display any relevant stored data
        const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        const gratitudeLists = JSON.parse(localStorage.getItem('gratitudeLists') || '[]');
        
        console.log('Loaded data:', {
            journalEntries: journalEntries.length,
            completedTasks: completedTasks.length,
            gratitudeLists: gratitudeLists.length
        });
    }

    // Utility functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Periodic wellness reminders (optional feature)
    function showWellnessReminder() {
        const reminders = [
            "Remember to take deep breaths throughout your day.",
            "You're doing great! Take a moment to appreciate how far you've come.",
            "It's okay to take breaks. Self-care isn't selfish.",
            "Your mental health matters. Check in with yourself today.",
            "Small steps forward are still progress."
        ];

        const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
        
        // Could implement a notification system here
        console.log('Wellness reminder:', randomReminder);
    }

    // Initialize wellness reminders (every 30 minutes)
    setInterval(showWellnessReminder, 30 * 60 * 1000);
});
