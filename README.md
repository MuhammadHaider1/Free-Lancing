# FreelanceHub 💼

A full‑stack freelancer marketplace where **clients** can post projects and hire **freelancers**, and freelancers can sell services, send proposals, manage orders, chat in real‑time, and get paid through an integrated wallet.

Built with a **Django REST Framework** backend and a **React (Tailwind CSS)** frontend.

---

## ✨ Features

### 👤 Authentication & Users
- JWT authentication (access + refresh tokens via `django-rest-framework-simplejwt`)
- Custom `User` model with two roles: **Client** and **Freelancer**
- User registration, login, profile with bio and profile picture

### 🧑‍💼 For Clients
- Create & manage **projects** with budget and deadline
- Browse freelancers and their **services**
- Review **proposals** from freelancers (accept / reject)
- Place **orders**, receive deliveries, and leave **reviews**

### 🛠️ For Freelancers
- Create & manage **services** (web dev, graphic design, writing, marketing, etc.)
- Browse open **projects** and send **proposals** (bid + delivery days)
- Accept orders, upload **delivery files**
- Track order status and earnings in the **wallet**

### 💳 Wallet & Payments
- **Credit / Debit / Withdrawal** transaction system
- Freelancers withdraw via **JazzCash / EasyPaisa / Bank Transfer**
- Admin approval workflow for withdrawal requests
- Admin dashboard with platform stats

### 💬 Real‑time Chat
- Per‑order **conversations** between client and freelancer
- Messages with read receipts

### 🔔 Notifications
- Automatic notifications for proposals, orders, and deliveries
- Read / unread status per user

### ⚙️ Platform Tooling
- **REST API** with pagination, filtering, search & ordering
- **Swagger** (drf-yasg) interactive API documentation
- **Redis caching** for services, projects, profiles, reviews & dashboards
- **CORS** enabled for the React frontend
- **PostgreSQL** database

---

## 🧰 Tech Stack

### Backend
| Layer        | Technology                                     |
|--------------|------------------------------------------------|
| Framework    | Django 6 + Django REST Framework               |
| Database     | PostgreSQL                                     |
| Auth         | SimpleJWT (JWT)                                |
| Cache        | Redis (django-redis)                           |
| API Docs     | drf-yasg (Swagger / ReDoc)                     |
| HTTP / CORS  | django-cors-headers, django-filter              |

### Frontend
| Layer        | Technology                                     |
|--------------|------------------------------------------------|
| Framework    | React 19 (Create React App)                    |
| Styling      | Tailwind CSS                                   |
| Routing      | React Router v7                               |
| HTTP         | Axios                                          |
| Animations   | Framer Motion                                  |

---

## 📁 Project Structure

```
freelancehub/
├── freelancehub/          # Django project (settings, urls, wsgi)
│   ├── settings.py        # DB, JWT, Redis cache, CORS config
│   └── urls.py            # API routes + Swagger docs
│
├── users/                 # Custom User model, register/login/profile
├── services/              # Freelancer services (CRUD)
├── projects/              # Client projects + proposals
├── orders/                # Orders, delivery files, statuses
├── reviews/               # Ratings & reviews after delivery
├── notifications/         # Per-user notifications
├── chat/                  # Order conversations & messages
├── wallet/                # Transactions & withdrawal requests
│
├── frontend/              # React SPA (Tailwind CSS)
│   └── src/
│       ├── pages/         # Login, Register, Dashboard, Services, ...
│       └── services/      # Axios API client
│
├── media/                 # User-uploaded images & files
├── manage.py
├── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- Redis

### 1. Backend Setup

```bash
# Clone the repo
git clone https://github.com/MuhammadHaider1/Free-Lancing.git
cd Free-Lancing

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

Create a PostgreSQL database and update the credentials in `freelancehub/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'freelancehub',
        'USER': 'freelanceuser',
        'PASSWORD': 'password123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

Apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 3. Redis

Make sure Redis is running locally (used for caching & sessions):

```bash
redis-server
```

### 4. Run the Backend

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/` and Swagger docs at `http://localhost:8000/swagger/`.

### 5. Run the Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

The React app will run at `http://localhost:3000` (CORS is already configured).

---

## 🔗 API Endpoints

Auth & users:
```
POST /api/users/register/
POST /api/users/login/
POST /api/users/token/refresh/
GET  /api/users/profile/
```

Services, projects & orders (DRF ViewSets, full CRUD):
```
/api/services/
/api/projects/
/api/orders/
/api/reviews/
/api/notifications/
```

Chat & wallet:
```
/api/chat/
/api/wallet/transactions/
/api/wallet/summary/
/api/wallet/withdrawals/
/api/wallet/admin/withdrawals/
/api/wallet/admin/stats/
```

Full interactive docs: **`/swagger/`**

---

## 🧑‍💻 Admin Panel

Login at `/admin/` with a superuser. Manage users, services, projects, orders, reviews, notifications, messages, and **approve/reject withdrawal requests** from the wallet section.

---

## ⚙️ Configuration

Key settings live in `freelancehub/settings.py`:

- `AUTH_USER_MODEL = 'users.User'`
- JWT lifetimes (60 min access / 1 day refresh)
- Redis cache with per‑data type TTLs (`CACHE_TTL`)
- `CORS_ALLOWED_ORIGINS = ['http://localhost:3000']`

> ⚠️ **Security:** For production, replace the development `SECRET_KEY`, set `DEBUG = False`, configure `ALLOWED_HOSTS`, and move credentials to environment variables or secrets.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open a PR or issue.

---

## 📄 License

This project is for educational / portfolio purposes. See the repository for details.
