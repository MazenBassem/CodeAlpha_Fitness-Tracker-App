# 🏃‍♀️ Fitness Tracker App (Apple Fitness Inspired)

A sleek, modern fitness app built with **React Native**, **Expo Router**, and **Supabase**, designed to replicate the aesthetic and functionality of **Apple Fitness**. Track your **steps**, **calories**, and view dynamic **animated progress rings** and **walking animations**.

---

## ✨ Features

- 🔒 **Authentication** via Supabase
- 🧑 **User Profile** with avatar and username
- 🚶‍♂️ **Step & Calorie Tracker** using device sensors (`Accelerometer`)
- 🔥 **Calorie Progress Ring** powered by `react-native-progress`
- 🏃‍♂️ **Lottie Animation** to display walking motion
- 📅 Personalized **date & greeting header**
- ⚡ Smooth and modular **Expo Router** navigation

---

## 📦 Tech Stack

- **React Native** (with Expo SDK 53)
- **Expo Router** (v5+)
- **Supabase** (Auth + DB)
- **Lottie** (`lottie-react-native`)
- **react-native-progress**
- **Sensors:** `expo-sensors` (Accelerometer, Pedometer)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/fitness-app.git
cd fitness-app
```

### 2. Install dependencies
```bash

npx expo install
Make sure lottie-react-native is properly installed (SDK 53 compatible):
```

```bash

npx expo install lottie-react-native
```

### 3. Set up Supabase
Create a .env file in the root with:

```env

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```
Configure Supabase in lib/supabase.ts:
```
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
```
### 4. Run the app
```bash



npx expo start
```
---
## 📁 Project Structure
```bash

/components
  └── CalorieBanner.tsx      # Progress ring + Lottie + calories
  └── Header.tsx             # User avatar, username, date

/hooks
  └── useStepTracker.ts      # Custom hook for tracking steps & calories

/lib
  └── supabase.ts            # Supabase client instance

/assets
  ├── images/                # PNGs, model, banner
  └── animations/            # Lottie JSONs

```
---
## 🔐 Supabase Schema (Profiles Table)
```sql

create table profiles (
  id uuid primary key references auth.users,
  username text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```
---
## 📸 Screenshots
<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/bff98fea-aebe-47a3-9eb2-97a3e6636ff4" />
---
## 🧠 Future Enhancements
🧭 Daily/Weekly goals with historical charts

⌚ Apple Health / Google Fit sync

📊 Dashboard with activity trends

🧘 Workout logging & meditation tracking

## 💡 Tips
If using Dev Client, rebuild with:

```bash

npx expo run:android | run:ios
If facing lottie-react-native install issues, run:
```
```bash

npx expo install lottie-react-native
If you get peer dependency issues:
```
```bash

npm install --legacy-peer-deps
```
---
## 📄 License
MIT © Your Name


---
