// Inicializa o mapa
const map = L.map('map').setView([-23.55052, -46.633308], 10); // São Paulo como centro inicial

// Adiciona o tile layer do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Lista de lojas (exemplo)
const lojas = [
  {
    nome: "GameStop SP",
    lat: -23.561684,
    lng: -46.656139,
    endereco: "Rua da Consolação, 123, SP"
  },
  {
    nome: "Playmania",
    lat: -23.547501,
    lng: -46.635309,
    endereco: "Av. Paulista, 456, SP"
  },
  {
    nome: "Loja de Games Center",
    lat: -23.564849,
    lng: -46.652395,
    endereco: "R. Augusta, 789, SP"
  }
];

// Adiciona marcadores das lojas
lojas.forEach(loja => {
  L.marker([loja.lat, loja.lng])
    .addTo(map)
    .bindPopup(`<b>${loja.nome}</b><br>${loja.endereco}`);
});

// Pega localização do usuário
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Adiciona marcador do usuário
      L.marker([lat, lng], {icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [32, 32]
      })})
      .addTo(map)
      .bindPopup("<b>Você está aqui!</b>")
      .openPopup();

      // Centraliza mapa na posição do usuário
      map.setView([lat, lng], 13);
    },
    err => {
      alert("Não foi possível acessar sua localização. Mostrando apenas lojas.");
    }
  );
} else {
  alert("Geolocalização não suportada pelo seu navegador.");
}
