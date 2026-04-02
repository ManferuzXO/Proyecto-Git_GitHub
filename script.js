

// ════════ TABS ════════
function switchTab(e, id) {
  const section = e.target.closest('section') || document;
  section.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  section.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById(id).classList.add('active');
}

// ════════ TERMINAL SIMULATOR ════════
const repoState = {
  initialized: false,
  staged: [],
  commits: [],
  branches: { main: [], 'feature/login': null, 'feature/registro': null },
  currentBranch: 'main',
  remoteAdded: false,
  pushed: false,
};

const quickCmds = [
  'git init', 'git status', 'git add .', 'git add README.md',
  'git commit -m "feat: inicio"', 'git log --oneline', 'git branch',
  'git switch -c feature/login', 'git switch main',
  'git merge feature/login', 'git remote -v', 'git diff', 'help', 'clear'
];

const output = document.getElementById('termOutput');
const input = document.getElementById('termInput');

function appendLine(text, cls = '') {
  const d = document.createElement('div');
  d.innerHTML = text;
  if (cls) d.className = cls;
  d.style.fontFamily = "'JetBrains Mono', monospace";
  d.style.fontSize = '0.82rem';
  d.style.lineHeight = '1.9';
  output.appendChild(d);
  output.scrollTop = output.scrollHeight;
}

function prompt(extra = '') {
  return `<span style="color:var(--green)">user@git-sim</span><span style="color:var(--blue)">:~/repo</span><span style="color:var(--purple)"> (${repoState.currentBranch})</span><span style="color:var(--text)"> $ ${extra}</span>`;
}

function runCommand(cmd) {
  if (!cmd.trim()) return;
  appendLine(prompt(cmd));
  const c = cmd.trim();
  const parts = c.split(' ').filter(Boolean);

  if (c === 'clear' || c === 'cls') { output.innerHTML = ''; welcome(); return; }
  if (c === 'help') { showHelp(); return; }

  if (parts[0] !== 'git') {
    appendLine(`<span style="color:var(--red)">bash: ${parts[0]}: command not found</span>`);
    appendLine(`<span style="color:var(--text-muted)">Tip: escribe comandos git o "help"</span>`);
    return;
  }

  const sub = parts[1];

  // ── git init
  if (sub === 'init') {
    repoState.initialized = true;
    appendLine(`<span style="color:var(--green)">Initialized empty Git repository in ~/repo/.git/</span>`);
    return;
  }

  if (!repoState.initialized && sub !== 'config') {
    appendLine(`<span style="color:var(--red)">fatal: not a git repository. Primero ejecuta: git init</span>`);
    return;
  }

  // ── git status
  if (sub === 'status') {
    appendLine(`<span style="color:var(--yellow)">On branch ${repoState.currentBranch}</span>`);
    if (repoState.commits.length === 0) {
      appendLine(`<span style="color:var(--text-dim)">No commits yet</span>`);
    }
    if (repoState.staged.length > 0) {
      appendLine(`<span style="color:var(--green)">Changes to be committed:</span>`);
      repoState.staged.forEach(f => appendLine(`<span style="color:var(--green)">        new file: ${f}</span>`));
    } else {
      appendLine(`<span style="color:var(--text-dim)">nothing to commit</span>`);
    }
    if (repoState.staged.length === 0 && repoState.commits.length === 0) {
      appendLine(`<span style="color:var(--red)">Untracked files: README.md, src/app.py</span>`);
      appendLine(`<span style="color:var(--text-muted)">(use "git add &lt;file&gt;" to include in commit)</span>`);
    }
    return;
  }

  // ── git add
  if (sub === 'add') {
    const file = parts[2];
    if (!file) { appendLine(`<span style="color:var(--red)">Nothing specified, nothing added.</span>`); return; }
    if (file === '.') {
      repoState.staged = ['README.md', 'src/app.py'];
      appendLine(`<span style="color:var(--green)">✓ 2 archivos añadidos al staging area</span>`);
    } else {
      if (!repoState.staged.includes(file)) repoState.staged.push(file);
      appendLine(`<span style="color:var(--green)">✓ ${file} añadido al staging area</span>`);
    }
    return;
  }

  // ── git commit
  if (sub === 'commit') {
    if (repoState.staged.length === 0) {
      appendLine(`<span style="color:var(--red)">nothing to commit, working tree clean</span>`);
      return;
    }
    const mIdx = parts.indexOf('-m');
    let msg = mIdx !== -1 ? parts.slice(mIdx + 1).join(' ').replace(/"/g, '') : 'commit sin mensaje';
    const hash = Math.random().toString(36).substring(2, 9);
    const commit = { hash, msg, files: [...repoState.staged], branch: repoState.currentBranch };
    repoState.commits.push(commit);
    repoState.staged = [];
    appendLine(`<span style="color:var(--green)">[${repoState.currentBranch} ${hash}] ${msg}</span>`);
    appendLine(`<span style="color:var(--text-dim)"> ${commit.files.length} file(s) changed</span>`);
    return;
  }

  // ── git log
  if (sub === 'log') {
    const oneline = parts.includes('--oneline');
    const graph = parts.includes('--graph');
    if (repoState.commits.length === 0) {
      appendLine(`<span style="color:var(--text-muted)">fatal: your current branch has no commits yet</span>`);
      return;
    }
    if (graph) {
      appendLine(`<span style="color:var(--green)">* ${repoState.commits[repoState.commits.length-1].hash} (HEAD -> ${repoState.currentBranch}) ${repoState.commits[repoState.commits.length-1].msg}</span>`);
      if (repoState.commits.length > 1) {
        repoState.commits.slice(0, -1).reverse().forEach(c => {
          appendLine(`<span style="color:var(--green)">* ${c.hash} ${c.msg}</span>`);
        });
      }
    } else {
      [...repoState.commits].reverse().forEach((c, i) => {
        if (oneline) {
          const head = i === 0 ? ` <span style="color:var(--yellow)">(HEAD -> ${repoState.currentBranch})</span>` : '';
          appendLine(`<span style="color:var(--yellow)">${c.hash}</span>${head} <span style="color:var(--text-dim)">${c.msg}</span>`);
        } else {
          appendLine(`<span style="color:var(--yellow)">commit ${c.hash}...</span>`);
          appendLine(`<span style="color:var(--text-dim)">Author: user &lt;user@email.com&gt;</span>`);
          appendLine(`<span style="color:var(--text-dim)">Date:   ${new Date().toUTCString()}</span>`);
          appendLine(`<span style="color:var(--text)">    ${c.msg}</span>`);
          appendLine('');
        }
      });
    }
    return;
  }

  // ── git branch
  if (sub === 'branch') {
    const flag = parts[2];
    if (!flag || flag === '-a') {
      Object.keys(repoState.branches).forEach(b => {
        const active = b === repoState.currentBranch;
        appendLine(`<span style="color:${active ? 'var(--green)' : 'var(--text-dim)'}">${active ? '* ' : '  '}${b}</span>`);
      });
      if (flag === '-a') {
        appendLine(`<span style="color:var(--text-muted)">  remotes/origin/main</span>`);
      }
    } else if (!flag.startsWith('-')) {
      repoState.branches[flag] = [];
      appendLine(`<span style="color:var(--green)">✓ Rama '${flag}' creada</span>`);
    } else if (flag === '-d' || flag === '-D') {
      const br = parts[3];
      if (br === 'main') { appendLine(`<span style="color:var(--red)">error: Cannot delete branch 'main'</span>`); return; }
      if (repoState.branches[br]) {
        delete repoState.branches[br];
        appendLine(`<span style="color:var(--green)">Deleted branch ${br}</span>`);
      } else {
        appendLine(`<span style="color:var(--red)">error: branch '${br}' not found.</span>`);
      }
    }
    return;
  }

  // ── git switch / checkout
  if (sub === 'switch' || sub === 'checkout') {
    const createFlag = parts.includes('-c') || parts.includes('-b');
    const brName = parts[parts.length - 1];
    if (createFlag) {
      repoState.branches[brName] = [];
      repoState.currentBranch = brName;
      appendLine(`<span style="color:var(--green)">Switched to a new branch '${brName}'</span>`);
    } else if (repoState.branches[brName] !== undefined) {
      repoState.currentBranch = brName;
      appendLine(`<span style="color:var(--green)">Switched to branch '${brName}'</span>`);
    } else {
      appendLine(`<span style="color:var(--red)">error: pathspec '${brName}' did not match any branch</span>`);
    }
    return;
  }

  // ── git merge
  if (sub === 'merge') {
    const br = parts[2];
    if (!br) { appendLine(`<span style="color:var(--red)">fatal: No branch specified</span>`); return; }
    if (!repoState.branches[br]) { appendLine(`<span style="color:var(--red)">merge: ${br} - not something we can merge</span>`); return; }
    const hash = Math.random().toString(36).substring(2, 9);
    appendLine(`<span style="color:var(--green)">Merge made by the 'ort' strategy.</span>`);
    appendLine(`<span style="color:var(--green)">[${repoState.currentBranch} ${hash}] Merge branch '${br}'</span>`);
    return;
  }

  // ── git remote
  if (sub === 'remote') {
    const flag = parts[2];
    if (flag === 'add') {
      repoState.remoteAdded = true;
      appendLine(`<span style="color:var(--green)">✓ Remoto '${parts[3]}' agregado: ${parts[4] || 'git@github.com:user/repo.git'}</span>`);
    } else if (flag === '-v' || !flag) {
      if (repoState.remoteAdded) {
        appendLine(`<span style="color:var(--blue)">origin  git@github.com:user/repo.git (fetch)</span>`);
        appendLine(`<span style="color:var(--blue)">origin  git@github.com:user/repo.git (push)</span>`);
      } else {
        appendLine(`<span style="color:var(--text-muted)">(no remotes configured — usa: git remote add origin &lt;url&gt;)</span>`);
      }
    }
    return;
  }

  // ── git push
  if (sub === 'push') {
    if (!repoState.remoteAdded) {
      appendLine(`<span style="color:var(--red)">fatal: 'origin' does not appear to be a git repository</span>`);
      return;
    }
    if (repoState.commits.length === 0) {
      appendLine(`<span style="color:var(--red)">error: src refspec main does not match any</span>`);
      return;
    }
    repoState.pushed = true;
    appendLine(`<span style="color:var(--text-dim)">Enumerating objects: ${repoState.commits.length * 3}, done.</span>`);
    appendLine(`<span style="color:var(--text-dim)">Counting objects: 100% (${repoState.commits.length * 3}/${repoState.commits.length * 3}), done.</span>`);
    appendLine(`<span style="color:var(--green)">To github.com:user/repo.git</span>`);
    appendLine(`<span style="color:var(--green)"> * [new branch]      ${repoState.currentBranch} -> ${repoState.currentBranch}</span>`);
    if (parts.includes('-u')) appendLine(`<span style="color:var(--green)">Branch '${repoState.currentBranch}' set up to track remote branch '${repoState.currentBranch}' from 'origin'.</span>`);
    return;
  }

  // ── git pull
  if (sub === 'pull') {
    appendLine(`<span style="color:var(--text-dim)">From github.com:user/repo</span>`);
    appendLine(`<span style="color:var(--green)">Already up to date.</span>`);
    return;
  }

  // ── git fetch
  if (sub === 'fetch') {
    appendLine(`<span style="color:var(--text-dim)">From github.com:user/repo</span>`);
    appendLine(`<span style="color:var(--blue)">   a1b2c3d..f4e5d6c  main -> origin/main</span>`);
    return;
  }

  // ── git diff
  if (sub === 'diff') {
    appendLine(`<span style="color:var(--text-muted)">diff --git a/README.md b/README.md</span>`);
    appendLine(`<span style="color:var(--text-muted)">index 0000000..a1b2c3d 100644</span>`);
    appendLine(`<span style="color:var(--text-muted)">--- a/README.md</span>`);
    appendLine(`<span style="color:var(--text-muted)">+++ b/README.md</span>`);
    appendLine(`<span style="color:var(--text-muted)">@@ -1,3 +1,5 @@</span>`);
    appendLine(`<span style="color:var(--red)">-# Proyecto</span>`);
    appendLine(`<span style="color:var(--green)">+# Mi Proyecto Git</span>`);
    appendLine(`<span style="color:var(--green)">+Aprendiendo control de versiones 🚀</span>`);
    return;
  }

  // ── git stash
  if (sub === 'stash') {
    if (!parts[2] || parts[2] === 'push') appendLine(`<span style="color:var(--green)">Saved working directory and index state WIP on ${repoState.currentBranch}</span>`);
    else if (parts[2] === 'pop') appendLine(`<span style="color:var(--green)">On branch ${repoState.currentBranch}: changes restored</span>`);
    else if (parts[2] === 'list') appendLine(`<span style="color:var(--text-dim)">stash@{0}: WIP on ${repoState.currentBranch}</span>`);
    return;
  }

  // ── git config
  if (sub === 'config') {
    if (parts.includes('--list')) {
      appendLine(`<span style="color:var(--text-dim)">user.name=Git User</span>`);
      appendLine(`<span style="color:var(--text-dim)">user.email=user@email.com</span>`);
      appendLine(`<span style="color:var(--text-dim)">core.editor=code --wait</span>`);
    } else {
      appendLine(`<span style="color:var(--green)">✓ Configuración guardada</span>`);
    }
    return;
  }

  // ── git show
  if (sub === 'show') {
    const last = repoState.commits[repoState.commits.length - 1];
    if (!last) { appendLine(`<span style="color:var(--red)">fatal: no commits yet</span>`); return; }
    appendLine(`<span style="color:var(--yellow)">commit ${last.hash}...</span>`);
    appendLine(`<span style="color:var(--text-dim)">Author: user &lt;user@email.com&gt;</span>`);
    appendLine(`<span style="color:var(--text-dim)">    ${last.msg}</span>`);
    return;
  }

  // ── git clone
  if (sub === 'clone') {
    const url = parts[2] || 'git@github.com:user/repo.git';
    appendLine(`<span style="color:var(--text-dim)">Cloning into '${url.split('/').pop().replace('.git', '')}'...</span>`);
    appendLine(`<span style="color:var(--text-dim)">remote: Enumerating objects: 42, done.</span>`);
    appendLine(`<span style="color:var(--text-dim)">remote: Total 42 (delta 0), reused 0 (delta 0)</span>`);
    appendLine(`<span style="color:var(--green)">Receiving objects: 100% (42/42), done.</span>`);
    repoState.initialized = true;
    repoState.remoteAdded = true;
    return;
  }

  // ── git reset
  if (sub === 'reset') {
    if (parts.includes('--hard')) {
      appendLine(`<span style="color:var(--red)">⚠ HEAD is now at ${repoState.commits[repoState.commits.length-2]?.hash || 'inicio'}</span>`);
      if (repoState.commits.length > 0) repoState.commits.pop();
    } else {
      appendLine(`<span style="color:var(--yellow)">Unstaged changes after reset:</span>`);
      appendLine(`<span style="color:var(--text-dim)">M src/app.py</span>`);
    }
    return;
  }

  // ── git revert
  if (sub === 'revert') {
    const hash = Math.random().toString(36).substring(2, 9);
    appendLine(`<span style="color:var(--green)">[${repoState.currentBranch} ${hash}] Revert previous commit</span>`);
    appendLine(`<span style="color:var(--text-dim)"> 1 file changed, 5 deletions(-)</span>`);
    return;
  }

  // ── Unknown git subcommand
  appendLine(`<span style="color:var(--red)">git: '${sub}' is not a git command. See 'git help'</span>`);
  appendLine(`<span style="color:var(--text-muted)">Comandos similares: ${quickCmds.filter(q => q.includes(sub || '')).slice(0, 3).join(', ') || 'help'}</span>`);
}

function showHelp() {
  appendLine(`<span style="color:var(--accent)">━━━ Comandos disponibles en el simulador ━━━</span>`);
  const groups = [
    ['⚙️ Setup', ['git init', 'git clone &lt;url&gt;', 'git config --list']],
    ['📌 Básicos', ['git status', 'git add .', 'git commit -m "msg"', 'git diff', 'git stash']],
    ['🌿 Ramas', ['git branch', 'git switch -c &lt;rama&gt;', 'git switch &lt;rama&gt;', 'git merge &lt;rama&gt;', 'git branch -d &lt;rama&gt;']],
    ['☁️ Remoto', ['git remote add origin &lt;url&gt;', 'git remote -v', 'git push', 'git pull', 'git fetch']],
    ['📜 Historial', ['git log', 'git log --oneline', 'git log --oneline --graph', 'git show', 'git reset', 'git revert']],
    ['🖥️ Terminal', ['clear', 'help']],
  ];
  groups.forEach(([title, cmds]) => {
    appendLine(`<span style="color:var(--blue)">${title}</span>`);
    cmds.forEach(cmd => appendLine(`<span style="color:var(--text-dim)">  ${cmd}</span>`));
  });
}

function welcome() {
  appendLine(`<span style="color:var(--accent)">╔═══════════════════════════════════════╗</span>`);
  appendLine(`<span style="color:var(--accent)">║      Git Simulator — git://learn      ║</span>`);
  appendLine(`<span style="color:var(--accent)">╚═══════════════════════════════════════╝</span>`);
  appendLine(`<span style="color:var(--text-dim)">Escribe "help" para ver los comandos disponibles.</span>`);
  appendLine(`<span style="color:var(--text-dim)">Empieza con: <span style="color:var(--blue)">git init</span></span>`);
  appendLine('');
}

// Build quick cmd buttons
const btnContainer = document.getElementById('cmdButtons');
quickCmds.forEach(cmd => {
  const btn = document.createElement('button');
  btn.className = 'cmd-btn';
  btn.textContent = cmd;
  btn.onclick = () => {
    input.value = cmd;
    input.focus();
  };
  btnContainer.appendChild(btn);
});

// Input handling
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (cmd) { runCommand(cmd); input.value = ''; }
  }
});

// History navigation
let history = [], histIdx = -1;
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
    else { histIdx = -1; input.value = ''; }
  }
});

const origRun = runCommand;
window.runCommand = function(cmd) {
  if (cmd.trim()) { history.unshift(cmd); histIdx = -1; }
  origRun(cmd);
};

// Focus terminal on click
document.querySelector('.interactive-terminal').addEventListener('click', () => input.focus());

// ════════ HAMBURGER MENU ════════
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navEl     = document.querySelector('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link-item').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!navEl.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

welcome();
