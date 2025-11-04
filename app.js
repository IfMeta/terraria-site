// ===== CONFIGURAÇÃO DO SUPABASE =====
const SUPABASE_URL = "https://lbwixdunttzdrswgzqrq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxid2l4ZHVudHR6ZHJzd2d6cXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzg3NDAsImV4cCI6MjA3Njc1NDc0MH0.uSZh1Wlsc29vVPWKWe5zGXRPFlN69bYp3pECjeIoCNU";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== VARIÁVEIS GLOBAIS =====
const senhaAdmin = "admin123"; // senha de acesso à manutenção

// ===== CADASTRAR =====
document.getElementById("btnSignUp").addEventListener("click", async () => {
  const nome = document.getElementById("nomeSignup").value.trim();
  const telefone = document.getElementById("telefoneSignup").value.trim();
  const endereco = document.getElementById("enderecoSignup").value.trim();
  const email = document.getElementById("emailAuth").value.trim();
  const senha = document.getElementById("senhaAuth").value.trim();

  if (!nome || !telefone || !endereco || !email || !senha) {
    alert("Preencha todos os campos para cadastro!");
    return;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .insert([{ nome, telefone, endereco, email, senha }]);

  if (error) {
    alert("Erro ao cadastrar: " + error.message);
  } else {
    alert("Cadastro realizado com sucesso!");
    // salva o usuário no localStorage
    localStorage.setItem("usuarioLogado", JSON.stringify(data[0]));
    window.location.href = "comunidade.html";
  }
});

// ===== LOGIN =====
document.getElementById("btnSignIn").addEventListener("click", async () => {
  const email = document.getElementById("emailAuth").value.trim();
  const senha = document.getElementById("senhaAuth").value.trim();

  if (!email || !senha) {
    alert("Preencha e-mail e senha!");
    return;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .eq("senha", senha)
    .single();

  if (error || !data) {
    alert("E-mail ou senha incorretos!");
  } else {
    localStorage.setItem("usuarioLogado", JSON.stringify(data));
    alert("Login realizado com sucesso!");
    window.location.href = "comunidade.html";
  }
});

// ===== VERIFICAR LOGIN (para comunidade.html) =====
function verificarLogin() {
  const usuario = localStorage.getItem("usuarioLogado");
  if (!usuario) {
    alert("Você precisa estar logado para acessar esta página!");
    window.location.href = "index.html";
  } else {
    const user = JSON.parse(usuario);
    document.getElementById("nomeUsuario").innerText = user.nome;
    document.getElementById("areaPrivada").style.display = "block";
    document.getElementById("msgLogin").style.display = "none";
  }
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// ===== VERIFICAR SENHA ADMIN =====
function verificarAdmin() {
  const senha = prompt("Digite a senha do desenvolvedor:");
  if (senha !== senhaAdmin) {
    alert("Acesso negado!");
    window.location.href = "index.html";
  } else {
    carregarUsuarios();
  }
}

// ===== CRUD ADMIN =====
async function carregarUsuarios() {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) {
    console.error(error);
    alert("Erro ao carregar usuários!");
    return;
  }

  const tabela = document.getElementById("tabelaUsuarios");
  tabela.innerHTML = "";

  data.forEach((user) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${user.nome}</td>
      <td>${user.email}</td>
      <td>${user.telefone || "-"}</td>
      <td>${user.endereco || "-"}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarUsuario('${user.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${user.id}')">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

async function editarUsuario(id) {
  const novoNome = prompt("Novo nome:");
  const novoEmail = prompt("Novo e-mail:");
  if (!novoNome || !novoEmail) return;

  const { error } = await supabase
    .from("usuarios")
    .update({ nome: novoNome, email: novoEmail })
    .eq("id", id);

  if (error) alert("Erro ao editar usuário!");
  else {
    alert("Usuário atualizado!");
    carregarUsuarios();
  }
}

async function excluirUsuario(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  const { error } = await supabase.from("usuarios").delete().eq("id", id);
  if (error) alert("Erro ao excluir!");
  else {
    alert("Usuário excluído!");
    carregarUsuarios();
  }
}
