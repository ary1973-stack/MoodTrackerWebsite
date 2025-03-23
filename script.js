// Save mood to local storage
function saveMood(mood, emoji) {
    let moodHistory = JSON.parse(localStorage.getItem("moods")) || [];
    moodHistory.push({ mood: `${mood} ${emoji}`, date: new Date().toLocaleString() });
    localStorage.setItem("moods", JSON.stringify(moodHistory));
}

// Show toast message
function showToast(message) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Smooth Page Navigation
function navigateTo(page) {
    gsap.to(".page-transition", {
        transform: "translateY(0%)",
        duration: 0.5,
        onComplete: function() {
            window.location.href = page;
        }
    });
}

// Suggestions Dictionary
const moodSuggestions = {
    happy: "Great to hear you're happy! Keep spreading positivity—maybe share a smile with someone today! 😊",
    sad: "Feeling sad? Try listening to your favorite music or talking to a friend—it can help lift your spirits. 🎶",
    angry: "Feeling angry? Take a deep breath and try some calming exercises like meditation or a short walk. 🧘‍♂️",
    excited: "You're excited—awesome! Channel that energy into something creative like drawing or dancing! 🎉",
    calm: "Feeling calm is wonderful! Maybe take some time to meditate or enjoy a quiet moment with a book. 📖"
};

// Streak and Rewards Logic
function updateStreak() {
    const today = new Date().toLocaleDateString();
    let streakData = JSON.parse(localStorage.getItem("streakData")) || {
        streak: 0,
        lastLogin: null,
        rewards: []
    };

    // Check if this is the first login
    if (!streakData.lastLogin) {
        streakData.streak = 1;
        streakData.lastLogin = today;
    } else {
        const lastLoginDate = new Date(streakData.lastLogin);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate - lastLoginDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day login
            streakData.streak += 1;
            streakData.lastLogin = today;
        } else if (diffDays > 1) {
            // Missed a day, reset streak
            streakData.streak = 1;
            streakData.lastLogin = today;
        } else {
            // Same day login, no change in streak
            return streakData;
        }
    }

    // Assign rewards based on streak
    if (streakData.streak === 3 && !streakData.rewards.includes("3-day-badge")) {
        streakData.rewards.push("3-day-badge");
        showToast("🎉 Congrats! You've earned a 3-Day Streak Badge!");
    } else if (streakData.streak === 7 && !streakData.rewards.includes("7-day-message")) {
        streakData.rewards.push("7-day-message");
        showToast("🌟 Amazing! 7-Day Streak! Keep up the great work!");
    } else if (streakData.streak === 14 && !streakData.rewards.includes("14-day-badge")) {
        streakData.rewards.push("14-day-badge");
        showToast("🏆 Wow! You've earned a 14-Day Streak Badge!");
    } else if (streakData.streak === 21 && !streakData.rewards.includes("21-day-badge")) {
        streakData.rewards.push("21-day-badge");
        showToast("🎖️ Fantastic! You've earned a 21-Day Streak Badge!");
    } else if (streakData.streak === 28 && !streakData.rewards.includes("28-day-master")) {
        streakData.rewards.push("28-day-master");
        showToast("👑 You're a Master of Consistency! 28-Day Streak!");
    } else if (streakData.streak === 30 && !streakData.rewards.includes("30-day-mood-master")) {
        streakData.rewards.push("30-day-mood-master");
        showToast("🌟 You're a Mood Master! 30-Day Streak Achieved!");
    } else if (streakData.streak > 14 && streakData.streak % 7 === 0) {
        // Every 7 days after 14 days, give a motivational message
        const messageCount = Math.floor((streakData.streak - 14) / 7);
        if (!streakData.rewards.includes(`motivational-message-${messageCount}`)) {
            streakData.rewards.push(`motivational-message-${messageCount}`);
            showToast("🚀 You're unstoppable! Keep up your amazing streak!");
        }
    }

    localStorage.setItem("streakData", JSON.stringify(streakData));
    return streakData;
}

document.addEventListener("DOMContentLoaded", function() {
    // Page Load Transition Animation
    gsap.from(".page-transition", { transform: "translateY(100%)", duration: 0.5 });
    gsap.from(".container", { opacity: 0, y: 50, duration: 1 });

    // Update streak and display rewards on index.html
    const streakContainer = document.getElementById("streak-container");
    if (streakContainer) {
        // Set initial opacity to 0 to prevent flash of content
        streakContainer.style.opacity = "0";

        const streakData = updateStreak();
        const streakText = document.getElementById("streak-text");
        const rewardsText = document.getElementById("rewards-text");

        // Update content
        streakText.innerText = `Current Streak: ${streakData.streak} day${streakData.streak !== 1 ? 's' : ''}`;
        rewardsText.innerHTML = "Rewards: " + (streakData.rewards.length > 0 
            ? streakData.rewards.map(reward => {
                if (reward === "3-day-badge") return "3-Day Streak Badge 🥉";
                if (reward === "7-day-message") return "7-Day Motivational Message 🌟";
                if (reward === "14-day-badge") return "14-Day Streak Badge 🏆";
                if (reward === "21-day-badge") return "21-Day Streak Badge 🎖️";
                if (reward === "28-day-master") return "Master of Consistency 👑";
                if (reward === "30-day-mood-master") return "Mood Master Title 🌟";
                if (reward.startsWith("motivational-message")) return "Motivational Message 🚀";
                return reward;
            }).join(", ")
            : "No rewards yet. Keep logging in daily!");

        // Animate streak container after content is set
        gsap.to(streakContainer, { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out", 
            delay: 0.5 
        });
    }

    // Mood Selection Animation (for mood.html)
    const moodCards = document.querySelectorAll(".mood-card");
    moodCards.forEach(card => {
        card.addEventListener("click", function() {
            let selectedMood = this.getAttribute("data-mood");
            let emoji = this.querySelector(".emoji").innerText;
            saveMood(selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1), emoji);

            // Click animation
            gsap.to(this, { scale: 0.9, duration: 0.2, yoyo: true, repeat: 1 });

            // Show toast
            showToast(`Mood Saved: ${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} ${emoji}`);

            // Show suggestion
            const suggestionContainer = document.getElementById("suggestion-container");
            const suggestionText = document.getElementById("suggestion-text");
            suggestionText.innerText = moodSuggestions[selectedMood] || "No suggestion available.";
            suggestionContainer.style.display = "block"; // Show the suggestion container
            gsap.fromTo(suggestionContainer, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        });
    });
});