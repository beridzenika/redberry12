# 🎬 KINO XII

### Cinema Ticket Booking Platform

> *Redberry Bootcamp — 12th Project Assignment*

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)

**KINO XII** is a comprehensive cinema ticket booking application built with **React** and **JavaScript**. It lets users discover movies, browse cinema sessions, select seats, purchase tickets, order concessions, and manage their profiles and bookings — all in a seamless, user-friendly experience.

This project was built as the **12th project assignment of the Redberry Bootcamp**.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Integration](#-api-integration)
- [Authentication and Booking Rules](#-authentication-and-booking-rules)
- [URL State Management](#-url-state-management)
- [Form Validation and Error Handling](#-form-validation-and-error-handling)
- [Project Goals](#-project-goals)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication and Registration

- Login and registration **modals** with form validation
- Email, username, and password validation (*client and server-side*)
- Backend verification for **unique usernames and email addresses**
- Optional **avatar upload** with image preview and format validation
- Automatic login prompts for unauthenticated users accessing protected actions
- Automatic session recovery on API `401 Unauthorized` responses
- Automatic **continuation of protected actions** after successful authentication
- API error messages displayed within forms and modals

### 🏠 Landing Page and Movies

- Animated **hero section** featuring four featured movies
- **Recently viewed** movies section (available to all users)
- **Now Playing** section with current cinema releases
- **Coming Soon** section with upcoming movie releases
- Movie cards displaying posters, titles, age ratings, durations, release dates, and ticket prices
- Detailed movie pages with descriptions, genres, directors, cast, and available screening formats
- Quick navigation to movie details and session listings

### 🎟️ Cinema Sessions and Filtering

- Publicly accessible cinema session listings
- **Sticky filter sidebar** with multiple filter options:
  - Filter by **cinema venue**, **date**, **screening format**, **language**, and **time of day**
  - Date selection covering the **next seven days**
  - Dynamically displayed screening formats based on selected venues
- Multiple sorting options (*earliest showtime, latest showtime, price, movie title*)
- Sessions **grouped by movie**
- Display of screening times, halls, formats, languages, prices, and seat availability
- **Sold-out** session indicators
- Pagination with **ten movies per page**
- **URL-based** filter, sorting, date, and pagination state — filters persist across refreshes and browser navigation

### 🎥 Movie Details

- Movie posters and backdrop images
- Descriptions, genres, directors, and main cast information
- Age ratings with explanations
- Runtime and release date
- Available screening formats
- Sessions grouped by cinema venue
- Date selection for upcoming sessions
- **Age-based access restrictions** for 16+ and 18+ rated movies
- Direct navigation to seat selection

### 💺 Seat Selection and Booking

- Dynamic **cinema hall maps** rendered from API data
- Support for **available**, **sold**, **held**, and **unavailable** seats
- Maximum of **three seats per order**
- Prevention of selecting unavailable or reserved seats
- Seat availability legend
- Individual **ticket type** selection per seat:

  | Ticket Type | Price |
  |-------------|-------|
  | **Adult**   | 100% of seat price |
  | **Child**   | 60% of seat price |
  | **Student** | 75% of seat price |

- Ticket eligibility validation based on movie age restrictions
- Real-time **price summary** showing selected seats, ticket types, and prices
- Temporary seat reservations managed via API
- Automatic handling of `409 Conflict` errors when seats become unavailable
- **Eight-minute reservation countdown** with automatic expiration handling

### 💳 Checkout and Payment

- Final order summary with seats, ticket types, concessions, and pickup slot information
- Customer information **pre-filled** from user profile
- Comprehensive form validation for buyer and payment details:
  - Full name and email validation
  - **Georgian mobile number** format validation
  - Card number, expiration date, and CVV validation
- Loading states during payment submission
- **Duplicate submission prevention**
- Field-specific API validation errors (`422 Unprocessable Entity`)
- Automatic handling of unavailable concession pickup slots
- Order confirmation with **reference number**, ticket details, and pickup information

### 🍿 Concessions

- Food and beverage ordering during the booking process
- Concession items included in the checkout summary
- Pickup slot selection and management
- Handling of unavailable pickup slots

### 👤 User Profile

- View and update personal information
- Manage **full name**, **mobile number**, **date of birth**, and **preferred cinema venue**
- Registered email displayed as **read-only**
- Validation for required fields and Georgian mobile number formats
- **Minimum age requirement of 12 years** with automatic age calculation
- Age-based ticket purchase restrictions
- Profile completion status indicators
- Incomplete profile warnings
- Prevention of ticket purchases and concession orders until the profile is complete
- Save changes with loading states and validation feedback

### 🎫 My Tickets

- Separate tabs for **upcoming** and **past** tickets
- Ticket information includes movie posters, titles, venues, halls, dates, times, formats, languages, seats, and prices
- **Refund functionality** for upcoming tickets (available until **two hours** before screening)
- Disabled refund actions when the refund period has expired
- Automatic removal of refunded tickets from the upcoming list
- Past tickets displayed without active actions

### ⚙️ User Experience and Error Handling

- Reusable React components and modal interfaces
- Consistent navigation and authentication state management
- Protected action routes requiring authentication
- Profile completion checks before booking
- Loading states and duplicate submission prevention
- Comprehensive client-side form validation with server-side error handling
- Automatic action continuation after authentication
- Responsive layouts with reusable CSS styles

---

## 🛠️ Tech Stack

| Technology           | Purpose                                  |
|----------------------|------------------------------------------|
| **React**            | User interface development               |
| **JavaScript**       | Application logic                        |
| **React Router DOM** | Client-side routing and navigation       |
| **CSS**              | Styling and responsive layouts           |
| **REST API**         | Backend communication                    |

---

## 📁 Project Structure

```
project-root/
├── public/
├── assets/
│   └── icons/                    # Icons and static visual assets
├── components/
│   ├── Header/
│   │   ├── Header.js
│   │   └── Header.css
│   └── ...                       # Other reusable components
├── contexts/                     # Shared application state (React Context)
├── hooks/                        # Custom React hooks
├── pages/                        # Page-level components for routing
├── providers/
│   └── AppProviders.js           # Application-wide context providers
├── services/
│   └── api.js                    # Centralized API communication
├── styles/
│   ├── global.css                # Global styles and layout
│   └── variables.css             # CSS variables and design tokens
├── utils/                        # Utility functions and validation helpers
├── app.js                        # Main application component and routing
├── package.json
└── README.md
```

### Folder Overview

| Path | Description |
|------|-------------|
| `assets/icons/` | Icons and static visual assets |
| `components/` | Reusable UI components (each in its own folder with JS and CSS files) |
| `contexts/` | Shared application state via React Context |
| `hooks/` | Custom React hooks for reusable logic |
| `pages/` | Page-level components used for routing |
| `providers/AppProviders.js` | Application-wide context providers |
| `services/api.js` | Centralized API communication and request handling |
| `styles/global.css` | Global styles and shared layout rules |
| `styles/variables.css` | CSS variables for colors, spacing, and design tokens |
| `utils/` | Utility functions, validation helpers, and shared logic |

Each component follows a consistent structure, keeping its JavaScript and CSS files together:

```
components/
└── ComponentName/
    ├── ComponentName.js
    └── ComponentName.css
```

---

## 🚀 Getting Started

### Prerequisites

- Access to the hosted **REST API** (no local backend required)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <https://github.com/beridzenika/redberry12>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd <redberry12>
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm start
   npm install react-router-dom
   ```

---

## 🔌 API Integration

This is a **purely frontend project** — there is no backend code in this repository. All data comes from the hosted REST API:

**Base URL:** `https://api.kinoxii.redberryinternship.ge/api/`

The application communicates with this API for the following functionality:

- User registration, login, and session management
- Movie information and screening schedules
- Cinema venues, halls, seat maps, and seat availability
- Temporary seat reservations and expiration management
- Order creation, payment processing, and confirmation
- User profiles and ticket management
- Ticket refunds
- Concession orders and pickup reservations

### API Configuration

All API requests are organized in `services/api.js`, which points to the base URL above.

### Handled API Responses

| Status Code | Handling |
|-------------|----------|
| `401 Unauthorized` | Authentication required or session expired; automatic login prompt |
| `409 Conflict` | Seat reservation or concession pickup slot no longer available; automatic refresh |
| `422 Unprocessable Entity` | Request validation errors; field-specific error messages displayed |

---

## 📜 Authentication and Booking Rules

- Landing page, movie details, and session listings are **publicly accessible**
- Protected actions prompt unauthenticated users to log in
- After successful authentication, the originally requested action **continues automatically**
- Ticket purchases require a **complete user profile**
- Movie age restrictions are enforced based on the user's **date of birth**
- Maximum of **three seats** per order
- Seat reservations are active for **eight minutes** before automatic expiration
- Refunds are permitted until **two hours** before the screening starts
- Incomplete profiles prevent ticket purchases and concession orders

---

## 🔗 URL State Management

Session filters, sorting, date selection, and pagination are represented in URL query parameters:

```
/sessions?venue=galleria,batumi&date=2026-11-14&format=max&sort=price_asc&page=2
```

This enables:

- **Shareable URLs** — Share filtered session listings with others
- **Persistent State** — Filters and sorting are restored when opening the URL in a new tab or after a page refresh
- **Browser Navigation** — Navigate between previous filter states using the Back and Forward buttons
- **Automatic Pagination Reset** — Resets to page 1 when filters or sorting options change

---

## ✅ Form Validation and Error Handling

The application validates all user input and shows clear error messages for invalid data and failed API requests.

### Validation Includes

- Email format and password length requirements
- Username and email uniqueness (*server-side verification*)
- Avatar image format validation
- Required profile fields
- Full name length validation
- Georgian mobile number format
- Date of birth and minimum age requirements
- Movie age restrictions and ticket type eligibility
- Seat availability and reservation expiration
- Payment card information (card number, expiration, CVV)
- Concession pickup slot availability

### Error Handling

Server-side validation errors are displayed within the relevant forms, allowing users to correct their input **without losing previously entered information**.

---

## 🎯 Project Goals

This project aims to deliver:

- [x] A complete cinema ticket booking experience from movie discovery to ticket purchase
- [x] Clean and reusable React components following best practices
- [x] Reliable application state management via React Context
- [x] Centralized API communication through a dedicated service layer
- [x] URL-driven navigation supporting filter persistence and sharing
- [x] Secure authentication flows with automatic session recovery
- [x] Dynamic seat selection with real-time availability updates
- [x] Intelligent reservation management with conflict handling
- [x] Consistent form validation across all user inputs

---

## 📄 License

No license has been specified for this project.

---

<p align="center"><i>KINO XII — Redberry Bootcamp, Project Assignment #12</i></p>
