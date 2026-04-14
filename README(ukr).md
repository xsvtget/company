# EProvider — Мій робочий план

## Головне
Починаю проект повністю заново.

- нове репо
- нова база даних
- нова структура
- демо використовую тільки як приклад функцій

Я НЕ копіюю демо, а будую свій чистий проект з нуля.

---

# Порядок роботи

## 1) Затвердити план Phase 1 ✅
Що входить в першу версію проекту.

### У Phase 1 входить:
- Employees
- Systems
- Services
- qualifications
- service_required_systems

---

## 2) Затвердити фінальну структуру бази даних ✅
Потрібно визначити фінальні таблиці і поля.

### Таблиці:
- employees
        - id
        - employee_code
        - full_name
        - email
        - role_title
        - department
        - location
        - availability_percent
        - active
        - notes
        - created_at
        - updated_at               
- systems
        id
        system_code
        name
        owner_name
        business_owner
        technical_owner
        environment
        sensitivity
        active
        notes
        created_at
        updated_at
- services
        id
        system_code
        name
        owner_name
        business_owner
        technical_owner
        environment
        sensitivity
        active
        notes
        created_at
        updated_at
- qualifications
        id
        employee_id
        system_id
        experience_score
        certification_points
        knowledge_score
        total_score
        qualification_level
        entry_date
        review_due_date
        is_reviewed
        notes
        created_at
        updated_at
- service_required_systems
        id
        service_id
        system_id
        required_level
        min_score
        is_critical
        notes
        created_at
        updated_at
---

## 3) Намалювати просту схему БД ✅
Показати:
- які таблиці є
- як вони пов’язані
- де будуть foreign keys

+-------------------+          +----------------------+
|     employees     |          |       systems        |
|-------------------|          |----------------------|
| id (PK)           |          | id (PK)              |
| employee_code     |          | system_code          |
| full_name         |          | name                 |
| email             |          | owner_name           |
| role_title        |          | business_owner       |
| department        |          | technical_owner      |
| location          |          | environment          |
| availability_%    |          | sensitivity          |
| active            |          | active               |
| notes             |          | notes                |
| created_at        |          | created_at           |
| updated_at        |          | updated_at           |
+-------------------+          +----------------------+
         \                              /
          \                            /
           \                          /
            \                        /
             \                      /
              \                    /
               \                  /
                \                /
                 v              v
              +----------------------+
              |    qualifications    |
              |----------------------|
              | id (PK)              |
              | employee_id (FK)     |
              | system_id (FK)       |
              | experience_score     |
              | certification_points |
              | knowledge_score      |
              | total_score          |
              | qualification_level  |
              | entry_date           |
              | review_due_date      |
              | is_reviewed          |
              | notes                |
              | created_at           |
              | updated_at           |
              +----------------------+


+-------------------+          +----------------------+
|      services     |          |       systems        |
|-------------------|          |----------------------|
| id (PK)           |          | id (PK)              |
| service_code      |          | system_code          |
| name              |          | name                 |
| owner_name        |          | ...                  |
| criticality       |          +----------------------+
| min_qualified     |                    ^
| preferred_qual.   |                    |
| active            |                    |
| notes             |                    |
| created_at        |                    |
| updated_at        |                    |
+-------------------+                    |
         \                               |
          \                              |
           \                             |
            v                            |
   +----------------------------+        |
   |  service_required_systems  |--------+
   |----------------------------|
   | id (PK)                    |
   | service_id (FK)            |
   | system_id (FK)             |
   | required_level             |
   | min_score                  |
   | is_critical                |
   | notes                      |
   | created_at                 |
   | updated_at                 |
   +----------------------------+

---

## 4) Створити нову чисту БД ✅
З нуля.

### Потрібно:
- створити нову database
- створити всі таблиці
- додати foreign keys
- перевірити, що все створилось правильно

---

## 5) Додати тестові дані вручну ✅
- [x] employees додані
- [x] systems додані
- [x] services додані
- [x] qualifications додані
- [x] service_required_systems додані

---

## 6) Перевірити БД в DBeaver ✅
- [x] дані реально зберігаються
- [x] зв’язки працюють
- [x] все видно в таблицях
- [x] UNIQUE працює
- [x] FOREIGN KEY працює
- [x] UPDATE працює
- [x] CASCADE працює
- [x] smart query для service → employee працює

---

## DB status ✅ 
Core database for Phase 1 is working.
Test data inserted.
Main relationships verified.
Constraints verified.
Ready to start backend for Employees.

---

## 7) Зробити backend для Employees ✅
### Потрібно:
- create employee ✅
- get employees list ✅
- get employee details ✅
- update employee ✅
- deactivate employee✅

---

## 8) Зробити backend для Systems ✅
### Потрібно:
- create system
- get systems list
- get system details
- update system
- deactivate system

---

## 9) Зробити backend для Services ✅
### Потрібно:
- create service
- get services list
- get service details
- update service
- deactivate service

---

## 10) Зробити backend для qualifications ✅
### Потрібно: 
- create qualification
- update qualification
- get qualifications by employee
- get qualifications by system
- delete qualification

---

## 11) Зробити backend для service_required_systems ✅
### Потрібно:
- link system to service
- update service-system link
- get systems by service
- get services by system
- delete service-system link

---

## 12) Зробити frontend для Employees
### Потрібно:
- список
- створення
- редагування
- деталі
- deactivate/reactivate
- пошук
- фільтри

---

## 13) Зробити frontend для Systems
### Потрібно:
- список
- створення
- редагування
- деталі
- deactivate/reactivate
- пошук
- фільтри

---

## 14) Зробити frontend для Services
### Потрібно:
- список
- створення
- редагування
- деталі
- deactivate/reactivate
- пошук
- фільтри

---

## 15) Зробити простий UI для qualifications
### Потрібно:
- додати qualification до employee
- редагувати qualification
- дивитися qualifications

---

## 16) Зробити простий UI для service_required_systems
### Потрібно:
- прив’язати system до service
- редагувати зв’язок
- дивитися required systems

---

## 17) Протестувати весь MVP
### Перевірити:
- employee створюється
- system створюється
- service створюється
- qualification працює
- service dependency працює
- все реально зберігається в MySQL

---

# Що роблю зараз

## CURRENT TASK:
1. Затвердити фінальну структуру БД для 5 таблиць

---

# Що НЕ роблю зараз

Поки не чіпаю:
- dashboards
- reports
- alerts
- access reviews
- advanced analytics
- risk engine

Спочатку тільки стабільна база + MVP.

---

# Done
- [x] Нове репо створено
- [x] Рішення почати все з нуля
- [x] Основні сторінки вибрані (Employees / Systems / Services)
- [x] Створений особистий план проекту

---

# In progress
- [ ] Затвердити фінальну структуру БД

---

# Next
- [ ] Таблиця employees
- [ ] Таблиця systems
- [ ] Таблиця services
- [ ] Таблиця qualifications
- [ ] Таблиця service_required_systems