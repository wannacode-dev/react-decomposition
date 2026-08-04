import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Тесты курса. Один файл на задание: tests/NN.test.jsx импортирует
// src/NN-….проблема.jsx, поэтому до решения задачи он красный — это и есть
// «задание не сделано». Копию с импортом решения генерит
// scripts/generate-play-commands.mjs (tests/NN.solution.test.jsx).
export default defineConfig({
    plugins: [react()],
    test: {
        include: ['tests/**/*.test.jsx'],
        // Компоненты рендерим по-настоящему, поэтому нужен DOM.
        //
        // happy-dom, а не jsdom: этот же тест платформа гоняет внутри браузерной
        // Node-IDE, а jsdom туда не заезжает — он поднимает window через
        // настоящий изолированный VM-контекст (`vm.runInContext` +
        // `Object.setPrototypeOf` на глобальном объекте), которого в Web Worker
        // не бывает. happy-dom — чистый JS и работает и там, и локально.
        environment: 'happy-dom',
        // jest-dom матчеры (toBeInTheDocument, toHaveClass) и авто-очистка
        // между тестами — иначе соседние render() видят чужой DOM.
        setupFiles: ['./tests/setup.js'],
        // Задания импортируют './style.css' — в тестах его грузить нечем и незачем.
        css: false,
    },
});
