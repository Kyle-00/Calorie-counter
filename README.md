# NutriTrack – Daily Calorie Counter

NutriTrack is a minimalist, beautifully designed web application that helps you track your daily calorie intake. Log your meals, monitor your progress with a visual ring chart, and stay motivated to reach your nutrition goals.

---

## Features

- **Add Food Items** – Log any food with a name and calorie value.
- **Quick Suggestions** – Predefined common foods (Apple, Banana, Oatmeal, etc.) to speed up logging.
- **Visual Progress Ring** – The ring fills as you approach your daily calorie goal.
- **Real-time Statistics** – See total calories, remaining calories, and item count instantly.
- **Adjustable Daily Goal** – Change your target (500–9999 kcal) at any time.
- **Remove Entries** – Delete individual food items from your log.
- **Reset Day** – Clear all entries with a confirmation prompt.
- **Persistent Storage** – All data is saved in your browser’s `localStorage`. Refresh or close the page without losing your log.
- **Responsive Design** – Works seamlessly on desktop, tablet, and mobile devices.
- **No Emojis** – Uses clean typography and text symbols for a professional look.

---

## Technologies Used

- **HTML5** – Semantic markup
- **CSS3** – Custom styles (no frameworks, responsive, animations)
- **JavaScript** – Vanilla JS, no external dependencies
- **localStorage** – Client-side persistence

---

## File Structure

nutritrack/

- ├── index.html # Main HTML structure
- ├── style.css # All styling (no emojis, fully self-contained)
- ├── script.js # Application logic (add, remove, reset, goal, ring updates)
- └── README.md # Project documentation

---

## Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No server or internet connection required after loading (works offline)

### Installation & Running

1. **Clone or download** the repository:

   ```bash
   git clone https://github.com/Kyle-00/Calorie-counter
   ```

Open index.html in your browser:

Double-click the file, or

Right-click → Open with → Your browser

Start tracking!

Set your daily calorie goal (default is 2000 kcal).

Use the "Quick Add" chips or manually type a food name and calories.

Press "Add" or hit Enter.

Watch the ring and remaining calories update.

## How to Use

### Adding a Food

- Type the food name (e.g., "Pizza slice").

- Enter the calories (e.g., "285").

- Click the + Add button or press Enter.

- The item appears in the food log, and the calorie ring updates.

### Using Quick Add

- Click any suggestion chip (e.g., "Apple (95)").

- The name and calorie fields are automatically filled.

- Click + Add or press Enter.

### Changing Daily Goal

- Click on the number next to "Daily Goal".

- Type a new value (between 500 and 9999 kcal).

- Press Enter or click away – the remaining calories and ring adjust instantly.

### Removing an Item

- Each food item has a ✕ button on the right.

- Click it to remove that item – the totals and ring update immediately.

### Resetting the Day

- Click the Reset Day button in the top-right corner of the food log.

- Confirm the action in the pop-up dialog.

- All entries are cleared, and the ring resets to empty.

## Design Notes

- Color palette – Warm earthy tones (#f5f0e8, #e07b39, #2c1a0e) for a friendly, organic feel.

- Typography – Uses DM Sans (sans-serif) and Fraunces (serif) via system fallbacks.

- Animations – Subtle fade-in for cards and items, plus a smooth ring transition.

- No external fonts loaded – Relies on system fonts to keep the app fast and private.

- Text symbols instead of emojis – The leaf accents (✤) and food list icon (•) ensure a clean, cross-platform appearance.

## Responsive Breakpoints

Desktop – Full layout with side‑by‑side ring and stats.

Tablet / Mobile (≤520px) – Stacked cards, full-width buttons, hidden leaf accents for better readability.

## Testing

The app has been tested on:

Chrome,Firefox,Safari,Edge

All features (add, remove, goal change, reset, localStorage persistence) work as expected.

## Data Storage

All food entries and the daily goal are stored in the browser’s localStorage.

Data persists across browser sessions until manually cleared.

To reset all data, use the Reset Day button (clears entries only) or clear your browser’s local storage for this domain.

## Known Issues & Limitations

No backend – data is only saved on the current device/browser.

No nutritional breakdown beyond calories (no macros).

Calories must be entered as whole numbers (no decimals).

## License

This project is licensed under the MIT License – feel free to use, modify, and distribute it as you like.
