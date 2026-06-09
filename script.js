// NutriTrack – Calorie Counter Logic with Open Food Facts API (no emojis)
// Autofill only – strict English names + relevance ranking
(function() {
  // DOM elements
  const totalCaloriesSpan = document.getElementById('totalCalories');
  const remainingSpan = document.getElementById('remaining');
  const itemCountSpan = document.getElementById('itemCount');
  const ringProgress = document.getElementById('ringProgress');
  const foodListEl = document.getElementById('foodList');
  const emptyStateDiv = document.getElementById('emptyState');
  const goalInput = document.getElementById('goalInput');
  const addBtn = document.getElementById('addBtn');
  const foodNameInput = document.getElementById('foodName');
  const foodCaloriesInput = document.getElementById('foodCalories');
  const formError = document.getElementById('formError');
  const resetBtn = document.getElementById('resetBtn');
  const suggestionsContainer = document.getElementById('suggestions');
  const toast = document.getElementById('toast');

  // Autofill button
  const autoFillApiBtn = document.getElementById('autoFillApiBtn');

  // Data
  let foodEntries = [];
  let dailyGoal = 2000;

  // Helper: show toast message
  function showToast(msg, duration = 2000) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Save to localStorage
  function saveData() {
    localStorage.setItem('nutritrack_entries', JSON.stringify(foodEntries));
    localStorage.setItem('nutritrack_goal', dailyGoal);
  }

  // Load from localStorage
  function loadData() {
    const savedEntries = localStorage.getItem('nutritrack_entries');
    if (savedEntries) {
      foodEntries = JSON.parse(savedEntries);
      foodEntries = foodEntries.filter(e => e && typeof e.name === 'string' && typeof e.calories === 'number');
    } else {
      foodEntries = [];
    }
    const savedGoal = localStorage.getItem('nutritrack_goal');
    if (savedGoal && !isNaN(parseInt(savedGoal))) {
      dailyGoal = parseInt(savedGoal);
      goalInput.value = dailyGoal;
    } else {
      dailyGoal = 2000;
      goalInput.value = 2000;
    }
  }

  // Update all UI
  function updateUI() {
    const total = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const remaining = Math.max(0, dailyGoal - total);
    const itemCount = foodEntries.length;

    totalCaloriesSpan.textContent = total;
    remainingSpan.textContent = remaining;
    itemCountSpan.textContent = itemCount;

    const percent = Math.min(1, total / dailyGoal);
    const circumference = 314;
    const dashoffset = circumference * (1 - percent);
    ringProgress.style.strokeDashoffset = dashoffset;
    if (total > dailyGoal) {
      ringProgress.classList.add('over-goal');
    } else {
      ringProgress.classList.remove('over-goal');
    }

    if (foodEntries.length === 0) {
      foodListEl.classList.add('hidden');
      emptyStateDiv.classList.remove('hidden');
    } else {
      foodListEl.classList.remove('hidden');
      emptyStateDiv.classList.add('hidden');
      renderFoodList();
    }

    saveData();
  }

  // Render food list
  function renderFoodList() {
    if (!foodListEl) return;
    foodListEl.innerHTML = '';
    const sorted = [...foodEntries].sort((a,b) => b.timestamp - a.timestamp);
    for (const entry of sorted) {
      const li = document.createElement('li');
      li.className = 'food-item';
      li.dataset.id = entry.id;

      const iconSpan = document.createElement('div');
      iconSpan.className = 'food-item-icon';
      iconSpan.textContent = '•';

      const nameSpan = document.createElement('div');
      nameSpan.className = 'food-item-name';
      nameSpan.textContent = entry.name;

      const timeSpan = document.createElement('div');
      timeSpan.className = 'food-item-time';
      const date = new Date(entry.timestamp);
      timeSpan.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });

      const calSpan = document.createElement('div');
      calSpan.className = 'food-item-cal';
      calSpan.textContent = entry.calories;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.setAttribute('aria-label', 'Remove item');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFoodEntry(entry.id);
      });

      li.appendChild(iconSpan);
      li.appendChild(nameSpan);
      li.appendChild(timeSpan);
      li.appendChild(calSpan);
      li.appendChild(removeBtn);
      foodListEl.appendChild(li);
    }
  }

  // Remove entry
  function removeFoodEntry(id) {
    const index = foodEntries.findIndex(e => e.id == id);
    if (index !== -1) {
      const removed = foodEntries[index];
      foodEntries.splice(index, 1);
      updateUI();
      showToast(`Removed ${removed.name} (${removed.calories} kcal)`);
    }
  }

  // Add new food
  function addFoodItem() {
    let name = foodNameInput.value.trim();
    let caloriesRaw = foodCaloriesInput.value.trim();

    if (name === '' || caloriesRaw === '') {
      formError.classList.remove('hidden');
      return;
    }
    const calories = parseInt(caloriesRaw, 10);
    if (isNaN(calories) || calories <= 0 || calories > 9999) {
      formError.classList.remove('hidden');
      return;
    }
    formError.classList.add('hidden');

    const newEntry = {
      id: Date.now() + Math.random(),
      name: name,
      calories: calories,
      timestamp: Date.now()
    };
    foodEntries.push(newEntry);
    updateUI();

    foodNameInput.value = '';
    foodCaloriesInput.value = '';
    foodNameInput.focus();

    showToast(`+ ${name} (${calories} kcal) added`);
  }

  // Reset day
  function resetDay() {
    if (foodEntries.length === 0) {
      showToast('No entries to clear');
      return;
    }
    if (confirm('Reset all food entries for today?')) {
      foodEntries = [];
      updateUI();
      showToast('Day reset – all food cleared');
    }
  }

  // Update daily goal
  function updateGoal() {
    let newGoal = parseInt(goalInput.value, 10);
    if (isNaN(newGoal)) newGoal = 2000;
    newGoal = Math.min(9999, Math.max(500, newGoal));
    dailyGoal = newGoal;
    goalInput.value = dailyGoal;
    updateUI();
    showToast(`Daily goal set to ${dailyGoal} kcal`);
  }

  // Predefined suggestions
  const suggestionsList = [
    { name: 'Apple', calories: 95 },
    { name: 'Banana', calories: 105 },
    { name: 'Oatmeal', calories: 158 },
    { name: 'Chicken Breast', calories: 165 },
    { name: 'Rice (cup)', calories: 206 },
    { name: 'Yogurt', calories: 120 }
  ];

  function buildSuggestions() {
    suggestionsContainer.innerHTML = '';
    suggestionsList.forEach(item => {
      const chip = document.createElement('button');
      chip.className = 'suggestion-chip';
      chip.textContent = `${item.name} (${item.calories})`;
      chip.addEventListener('click', () => {
        foodNameInput.value = item.name;
        foodCaloriesInput.value = item.calories;
      });
      suggestionsContainer.appendChild(chip);
    });
  }

  // ========== AUTOFILL WITH RELEVANCE RANKING ==========

  // Score how well a product name matches the search query
  function relevanceScore(productName, query) {
    const nameLower = productName.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact match (case-insensitive) – highest score
    if (nameLower === queryLower) return 100;
    
    // Name starts with query
    if (nameLower.startsWith(queryLower)) return 80;
    
    // Query is a separate word in the name (e.g., "chicken breast" for query "chicken")
    const words = nameLower.split(/\s+/);
    if (words.some(word => word === queryLower)) return 70;
    
    // Name contains query as substring
    if (nameLower.includes(queryLower)) return 50;
    
    // No match
    return 0;
  }

  async function autoFillFromApi() {
    const query = foodNameInput.value.trim();
    if (!query) {
      showToast('Please enter a food name first');
      return;
    }

    const originalText = autoFillApiBtn.textContent;
    autoFillApiBtn.textContent = 'Fetching...';
    autoFillApiBtn.disabled = true;

    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=30&lc=en`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const products = data.products || [];

      console.group(' Autofill with relevance ranking');
      console.log('Search query:', query);
      console.log('Total products:', products.length);

      // Collect candidates that have English name and calories
      const candidates = [];
      for (const product of products) {
        const englishName = product.product_name_en;
        if (!englishName || englishName.trim() === '') continue;
        
        let calories = null;
        if (product.nutriments) {
          const kcal = product.nutriments['energy-kcal'];
          if (kcal && !isNaN(parseFloat(kcal))) {
            calories = Math.round(parseFloat(kcal));
          } else if (product.nutriments.energy) {
            const energy = product.nutriments.energy;
            if (typeof energy === 'number' && !isNaN(energy)) calories = Math.round(energy);
            else if (typeof energy === 'string' && energy.includes('kcal')) {
              const match = energy.match(/(\d+)/);
              if (match) calories = parseInt(match[1]);
            }
          }
        }
        if (calories && calories > 0) {
          const score = relevanceScore(englishName, query);
          candidates.push({ name: englishName, calories, score });
          console.log(`Candidate: "${englishName}" (score ${score})`);
        }
      }

      // Sort by score descending, then pick the highest
      candidates.sort((a, b) => b.score - a.score);
      const bestProduct = candidates[0];

      console.log('Best match:', bestProduct);
      console.groupEnd();

      if (bestProduct && bestProduct.score > 0) {
        foodNameInput.value = bestProduct.name;
        foodCaloriesInput.value = bestProduct.calories;
        showToast(`Autofilled: ${bestProduct.name} (${bestProduct.calories} kcal per 100g)`);
        formError.classList.add('hidden');
      } else {
        showToast(`No relevant match for "${query}". Try a different name (e.g., "apple" instead of "aple").`);
      }
    } catch (error) {
      console.error('Autofill API error:', error);
      showToast('Autofill failed: ' + error.message);
    } finally {
      autoFillApiBtn.textContent = originalText;
      autoFillApiBtn.disabled = false;
    }
  }

  // Event listener for autofill button
  if (autoFillApiBtn) {
    autoFillApiBtn.addEventListener('click', autoFillFromApi);
  }

  // Set today's date
  function setTodayDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElem = document.getElementById('todayDate');
    if (dateElem) dateElem.textContent = today.toLocaleDateString(undefined, options);
  }

  // Event listeners (existing)
  addBtn.addEventListener('click', addFoodItem);
  resetBtn.addEventListener('click', resetDay);
  goalInput.addEventListener('change', updateGoal);
  foodNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addFoodItem(); });
  foodCaloriesInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addFoodItem(); });

  // Initialization
  function init() {
    setTodayDate();
    loadData();
    buildSuggestions();
    updateUI();
  }
  init();
})();