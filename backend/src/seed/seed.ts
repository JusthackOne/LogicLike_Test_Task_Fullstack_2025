import { pool } from "../db/pool.js";

const ideasSeed = [
  { title: "Геймификация уроков логики", description: "Добавить уровни, награды и квесты." },
  { title: "Режим для родителей", description: "Прогресс ребенка, советы и отчеты." },
  { title: "Соревновательные турниры", description: "Еженедельные турниры по логике." },
  { title: "Оффлайн режим", description: "Возможность решать задания без интернета." },
  { title: "Интеграция с классом", description: "Групповые занятия и рейтинг класса." },
  { title: "Новые типы задач", description: "Добавить визуальные головоломки и судоку." },
  { title: "Адаптивная сложность", description: "Автонастройка сложности под ученика." },
  { title: "Поддержка нескольких языков", description: "Локализации для новых рынков." },
  { title: "Достижения и бейджи", description: "Система достижений, делиться с друзьями." },
  { title: "Голосовой помощник", description: "Подсказки и объяснения голосом." },
];

export async function seed() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS cnt FROM ideas");
  const count = Number(rows[0].cnt);
  if (count > 0) {
    console.log("Seed skipped: ideas table is not empty");
    return;
  }

  for (const idea of ideasSeed) {
    await pool.query("INSERT INTO ideas (title, description) VALUES ($1, $2)", [idea.title, idea.description]);
  }
  console.log("Seed complete: added ideas");
}

if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  seed()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
