// ===== CONFIGURAÇÃO DO SUPABASE =====
const SUPABASE_URL = "https://lbwixdunttzdrswgzqrq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxid2l4ZHVudHR6ZHJzd2d6cXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzg3NDAsImV4cCI6MjA3Njc1NDc0MH0.uSZh1Wlsc29vVPWKWe5zGXRPFlN69bYp3pECjeIoCNU";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== VARIÁVEIS =====
const senhaAdmin = "admin123"; // senha para acessar manutenção

// ===== CADASTRO =====
document.getElementById("btnSignUp")?.addEventListener("click", async () => {
  const nome = document.getElementById("nomeSignup").value.trim();
  const telefone = document.getElementById("telefoneSignup").value.trim();
  const endereco = document.getElementById("enderecoSignup").value.trim();
  const email = document.getElementById("emailAuth").value.trim();
  const senha = document.getElementById("senhaAuth").value.trim();

  if (!nome || !telefone || !endereco || !email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  // Inserir no Supabase
  const { data, error } = await supabase
    .from("usuarios")
    .insert([{ nome, telefone, endereco, email, senha }])
    .select();

  if (error) {
    alert("Erro ao cadastrar: " + error.message);
  } else {
    alert("Cadastro realizado com sucesso!");
    localStorage.setItem("usuarioLogado", JSON.stringify(data[0]));
    window.location.href = "comunidade.html";
  }
});

// ===== LOGIN =====
document.getElementById("btnSignIn")?.addEventListener("click", async () => {
  const email = document.getElementById("emailAuth").value.trim();
  const senha = document.getElementById("senhaAuth").value.trim();

  if (!email || !senha) {
    alert("Informe e-mail e senha!");
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
    alert("Login realizado com sucesso!");
    localStorage.setItem("usuarioLogado", JSON.stringify(data));
    window.location.href = "comunidade.html";
  }
});

// ===== VERIFICAR LOGIN NA COMUNIDADE =====
function verificarLogin() {
  const usuario = localStorage.getItem("usuarioLogado");
  const areaPrivada = document.getElementById("areaPrivada");
  const msgLogin = document.getElementById("msgLogin");
  const nomeUsuario = document.getElementById("nomeUsuario");

  if (usuario) {
    const user = JSON.parse(usuario);
    nomeUsuario.textContent = user.nome;
    areaPrivada.style.display = "block";
    msgLogin.style.display = "none";
  } else {
    areaPrivada.style.display = "none";
    msgLogin.style.display = "block";
  }
}

// ===== LOGOUT =====
document.getElementById("btnLogout")?.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  alert("Você saiu da conta!");
  window.location.href = "index.html";
});

// ===== ÁREA ADMINISTRATIVA =====
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
    alert("Erro ao carregar usuários!");
    return;
  }

  const tabela = document.getElementById("tabelaUsuarios");
  tabela.innerHTML = "";

  data.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.nome}</td>
      <td>${u.email}</td>
      <td>${u.telefone || "-"}</td>
      <td>${u.endereco || "-"}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarUsuario('${u.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="excluirUsuario('${u.id}')">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
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
  if (!confirm("Deseja realmente excluir este usuário?")) return;

  const { error } = await supabase.from("usuarios").delete().eq("id", id);
  if (error) alert("Erro ao excluir!");
  else {
    alert("Usuário excluído!");
    carregarUsuarios();
  }
}
