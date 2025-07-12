const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./estoque.db');

// Cria tabela se não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS componentes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    quantidade INTEGER NOT NULL
  )`);
});

module.exports = db;

db.serialize(() => {
  // Cria tabela estoque
  db.run(`CREATE TABLE IF NOT EXISTS componentes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    quantidade INTEGER NOT NULL
  )`);

  // Cria tabela usuários
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
  )`);

  // Cria usuário admin se não existir
  const bcrypt = require('bcrypt');
  const senhaCriptografada = bcrypt.hashSync('admin', 10);

  db.get(`SELECT * FROM usuarios WHERE usuario = 'admin'`, (err, row) => {
    if (!row) {
      db.run(`INSERT INTO usuarios (usuario, senha) VALUES (?, ?)`, ['admin', senhaCriptografada]);
    }
  });
});