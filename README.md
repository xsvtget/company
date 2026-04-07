1. EMPLOYEES
Мета сторінки:

зберігати всіх працівників, які можуть:

працювати з системами
бути відповідальними за сервіси
мати кваліфікацію по системах
Основні функції Employees:
Обов’язково:
створити працівника
переглянути список працівників
відкрити деталі працівника
редагувати працівника
деактивувати працівника (active/inactive)
пошук по імені / коду
фільтр по департаменту
фільтр по active status
Далі:
показати системи, по яких працівник кваліфікований
показати сервіси, до яких працівник відноситься
показати % доступності
показати рівень кваліфікації
Основні поля Employees:
employee_code
full_name
email
role_title
department
location
availability_percent
active
notes
created_at
updated_at
2. SYSTEMS
Мета сторінки:

зберігати системи, які:

підтримуються компанією
потребують кваліфікованих людей
використовуються в сервісах
Основні функції Systems:
Обов’язково:
створити систему
переглянути список систем
відкрити деталі системи
редагувати систему
деактивувати систему
пошук по назві / коду
фільтр по environment
фільтр по sensitivity
бачити власників / owner roles
Далі:
бачити, які сервіси використовують систему
бачити, які працівники кваліфіковані по системі
бачити рівень ризику (якщо нема кваліфікованих людей)
бачити owner coverage
Основні поля Systems:
system_code
name
owner_name (тимчасово, для демо)
business_owner
technical_owner
environment
sensitivity
active
notes
created_at
updated_at
3. SERVICES
Мета сторінки:

зберігати бізнес-сервіси, які:

залежать від систем
потребують певного рівня кваліфікації
мають відповідальних людей
Основні функції Services:
Обов’язково:
створити сервіс
переглянути список сервісів
відкрити деталі сервісу
редагувати сервіс
деактивувати сервіс
пошук по назві / коду
фільтр по criticality
бачити required staffing
бачити required systems
Далі:
показати, які системи потрібні для сервісу
показати, чи достатньо кваліфікованих людей
показати staffing gap
показати critical services at risk
Основні поля Services:
service_code
name
owner_name (тимчасово)
criticality
min_qualified
preferred_qualified
active
notes
created_at
updated_at
4. ЗВ’ЯЗКИ (ОСНОВА ВСЬОГО ПРОЕКТУ)

Оце найголовніше.

Employees ↔ Systems
Через таблицю:

qualifications

Значення:

працівник має кваліфікацію по системі

Це дає:
рівень знань
бали
review date
qualification level
Services ↔ Systems
Через таблицю:

service_required_systems

Значення:

сервіс залежить від систем

Це дає:
required_level
min_score
is_critical
Services ↔ Employees
На старті:

може бути через owner_employee_id
або пізніше окрема таблиця assignment

НАЙВАЖЛИВІШИЙ ВИСНОВОК
Спочатку НЕ робимо 100 функцій.

Робимо:

MVP для 3 сторінок
MVP (що робимо першим)
Employees
список
create
edit
active/inactive
Systems
список
create
edit
active/inactive
Services
список
create
edit
active/inactive
Зв’язки
employee qualification to system
service requires system