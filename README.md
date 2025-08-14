# 🏃‍♀️ Fitness Tracker App (Apple Fitness Inspired)

A sleek, modern fitness app built with **React Native**, **Expo Router**, and **Supabase**, inspired by Apple Fitness. Track your **steps**, **calories**, and view animated **progress rings** with **Lottie walking animations**.

---

## ✨ Features

- 🔐 Supabase authentication
- 👤 User profile with avatar, username, and last update
- 🚶 Real-time step + calorie tracker using device accelerometer
- 🔥 Dynamic progress ring with `react-native-progress`
- 🏃 Lottie animation for walking cycles
- 📅 Personalized greeting with date header
- ⚙️ Modular architecture using Expo Router

---

## 📦 Tech Stack

- **Expo SDK 53**
- **React Native + Expo Router**
- **Supabase (Auth + Database)**
- **Lottie React Native**
- **react-native-progress**
- **expo-sensors**

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/fitness-app.git
cd fitness-app
2. Install Dependencies
bash
Copy
Edit
npx expo install
Install Lottie (SDK 53 compatible):

bash
Copy
Edit
npx expo install lottie-react-native
3. Configure Supabase
Create a .env file in the root:

env
Copy
Edit
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
Update lib/supabase.ts:

ts
Copy
Edit
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
4. Run the App
bash
Copy
Edit
npx expo start
```
## 📁 Folder Structure
less

components/
  ├── Header.tsx            // Profile greeting
  └── CalorieBanner.tsx     // Lottie + calorie ring

hooks/
  └── useStepTracker.ts     // Step & calorie tracking logic

lib/
  └── supabase.ts           // Supabase client setup

assets/
  ├── images/               // Backgrounds, avatars, icons
  └── animations/           // Lottie JSON (walking)


## 🔐 Supabase Schema
sql
create table profiles (
  id uuid primary key references auth.users,
  username text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

## 📸 Preview
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/488e5754-75aa-488a-954c-5076a1ba4395" />


## 🧠 Coming Soon
⏱️ Step pacing & daily goal streaks

📊 Weekly progress dashboard

⌚ Apple Health / Google Fit syncing

🧘 Meditation & workout logging

## 🛠️ Tips
If using Dev Client:

bash

npx expo run:android   # or run:ios
If Lottie gives install errors:

bash

npx expo install lottie-react-native
For dependency conflicts:

bash
Copy
Edit
npm install --legacy-peer-deps
## 📄 License
MIT © Your Name

yaml
Copy
Edit

---


