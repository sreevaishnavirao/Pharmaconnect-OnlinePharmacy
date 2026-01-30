# PharmaConnect

PharmaConnect is a full-stack online pharmacy app built with **React (Vite) + Tailwind** and **Spring Boot + PostgreSQL**.  
It supports product browsing/search, cart + checkout, orders, and an admin dashboard for inventory management.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Redux
- Backend: Spring Boot, Spring Security (JWT), JPA/Hibernate
- Database: PostgreSQL

## Main Features
- User auth (JWT login/register)
- Product catalog: categories, search, sorting
- Cart: add/remove/update quantity 
- Address management + checkout + order placement
- Admin panel: CRUD products, image upload, inventory updates
- Alerts: low-stock + near-expiry notifications (for admin only)

## Prerequisites
- Node.js (recommended: 20+)
- Java (17+ recommended)
- Maven
- PostgreSQL

## Run Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run

