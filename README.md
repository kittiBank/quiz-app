# quiz-app

This is a simple Quiz application built with React Native and TypeScript. This app displays 20 multiple-choice questions with 4 options. Every time the app reloads or re-opens, The questions and options are randomized. This app store data with local storage not database requied.

## Techstack
**Frontend:** React Native, TypeScript  
**State Management:** React Hooks (useState, useEffect)  
**Storage:** AsyncStorage (for saving scores in localstorage)

## Project Structure
quiz-app/
- src/
    - screens/
        - HomeScreen.tsx
        - LeaderboardScreen.tsx
        - QuizScreen.tsx
    - date/
        - questions.json
    - navigation/
        - AppNavigator.tsx
- app.tsx

## How to run

1. Clone the repository:
```git clone (https://github.com/kittiBank/quiz-app.git)```

2. Move into project
```cd quiz-app```

3. Install dependencies
```npm install```

4. Run the app
```npm start```

5. Open with browser in responsive mobile size
<img width="1820" height="752" alt="image" src="https://github.com/user-attachments/assets/8f0ac89d-1def-4863-8114-5dc04cf5321d" />




