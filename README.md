# Emil's Portfolio - Digital Art Creator

A personal portfolio website for Emil Andersson showcasing digital art, graphic design, web development, 3D art, and video editing works. Website: https://emilandersson.com

## 🚀 Overview

This portfolio site serves as a platform for Emil Andersson to display creative works and connect with potential clients. The site features a clean, modern design with an intuitive user interface for optimal user experience.

## 🛠️ Technologies Used

- **Backend**: PHP, Laravel
- **Frontend**: HTML, CSS, JavaScript
- **Admin Panel**: Filament
- **Libraries**:
  - Swiper.js - For image carousels
  - ScrollReveal - For scroll animations
  - Bootstrap Icons - For UI icons
- **Analytics**: Google Analytics

## ✨ Features

- Responsive design for all device sizes
- Portfolio showcase with filtering options
- Blog with categorized content
- Search functionality
- Admin dashboard for content management
- SEO optimized with meta tags
- Contact form for inquiries

## 🔧 Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   ```

2. Install PHP dependencies:
   ```
   composer install
   ```

3. Install JavaScript dependencies:
   ```
   npm install
   ```

4. Copy `.env.example` to `.env` and configure your environment variables:
   ```
   cp .env.example .env
   ```

5. Generate application key:
   ```
   php artisan key:generate
   ```

6. Run migrations:
   ```
   php artisan migrate
   ```

7. Build assets:
   ```
   npm run dev
   ```

8. Serve the application:
   ```
   php artisan serve
   ```

## 💻 Admin Dashboard

Access the admin dashboard at `/admin`. The admin panel includes:

- Content management for portfolio items and blog posts
- AI-powered blog post generation
- User management
- Analytics integration
- Media library management