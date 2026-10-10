
/* =================================
   JOBFINDER — JAVASCRIPT
   ================================= */

// Получаем элементы сайта
const searchInput = document.getElementById("job-query");
const citySelect = document.getElementById("city-filter");
const resultsLabel = document.getElementById("results-label");
const emptyState = document.getElementById("empty-state");
const toast = document.getElementById("toast");

// Все карточки вакансий
const jobCards = [
    ...document.querySelectorAll(".job-card")
];

// Активная категория
let activeCategory = "";


/* =================================
   ПОИСК ВАКАНСИЙ
   ================================= */

function filterJobs() {
    const query = searchInput.value
        .trim()
        .toLocaleLowerCase("ru");

    const selectedCity = citySelect.value;

    let visibleCount = 0;

    jobCards.forEach(card => {
        const title = (
            card.dataset.title || ""
        ).toLocaleLowerCase("ru");

        const company = (
            card.querySelector(".company")?.textContent || ""
        ).toLocaleLowerCase("ru");

        const category = card.dataset.category || "";
        const city = card.dataset.city || "";

        const matchesQuery =
            !query ||
            title.includes(query) ||
            company.includes(query);

        const matchesCity =
            !selectedCity ||
            city === selectedCity;

        const matchesCategory =
            !activeCategory ||
            category === activeCategory;

        const isVisible =
            matchesQuery &&
            matchesCity &&
            matchesCategory;

        card.style.display = isVisible ? "" : "none";

        if (isVisible) {
            visibleCount++;
        }
    });

    // Обновляем количество результатов
    if (resultsLabel) {
        resultsLabel.textContent =
            `Найдено вакансий: ${visibleCount}`;
    }

    // Показываем сообщение, если результатов нет
    if (emptyState) {
        emptyState.hidden = visibleCount > 0;
    }
}


/* =================================
   ПОИСК ПО КЛАВИШЕ ENTER
   ================================= */

if (searchInput) {
    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            filterJobs();
        }
    });

    searchInput.addEventListener("input", filterJobs);
}

if (citySelect) {
    citySelect.addEventListener("change", filterJobs);
}


/* =================================
   ФИЛЬТР ПО КАТЕГОРИЯМ
   ================================= */

function chooseCategory(category) {
    // Повторное нажатие отключает фильтр
    activeCategory =
        activeCategory === category ? "" : category;

    // Подсвечиваем выбранную категорию
    document.querySelectorAll(".category-card")
        .forEach(card => {
            const title =
                card.querySelector("h3")?.textContent.trim();

            card.classList.toggle(
                "active",
                title === activeCategory
            );
        });

    filterJobs();

    document.getElementById("jobs")
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
}


/* =================================
   СБРОС ФИЛЬТРОВ
   ================================= */

function resetFilters() {
    if (searchInput) {
        searchInput.value = "";
    }

    if (citySelect) {
        citySelect.value = "";
    }

    activeCategory = "";

    document.querySelectorAll(".category-card")
        .forEach(card => {
            card.classList.remove("active");
        });

    filterJobs();
}


/* =================================
   ПЛАВНЫЙ ПЕРЕХОД К ВАКАНСИЯМ
   ================================= */

function scrollToJobs() {
    document.getElementById("jobs")
        ?.scrollIntoView({
            behavior: "smooth"
        });
}


/* =================================
   ИЗБРАННОЕ
   ================================= */

function toggleSave(button) {
    const isSaved = button.classList.toggle("saved");

    button.textContent = isSaved ? "♥" : "♡";

    button.setAttribute(
        "aria-pressed",
        String(isSaved)
    );

    showToast(
        isSaved
            ? "Вакансия добавлена в избранное ❤️"
            : "Вакансия удалена из избранного"
    );
}


/* =================================
   ОТКЛИК НА ВАКАНСИЮ
   ================================= */

function applyJob(title) {
    showToast(
        `Вы выбрали вакансию «${title}». ` +
        "Для отправки настоящего отклика нужно подключить аккаунт."
    );
}


/* =================================
   УВЕДОМЛЕНИЯ
   ================================= */

let toastTimer;

function showToast(message) {
    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* =================================
   КНОПКА РАБОТОДАТЕЛЯ
   ================================= */

function openEmployerForm() {
    showToast(
        "Размещение вакансий появится после подключения сервера."
    );
}


/* =================================
   ЗАПУСК
   ================================= */

document.addEventListener("DOMContentLoaded", () => {
    filterJobs();

    console.log(
        "JobFinder запущен! 🚀"
    );
});
