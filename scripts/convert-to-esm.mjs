/**
 * Скрипт конвертации файлов курса в стандартный ESM формат
 * 
 * Что делает:
 * - Добавляет import React from 'react'
 * - Добавляет import ReactDOM from 'react-dom/client'
 * - Заменяет const { useState, useEffect, ... } = React на импорты
 * 
 * Запуск: node scripts/convert-to-esm.mjs
 */

import { promises as fs } from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Счётчики для статистики
let totalFiles = 0;
let convertedFiles = 0;
let skippedFiles = 0;
let errorFiles = 0;

/**
 * Рекурсивно собираем все файлы
 */
async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

/**
 * Проверяем, является ли файл файлом упражнения
 */
function isTaskFile(filePath) {
  const base = path.basename(filePath);
  return /\.(проблема|решение)\.(jsx|tsx)$/i.test(base);
}

/**
 * Извлекаем хуки из строки типа "const { useState, useEffect } = React"
 */
function extractHooksFromDestructuring(code) {
  const hooks = [];
  
  // Паттерн: const { hook1, hook2, ... } = React
  const pattern = /const\s*\{\s*([^}]+)\s*\}\s*=\s*React\s*;?/g;
  let match;
  
  while ((match = pattern.exec(code)) !== null) {
    const hookList = match[1];
    const extracted = hookList
      .split(',')
      .map(h => h.trim())
      .filter(h => h && !h.includes(':'));  // Исключаем алиасы типа useState: myState
    hooks.push(...extracted);
  }
  
  return [...new Set(hooks)]; // Убираем дубликаты
}

/**
 * Конвертируем файл в ESM формат
 */
function convertToESM(code, filePath) {
  // Проверяем, уже ли есть импорты React
  const hasReactImport = /import\s+.*from\s+['"]react['"]/.test(code);
  const hasReactDOMImport = /import\s+.*from\s+['"]react-dom\/client['"]/.test(code);
  
  if (hasReactImport && hasReactDOMImport) {
    return { code, changed: false, reason: 'уже есть импорты' };
  }
  
  // Извлекаем хуки из деструктуризации
  const hooks = extractHooksFromDestructuring(code);
  
  // Определяем что нужно импортировать
  const needsReact = !hasReactImport && (
    code.includes('React.') ||
    code.includes('<') ||  // JSX
    hooks.length > 0
  );
  
  const needsReactDOM = !hasReactDOMImport && (
    code.includes('ReactDOM.') ||
    code.includes('createRoot')
  );
  
  if (!needsReact && !needsReactDOM) {
    return { code, changed: false, reason: 'не использует React' };
  }
  
  let newCode = code;
  const imports = [];
  
  // Формируем импорт React
  if (needsReact) {
    if (hooks.length > 0) {
      imports.push(`import React, { ${hooks.join(', ')} } from 'react';`);
    } else {
      imports.push(`import React from 'react';`);
    }
  }
  
  // Формируем импорт ReactDOM
  if (needsReactDOM) {
    imports.push(`import ReactDOM from 'react-dom/client';`);
  }
  
  // Удаляем старые деструктуризации типа "const { useState } = React;"
  newCode = newCode.replace(/const\s*\{\s*[^}]+\s*\}\s*=\s*React\s*;?\s*\n?/g, '');
  
  // Находим позицию для вставки импортов
  // Ищем первый import или начало файла
  const firstImportMatch = newCode.match(/^import\s+/m);
  
  if (firstImportMatch) {
    // Вставляем перед первым импортом
    const insertPos = newCode.indexOf(firstImportMatch[0]);
    newCode = newCode.slice(0, insertPos) + imports.join('\n') + '\n' + newCode.slice(insertPos);
  } else {
    // Вставляем в начало файла
    newCode = imports.join('\n') + '\n\n' + newCode.trimStart();
  }
  
  // Убираем лишние пустые строки в начале
  newCode = newCode.replace(/^\n+/, '');
  
  return { code: newCode, changed: true, hooks };
}

/**
 * Обрабатываем один файл
 */
async function processFile(filePath) {
  totalFiles++;
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const result = convertToESM(content, filePath);
    
    if (result.changed) {
      await fs.writeFile(filePath, result.code, 'utf8');
      convertedFiles++;
      const relativePath = path.relative(PROJECT_ROOT, filePath);
      const hooksInfo = result.hooks?.length ? ` (хуки: ${result.hooks.join(', ')})` : '';
      console.log(`✅ ${relativePath}${hooksInfo}`);
    } else {
      skippedFiles++;
      const relativePath = path.relative(PROJECT_ROOT, filePath);
      console.log(`⏭️  ${relativePath} — ${result.reason}`);
    }
  } catch (error) {
    errorFiles++;
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    console.error(`❌ ${relativePath} — ошибка: ${error.message}`);
  }
}

/**
 * Главная функция
 */
async function main() {
  console.log('🔄 Конвертация файлов курса в ESM формат...\n');
  console.log(`📁 Папка: ${SRC_DIR}\n`);
  
  try {
    await fs.access(SRC_DIR);
  } catch {
    console.error('❌ Папка src не найдена');
    process.exit(1);
  }
  
  // Собираем все файлы
  const allFiles = await collectFiles(SRC_DIR);
  const taskFiles = allFiles.filter(isTaskFile);
  
  console.log(`📋 Найдено файлов упражнений: ${taskFiles.length}\n`);
  console.log('─'.repeat(60) + '\n');
  
  // Обрабатываем каждый файл
  for (const file of taskFiles) {
    await processFile(file);
  }
  
  // Выводим статистику
  console.log('\n' + '─'.repeat(60));
  console.log('\n📊 Результаты:\n');
  console.log(`   Всего файлов:      ${totalFiles}`);
  console.log(`   Конвертировано:    ${convertedFiles}`);
  console.log(`   Пропущено:         ${skippedFiles}`);
  if (errorFiles > 0) {
    console.log(`   Ошибки:            ${errorFiles}`);
  }
  console.log('\n✨ Готово!\n');
  
  if (convertedFiles > 0) {
    console.log('📝 Теперь файлы работают:');
    console.log('   • Локально через npm run task:XX-XX');
    console.log('   • В Sandpack (браузер)');
    console.log('   • В CodeSandbox');
    console.log('   • В StackBlitz\n');
  }
}

main().catch((e) => {
  console.error('❌ Критическая ошибка:', e);
  process.exit(1);
});

