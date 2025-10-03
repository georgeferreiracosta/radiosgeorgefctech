# 🚀 Guia Rápido - Rádios GeorgeFctéch

## Instalação e Execução

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar em Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em: `http://localhost:5173/radiosgeorgefctech`

### 3. Build de Produção
```bash
npm run build
```

### 4. Preview da Build
```bash
npm run preview
```

### 5. Deploy no GitHub Pages
```bash
npm run deploy
```

---

## 🎯 Principais Funcionalidades

### Busca e Filtros
A aplicação possui um **filtro unificado** na parte superior da lista de estações que permite buscar por nome da rádio ou gênero musical em tempo real. Os resultados aparecem instantaneamente com os logos das estações.

### Player de Áudio
O player fica fixo no topo da página e inclui um **Spectrum Analyzer** (VU Meter) que visualiza o áudio em tempo real com cores que indicam o nível de volume.

### Modo Motorista
Clique no botão flutuante com ícone de caminhão para ativar o **Modo Motorista**, que oferece uma interface simplificada com botões grandes e controle por voz.

### Controles por Voz
No Modo Motorista, você pode controlar a aplicação usando comandos de voz em português. Clique no ícone do microfone e diga comandos como "Tocar", "Pausar", "Próxima", "Anterior", ou "Sintonizar [nome da rádio]".

---

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta automaticamente a:
- **Mobile**: Layout vertical com 2 colunas
- **Tablet**: Layout intermediário com 3-4 colunas
- **Desktop**: Layout completo com 5-6 colunas

---

## 🎨 Personalização

### Cores
As cores principais podem ser ajustadas no arquivo `tailwind.config.js`.

### Estações Personalizadas
Para adicionar estações personalizadas, edite o array `customStations` em `src/components/RadioGrid.jsx`.

---

## 🔧 Tecnologias Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **React Router** - Roteamento
- **Heroicons** - Ícones
- **Web Audio API** - Análise de áudio
- **Web Speech API** - Reconhecimento de voz

---

## 📝 Estrutura do Projeto

```
src/
├── components/       # Componentes React
├── hooks/           # Custom hooks
├── pages/           # Páginas da aplicação
├── services/        # Serviços de API
├── store/           # Estado global (Zustand)
├── App.jsx          # Componente principal
└── main.jsx         # Entry point
```

---

## 🎤 Comandos de Voz

| Comando | Ação |
|---------|------|
| "Tocar" | Inicia reprodução |
| "Pausar" | Pausa reprodução |
| "Próxima" | Próxima estação |
| "Anterior" | Estação anterior |
| "Mudar estação" | Estação aleatória |
| "Sintonizar [nome]" | Busca estação específica |
| "Rock" / "Pop" / "Jazz" | Busca por gênero |

---

## ⚠️ Notas Importantes

1. **Web Audio API**: O Spectrum Analyzer requer que o usuário interaja com a página antes de funcionar (política de autoplay dos navegadores).

2. **Reconhecimento de Voz**: Funciona apenas em navegadores compatíveis (Chrome, Edge, Safari). Firefox não suporta nativamente.

3. **CORS**: Algumas estações podem não permitir análise de áudio devido a políticas CORS do servidor.

4. **Permissões**: O navegador solicitará permissão para usar o microfone quando você ativar o controle por voz.

---

## 🐛 Solução de Problemas

### O áudio não toca
- Verifique se o navegador não bloqueou o autoplay
- Clique em qualquer lugar da página para ativar o contexto de áudio
- Verifique se a estação está online

### O Spectrum Analyzer não aparece
- Certifique-se de que o áudio está tocando
- Verifique se a estação permite CORS
- Tente outra estação

### O reconhecimento de voz não funciona
- Verifique se está usando um navegador compatível (Chrome/Edge/Safari)
- Permita o acesso ao microfone quando solicitado
- Fale claramente e próximo ao microfone

---

## 📞 Suporte

Para mais informações, consulte o arquivo `MELHORIAS_IMPLEMENTADAS.md` que contém documentação detalhada de todas as funcionalidades.

---

**Desenvolvido com ❤️ por Manus AI**
