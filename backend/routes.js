const express = require('express');
const router = express.Router();
const db = require('./database');

// Listar componentes
router.get('/estoque', (req, res) => {
  db.all("SELECT * FROM componentes", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Adicionar novo componente
router.post('/estoque', (req, res) => {
  const { nome, quantidade } = req.body;
  db.run("INSERT INTO componentes (nome, quantidade) VALUES (?, ?)", [nome, quantidade], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, nome, quantidade });
  });
});

// Atualizar quantidade (entrada/saída)
router.patch('/estoque/:id', (req, res) => {
  const { quantidade } = req.body;
  db.run("UPDATE componentes SET quantidade = ? WHERE id = ?", [quantidade, req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// Remover item
router.delete('/estoque/:id', (req, res) => {
  db.run("DELETE FROM componentes WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;

// Rota de login simples
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  db.get("SELECT * FROM usuarios WHERE usuario = ?", [usuario], (err, row) => {
    if (err) return res.status(500).json({ erro: 'Erro interno' });
    if (!row) return res.status(401).json({ erro: 'Usuário inválido' });

    // Verifica senha
    const senhaValida = bcrypt.compareSync(senha, row.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Senha inválida' });

    res.json({ sucesso: true });
  });
});

