export interface TeacherSopEntry {
  name: string
  subjects: string[]
  interest: number
  delivery: number
  feedback: number
  comfort: number
  overall: number
  responseCount: number
}

// Aggregated from real СОП (student -> teacher survey) responses, ноябрь 2025.
// Criteria: интерес занятия / подача и объяснение материала / обратная связь и ответы на вопросы / доброжелательность и комфорт.
export const TEACHER_SOP: TeacherSopEntry[] = [
  { name: 'Рыжаков Сергей', subjects: ['Язык программирования С#'], interest: 5.0, delivery: 5.0, feedback: 5.0, comfort: 5.0, overall: 5.0, responseCount: 1 },
  { name: 'Трубников Алексей', subjects: ['UX\\UI. Проект'], interest: 5.0, delivery: 5.0, feedback: 5.0, comfort: 5.0, overall: 5.0, responseCount: 1 },
  { name: 'Горчев Артём', subjects: ['HTML/CSS', 'JavaScript', 'MS SQL', 'Web-компоненты', 'XML технологии', 'Введение в DevSecOps', 'Введение в фреймворки JavaScript', 'Моделирование данных', 'Основы HTML/CSS', 'Основы Linux', 'Основы визуализации данных', 'Управление веб-серверами'], interest: 5.0, delivery: 4.97, feedback: 4.96, comfort: 5.0, overall: 4.98, responseCount: 13 },
  { name: 'Алина Дорожнина', subjects: ['Product-менеджмент', 'Ит-предпринимательство', 'Основы менеджмента', 'Системный анализ и проектирование ИС'], interest: 4.5, delivery: 5.0, feedback: 5.0, comfort: 5.0, overall: 4.88, responseCount: 4 },
  { name: 'Гасанова Лале', subjects: ['Литература. Сторителлинг и самопрезентация', 'Русский язык. Коммуникативные практики'], interest: 4.82, delivery: 4.65, feedback: 4.82, comfort: 4.82, overall: 4.78, responseCount: 4 },
  { name: 'Мамаева Елена', subjects: ['История изобразительного искусства'], interest: 4.63, delivery: 5.0, feedback: 4.75, comfort: 4.69, overall: 4.77, responseCount: 2 },
  { name: 'Козлова Александра', subjects: ['Литература. Сторителлинг и самопрезентация', 'Русский язык. Коммуникативные практики'], interest: 4.75, delivery: 4.64, feedback: 4.85, comfort: 4.78, overall: 4.75, responseCount: 10 },
  { name: 'Лобаков Никита', subjects: ['Менеджмент веб-проектов', 'Основы графического дизайна: визуальные коммуникации', 'Создание протопипов в Figma'], interest: 4.77, delivery: 4.73, feedback: 4.77, comfort: 4.73, overall: 4.75, responseCount: 3 },
  { name: 'Юшин Алексей', subjects: ['Тестирование. Проектирование тестов'], interest: 4.5, delivery: 4.5, feedback: 5.0, comfort: 5.0, overall: 4.75, responseCount: 1 },
  { name: 'Голик Сергей', subjects: ['Дискретная математика', 'Математика', 'Математика (обяз.Дискретка)'], interest: 4.6, delivery: 4.47, feedback: 4.92, comfort: 4.93, overall: 4.73, responseCount: 6 },
  { name: 'Кокоева Елена', subjects: ['Живопись с основами /Скетчинг.Развитие креативных навыков', 'Основы визуальной коммуникации. Колористика. Композиция.', 'Рисунок в дизайн-процессе'], interest: 4.59, delivery: 4.67, feedback: 4.85, comfort: 4.74, overall: 4.71, responseCount: 7 },
  { name: 'Продан Габриела', subjects: ['Веб-разработка сайтов на конструкторе Tilda', 'Векторная графика: техники и приемы.Adobe Illustrator', 'Дизайн в рекламной деятельности', 'Информационные технологии в современном мире', 'Растровая графика: инструменты и методы. Adobe Photoshop', 'Самопрезентация на профессиональных площадках. Портфолио'], interest: 4.69, delivery: 4.67, feedback: 4.77, comfort: 4.71, overall: 4.71, responseCount: 8 },
  { name: 'Гасанова Чинара', subjects: ['Личное и профессиональное развитие', 'Развитие эмоционального интеллекта'], interest: 4.63, delivery: 4.6, feedback: 4.69, comfort: 4.66, overall: 4.64, responseCount: 6 },
  { name: 'Лосев Александр', subjects: ['Prompt-Engineering для ИИ', 'Алгоритмы и структуры данных', 'Информатика (обязательна - часть дискретной)', 'Основы анализа и проектирования баз данных', 'Фронтенд-разработка для веб-дизайнеров: HTML, CSS, JavaScript'], interest: 4.52, delivery: 4.37, feedback: 4.64, comfort: 4.68, overall: 4.55, responseCount: 7 },
  { name: 'Германенко Евгений', subjects: ['3D-моделирование: основы и практика в Blender', 'SMM стратегии', 'Бизнес в сфере креативных индустрий', 'Введение в интернет-маркетинг', 'Копирайтинг', 'Маркетинговые исследования', 'Основы ОС и комп сети', 'Основы маркетинга', 'Основы управления проектами', 'Продвинутый курс по созданию 3D графики. Blender', 'Решение прикладных задач'], interest: 4.5, delivery: 4.49, feedback: 4.66, comfort: 4.51, overall: 4.54, responseCount: 18 },
  { name: 'Ткаченко Нина', subjects: ['Бизнес-анализ', 'Проектный контрактинг', 'Управление инновационными проектами', 'Экономика предприятия'], interest: 3.38, delivery: 4.5, feedback: 5.0, comfort: 5.0, overall: 4.47, responseCount: 4 },
  { name: 'Вахромеев Дмитрий', subjects: ['Основы контекстной рекламы', 'Таргетированная реклама'], interest: 4.2, delivery: 4.0, feedback: 4.5, comfort: 4.9, overall: 4.4, responseCount: 2 },
  { name: 'Боков Алексей', subjects: ['Введение в программирование', 'ООП на С#', 'Тестирование. Проектирование тестов'], interest: 4.28, delivery: 4.19, feedback: 4.55, comfort: 4.55, overall: 4.39, responseCount: 3 },
  { name: 'Шталенков Алексей', subjects: ['Базовые навыки и техники нелинейного монтажа .  Adobe Premiere', 'Основы анимации и пост-обработка After Effects', 'Создание анимации в After Effects'], interest: 4.29, delivery: 4.39, feedback: 4.36, comfort: 4.4, overall: 4.36, responseCount: 3 },
  { name: 'Боллоев Наздар', subjects: ['Windows. Продвинутый уровень', 'Архитектура информационной системы предприятия', 'Веб-аналитика', 'Основы работы с технической документацией', 'Скриптовые языки программирования'], interest: 4.04, delivery: 4.16, feedback: 4.66, comfort: 4.48, overall: 4.33, responseCount: 7 },
  { name: 'Талько Юлия', subjects: ['Компьютерные сети', 'Математика', 'Математическая логика и теория алгоритмов', 'Основы информационной безопасности', 'Основы электротехники', 'Элементы высшей математики'], interest: 3.99, delivery: 4.0, feedback: 4.65, comfort: 4.5, overall: 4.29, responseCount: 13 },
  { name: 'Боколяр Константин', subjects: ['Введение в управление проектами'], interest: 4.22, delivery: 4.11, feedback: 4.22, comfort: 4.55, overall: 4.28, responseCount: 3 },
  { name: 'Инкогнито', subjects: ['Английский язык', 'Физическая культура'], interest: 4.12, delivery: 4.16, feedback: 4.19, comfort: 4.2, overall: 4.17, responseCount: 29 },
  { name: 'Тюханова Александра', subjects: ['История', 'Цифровая экономика', 'Экономика'], interest: 3.76, delivery: 3.91, feedback: 4.34, comfort: 3.85, overall: 3.96, responseCount: 9 },
  { name: 'Маркова Эльвира', subjects: ['Правовые аспекты работы цифрового дизайнера'], interest: 3.6, delivery: 3.6, feedback: 4.0, comfort: 4.0, overall: 3.8, responseCount: 1 },
  { name: 'Моисеева Анастасия', subjects: ['Личное и профессиональное развитие', 'Психология деловых коммуникаций', 'Развитие эмоционального интеллекта'], interest: 3.31, delivery: 3.93, feedback: 3.94, comfort: 3.71, overall: 3.72, responseCount: 9 },
  { name: 'Богатенко Елизавета', subjects: ['Time management. Мастерство самоорганизаци', 'Web-design', 'Введение в web-design: от идеи до макета'], interest: 3.16, delivery: 4.11, feedback: 3.6, comfort: 3.96, overall: 3.71, responseCount: 3 },
  { name: 'Каменев Валерий', subjects: ['Технические средства защиты информации'], interest: 3.25, delivery: 3.5, feedback: 3.75, comfort: 4.0, overall: 3.62, responseCount: 1 },
  { name: 'Медведева Анастасия', subjects: ['Дизайн взаимодействия пользователя с интерфейсом', 'Информационные технологии в современном мире', 'Основные принципы UX/UI для фронтенд-разработки', 'Создание растровой и векторной графики. Adobe Illustrator, Adobe Photoshop'], interest: 3.33, delivery: 3.4, feedback: 3.6, comfort: 3.94, overall: 3.57, responseCount: 8 },
  { name: 'Харитонова Анастасия', subjects: ['Веб-разработка сайтов на конструкторе Tilda'], interest: 2.0, delivery: 1.6, feedback: 1.6, comfort: 2.33, overall: 1.88, responseCount: 1 },
]
