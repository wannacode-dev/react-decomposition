// Структурные проверки для заданий-рефакторингов.
//
// Зачем. В этом курсе «проблема» и «решение» рисуют ОДИН И ТОТ ЖЕ экран: задание
// не в том, чтобы поменять поведение, а в том, чтобы перестать прокидывать пропсы
// через всё дерево. Обычный тест на DOM тут зелёный ещё до решения — поэтому
// рядом с поведенческими проверками нужны структурные: кто какие пропсы получает
// и на сколько компонентов разбит экран.
//
// Дерево смотрим через react-test-renderer: он рендерит без DOM и даёт доступ к
// самим компонентам, а не только к их разметке. Имена компонентов НЕ проверяем —
// студент вправе назвать их по-своему; проверяем факты («никто не получает проп
// user», «экран собран минимум из трёх компонентов»), которые от названий не
// зависят.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import TestRenderer from 'react-test-renderer';

const MEMO = Symbol.for('react.memo');
const FORWARD_REF = Symbol.for('react.forward_ref');

/** Компонент это или host-элемент (div, button…). memo/forwardRef тоже компоненты. */
function isComponentType(type) {
    if (typeof type === 'function') return true;
    return Boolean(type) && (type.$$typeof === MEMO || type.$$typeof === FORWARD_REF);
}

function nameOf(instance) {
    const type = instance.type;
    if (typeof type === 'function') return type.displayName || type.name || '(аноним)';
    const inner = type?.type ?? type?.render;
    return type?.displayName || inner?.displayName || inner?.name || '(аноним)';
}

/** Рендерит дерево без DOM и отдаёт корень для структурных проверок. */
export function renderTree(element) {
    let renderer;
    TestRenderer.act(() => {
        renderer = TestRenderer.create(element);
    });
    return renderer.root;
}

/**
 * Все компоненты внутри дерева — без host-элементов (div, button…). Сам корневой
 * компонент не считается: он и есть то, что мы разбираем на части.
 */
export function components(root) {
    return root.findAll((node) => isComponentType(node.type)).filter((node) => node !== root);
}

/**
 * Разные ТИПЫ компонентов в дереве. Именно это отвечает на вопрос «на сколько
 * частей разбит экран»: один компонент, отрисованный десять раз, — всё ещё один
 * компонент, а считать по именам нельзя (анонимные схлопнулись бы в одно).
 */
export function componentTypes(root) {
    return [...new Set(components(root).map((c) => c.type))];
}

/** Имена компонентов в дереве — по разу каждое. Для отладочного вывода. */
export function componentNames(root) {
    return [...new Set(components(root).map(nameOf))];
}

/**
 * Компоненты, которым передали проп с таким именем. Пустой массив = проп через
 * дерево больше не тащат.
 */
export function componentsWithProp(root, prop) {
    return components(root).filter((c) =>
        Object.prototype.hasOwnProperty.call(c.props ?? {}, prop)
    );
}

/** Имена компонентов, получивших проп, — попадают в текст ошибки, так понятнее. */
export function namesWithProp(root, prop) {
    return componentsWithProp(root, prop).map(nameOf);
}

/**
 * Исходник задания как текст. Путь — от корня курса: readSource('src/09-….проблема.jsx').
 *
 * Нужен там, где требование — про сам код, а не про дерево: «перепиши
 * Context.Consumer на useContext», «оберни строку в React.memo». В отрендеренном
 * дереве такие вещи неразличимы — React показывает результат, а не способ, каким
 * его получили.
 *
 * От корня, а не через import.meta.url: тесты идут в DOM-окружении, где Vite
 * подставляет в import.meta.url браузерный адрес, и readFileSync его не примет.
 */
export function readSource(relativePath) {
    return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}
