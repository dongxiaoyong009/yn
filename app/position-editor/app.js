const state = {
  levels: [],
  levelId: 1,
  selectedId: null,
  editMode: true,
  drag: null,
  saving: false,
};

function getMinHitRadius(levelId) {
  const start = 1.8;
  const end = 0.45;
  const t = clamp((levelId - 1) / 9, 0, 1);
  return start + (end - start) * t;
}

const el = {
  levelSelect: document.getElementById('levelSelect'),
  editToggle: document.getElementById('editToggle'),
  saveBtn: document.getElementById('saveBtn'),
  itemList: document.getElementById('itemList'),
  itemForm: document.getElementById('itemForm'),
  scene: document.getElementById('scene'),
  overlay: document.getElementById('overlay'),
};

function level() {
  return state.levels.find((l) => l.id === state.levelId);
}

function selectedItem() {
  return level()?.items.find((item) => item.id === state.selectedId) || null;
}

function normalizeItem(item) {
  if (!item.hitBox) {
    const r = Number(item.hitRadius || 5);
    item.hitBox = { left: r, right: r, top: r, bottom: r, rotation: 0 };
  }
  return item;
}

function getHitBox(item) {
  return normalizeItem(item).hitBox;
}

function pctFromEvent(e) {
  const rect = el.scene.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * 100,
    y: ((e.clientY - rect.top) / rect.height) * 100,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fmt(n) {
  return Number(n).toFixed(2).replace(/\.00$/, '');
}

function renderLevelSelect() {
  el.levelSelect.innerHTML = state.levels
    .map((lvl) => `<option value="${lvl.id}">第${lvl.id}关 - ${lvl.name}</option>`)
    .join('');
  el.levelSelect.value = String(state.levelId);
}

function renderItemList() {
  const lvl = level();
  if (!lvl) return;
  const minHit = getMinHitRadius(lvl.id);
  el.itemList.innerHTML = lvl.items
    .map((item) => {
      const box = getHitBox(item);
      return `
        <button class="item-row ${item.id === state.selectedId ? 'active' : ''}" data-id="${item.id}">
          <span>${item.name}</span>
          <small>x ${fmt(item.x)} / y ${fmt(item.y)} / rot ${fmt(box.rotation)} / min ${fmt(minHit)}</small>
        </button>
      `;
    })
    .join('');
}

function renderForm() {
  const item = selectedItem();
  if (!item) {
    el.itemForm.innerHTML = '<div style="color:#9ba9bd">未选择目标物</div>';
    return;
  }
  const box = getHitBox(item);
  el.itemForm.innerHTML = `
    <label>名称<input value="${item.name}" disabled /></label>
    <div class="grid2">
      <label>X<input id="xInput" type="number" step="0.01" value="${item.x}" /></label>
      <label>Y<input id="yInput" type="number" step="0.01" value="${item.y}" /></label>
    </div>
    <div class="grid2">
      <label>左<input id="leftInput" type="number" step="0.01" value="${box.left}" /></label>
      <label>右<input id="rightInput" type="number" step="0.01" value="${box.right}" /></label>
    </div>
    <div class="grid2">
      <label>上<input id="topInput" type="number" step="0.01" value="${box.top}" /></label>
      <label>下<input id="bottomInput" type="number" step="0.01" value="${box.bottom}" /></label>
    </div>
    <label>旋转<input id="rotationInput" type="number" step="0.1" value="${box.rotation}" /></label>
  `;

  ['xInput', 'yInput', 'leftInput', 'rightInput', 'topInput', 'bottomInput', 'rotationInput'].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
      const current = selectedItem();
      if (!current) return;
      const box = getHitBox(current);
      const minHit = getMinHitRadius(state.levelId);
      current.x = clamp(Number(document.getElementById('xInput').value), 0, 100);
      current.y = clamp(Number(document.getElementById('yInput').value), 0, 100);
      box.left = clamp(Number(document.getElementById('leftInput').value), minHit, 100);
      box.right = clamp(Number(document.getElementById('rightInput').value), minHit, 100);
      box.top = clamp(Number(document.getElementById('topInput').value), minHit, 100);
      box.bottom = clamp(Number(document.getElementById('bottomInput').value), minHit, 100);
      box.rotation = Number(document.getElementById('rotationInput').value) || 0;
      renderAll();
    });
  });
}

function buildBoxStyle(item) {
  const box = getHitBox(item);
  const width = box.left + box.right;
  const height = box.top + box.bottom;
  return {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${width}%`,
    height: `${height}%`,
    transform: `translate(-50%, -50%) rotate(${box.rotation}deg)`,
  };
}

function renderScene() {
  const lvl = level();
  if (!lvl) return;
  el.scene.style.backgroundImage = `url(${lvl.background})`;
  el.overlay.innerHTML = '';

  lvl.items.forEach((item) => {
    const box = getHitBox(item);
    const node = document.createElement('div');
    node.className = `item-overlay ${item.id === state.selectedId ? 'active' : ''}`;
    node.dataset.id = item.id;
    Object.assign(node.style, buildBoxStyle(item));

    const mask = document.createElement('div');
    mask.className = 'item-mask';
    node.appendChild(mask);

    const angleLine = document.createElement('div');
    angleLine.className = 'angle-line';
    node.appendChild(angleLine);

    const center = document.createElement('div');
    center.className = 'item-center';
    center.title = '拖动中心移动';
    center.addEventListener('pointerdown', (e) => startDrag(e, item.id, 'move'));
    node.appendChild(center);

    const edges = [
      ['top', 'handle top'],
      ['right', 'handle right'],
      ['bottom', 'handle bottom'],
      ['left', 'handle left'],
    ];
    edges.forEach(([dir, cls]) => {
      const h = document.createElement('div');
      h.className = cls;
      h.title = `${dir} 边缘`;
      h.addEventListener('pointerdown', (e) => startDrag(e, item.id, dir));
      node.appendChild(h);
    });

    const rotate = document.createElement('div');
    rotate.className = 'rotate-handle';
    rotate.title = '旋转';
    rotate.addEventListener('pointerdown', (e) => startDrag(e, item.id, 'rotate'));
    node.appendChild(rotate);

    node.addEventListener('click', (e) => {
      e.stopPropagation();
      state.selectedId = item.id;
      renderAll();
    });

    el.overlay.appendChild(node);
  });
}

function renderAll() {
  renderLevelSelect();
  renderItemList();
  renderForm();
  renderScene();
}

function startDrag(e, id, mode) {
  if (!state.editMode) return;
  const item = level()?.items.find((it) => it.id === id);
  if (!item) return;
  e.preventDefault();
  e.stopPropagation();
  state.selectedId = id;
  const pointer = pctFromEvent(e);
  state.drag = {
    id,
    mode,
    startPointer: pointer,
    startItem: {
      x: item.x,
      y: item.y,
      hitBox: { ...getHitBox(item) },
    },
  };
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', stopDrag, { once: true });
}

function onDragMove(e) {
  if (!state.drag) return;
  const item = level()?.items.find((it) => it.id === state.drag.id);
  if (!item) return;
  const box = getHitBox(item);
  const pointer = pctFromEvent(e);
  const dx = pointer.x - state.drag.startPointer.x;
  const dy = pointer.y - state.drag.startPointer.y;

  if (state.drag.mode === 'move') {
    item.x = clamp(state.drag.startItem.x + dx, 0, 100);
    item.y = clamp(state.drag.startItem.y + dy, 0, 100);
  } else if (state.drag.mode === 'rotate') {
    const angle = Math.atan2(pointer.y - item.y, pointer.x - item.x) * 180 / Math.PI;
    box.rotation = angle;
  } else {
    const delta = state.drag.mode === 'left' ? -dx : state.drag.mode === 'right' ? dx : state.drag.mode === 'top' ? -dy : dy;
    const minHit = getMinHitRadius(state.levelId);
    if (state.drag.mode === 'left') box.left = clamp(state.drag.startItem.hitBox.left + delta, minHit, 100);
    if (state.drag.mode === 'right') box.right = clamp(state.drag.startItem.hitBox.right + delta, minHit, 100);
    if (state.drag.mode === 'top') box.top = clamp(state.drag.startItem.hitBox.top + delta, minHit, 100);
    if (state.drag.mode === 'bottom') box.bottom = clamp(state.drag.startItem.hitBox.bottom + delta, minHit, 100);
  }

  renderAll();
}

function stopDrag() {
  state.drag = null;
  window.removeEventListener('pointermove', onDragMove);
}

async function save() {
  if (state.saving) return;
  state.saving = true;
  setStatus('保存中...');
  try {
    const lvl = level();
    const payload = {
      levelId: lvl.id,
      items: lvl.items.map((item) => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
        image: item.image || '',
        x: item.x,
        y: item.y,
        hitRadius: item.hitRadius,
        hitBox: item.hitBox || null,
      })),
    };
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || '保存失败');
    setStatus('已写回源代码', 'ok');
  } catch (error) {
    setStatus(String(error), 'err');
  } finally {
    state.saving = false;
  }
}

function setStatus(text, type = '') {
  let box = document.querySelector('.status');
  if (!box) {
    box = document.createElement('div');
    box.className = 'status';
    document.body.appendChild(box);
  }
  box.className = `status ${type}`.trim();
  box.textContent = text;
}

function wireEvents() {
  el.levelSelect.addEventListener('change', () => {
    state.levelId = Number(el.levelSelect.value);
    state.selectedId = level()?.items[0]?.id || null;
    renderAll();
  });
  el.editToggle.addEventListener('change', () => {
    state.editMode = el.editToggle.checked;
    setStatus(state.editMode ? '编辑模式已开启' : '编辑模式已关闭');
  });
  el.saveBtn.addEventListener('click', save);
  el.itemList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (!btn) return;
    state.selectedId = btn.dataset.id;
    renderAll();
  });
  el.scene.addEventListener('click', () => {
    if (!state.editMode) return;
    state.selectedId = null;
    renderAll();
  });
}

async function init() {
  wireEvents();
  const res = await fetch('/api/levels');
  state.levels = (await res.json()).map((lvl) => ({
    ...lvl,
    items: lvl.items.map((item) => normalizeItem(item)),
  }));
  state.levelId = state.levels[0]?.id || 1;
  state.selectedId = level()?.items[0]?.id || null;
  renderAll();
  setStatus('已加载关卡数据');
}

init().catch((error) => setStatus(String(error), 'err'));
