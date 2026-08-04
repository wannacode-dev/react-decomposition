// Общая настройка тестов курса. Подключается из vitest.config.js.

// Матчеры вроде toBeInTheDocument() / toHaveClass() — читаются понятнее, чем
// ручные проверки, и в отчёте дают внятное сообщение об ошибке.
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// React рендерит в document.body и сам за собой не убирает: без этого
// следующий тест нашёл бы в DOM компонент из предыдущего.
afterEach(cleanup);
