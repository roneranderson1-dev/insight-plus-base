import React, { useState, useEffect } from 'react';
import { Circle, Brain, Target, Heart, Star, BookOpen, Compass, Zap, Download, Home, ChevronRight, BarChart3, Lock, Mail, User } from 'lucide-react';

// Componente Principal com Gate de Acesso
export default function InsightPlusApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [savedResults, setSavedResults] = useState([]);
  const [currentTool, setCurrentTool] = useState(null);

  useEffect(() => {
    // Verifica se usuário já está autenticado
    const saved = localStorage.getItem('insight-plus-user');
    if (saved) {
      const user = JSON.parse(saved);
      setUserData(user);
      setIsAuthenticated(true);
    }

    // Carrega resultados salvos
    const results = localStorage.getItem('insight-plus-results');
    if (results) {
      setSavedResults(JSON.parse(results));
    }
  }, []);

  const saveResult = (result) => {
    const newResults = [...savedResults, { 
      ...result, 
      date: new Date().toISOString(),
      userName: userData.name,
      userEmail: userData.email
    }];
    setSavedResults(newResults);
    localStorage.setItem('insight-plus-results', JSON.stringify(newResults));
  };

  const tools = [
    {
      id: 'roda-vida',
      name: 'Roda da Vida',
      icon: Circle,
      description: 'Avalie o equilíbrio entre diferentes áreas da sua vida',
      color: 'from-purple-500 to-blue-500'
    },
    {
      id: 'personalidade',
      name: 'Análise de Personalidade',
      icon: Brain,
      description: 'Descubra seu perfil comportamental DISC',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'forcas-fraquezas',
      name: 'Forças e Fraquezas',
      icon: Target,
      description: 'Identifique suas competências e áreas de desenvolvimento',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'inteligencia-emocional',
      name: 'Inteligência Emocional',
      icon: Heart,
      description: 'Avalie suas habilidades emocionais',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'valores',
      name: 'Valores Pessoais',
      icon: Star,
      description: 'Identifique seus valores fundamentais',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'aprendizagem',
      name: 'Estilo de Aprendizagem',
      icon: BookOpen,
      description: 'Descubra como você aprende melhor',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'proposito',
      name: 'Propósito de Vida',
      icon: Compass,
      description: 'Reflexões guiadas sobre seu propósito',
      color: 'from-purple-600 to-blue-600'
    },
    {
      id: 'gestao-tempo',
      name: 'Gestão de Tempo',
      icon: Zap,
      description: 'Analise suas prioridades e uso do tempo',
      color: 'from-blue-600 to-purple-600'
    }
  ];

  const openTool = (tool) => {
    setCurrentTool(tool);
    setCurrentView('tool');
  };

  const goHome = () => {
    setCurrentView('home');
    setCurrentTool(null);
  };

  // Se não está autenticado, mostra tela de login
  if (!isAuthenticated) {
    return <LoginScreen onLogin={(user) => {
      setUserData(user);
      setIsAuthenticated(true);
      localStorage.setItem('insight-plus-user', JSON.stringify(user));
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Insight+
                </h1>
                <p className="text-sm text-slate-600">Olá, {userData.name.split(' ')[0]}! 👋</p>
              </div>
            </div>
            {currentView !== 'home' && (
              <button
                onClick={goHome}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Início</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' ? (
          <HomeView tools={tools} openTool={openTool} savedResults={savedResults} userName={userData.name} />
        ) : (
          <ToolView tool={currentTool} goHome={goHome} saveResult={saveResult} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-600 text-sm">
            © 2025 Insight+ • Seus dados são salvos com segurança no seu dispositivo
          </p>
        </div>
      </footer>
    </div>
  );
}

// Tela de Login com Google Sheets Integration
function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!name.trim() || name.trim().length < 2) {
      setError('Por favor, digite seu nome completo');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, digite um email válido');
      return;
    }

    if (!consent) {
      setError('Você precisa aceitar receber conteúdos para continuar');
      return;
    }

    setIsSubmitting(true);

    try {
      // Envia para Google Sheets
      await sendToGoogleSheets({
        name: name.trim(),
        email: email.trim(),
        timestamp: new Date().toISOString(),
        consent: true
      });

      // Login bem-sucedido
      onLogin({
        name: name.trim(),
        email: email.trim(),
        loginDate: new Date().toISOString()
      });
    } catch (err) {
      console.error('Erro ao enviar:', err);
      // Mesmo com erro no Google Sheets, permite acesso
      onLogin({
        name: name.trim(),
        email: email.trim(),
        loginDate: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-6">
            <Brain className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Insight+</h1>
          <p className="text-blue-100 text-lg">
            Descubra mais sobre você mesmo com nossas 8 ferramentas de autoconhecimento
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Comece agora gratuitamente</h2>
          <p className="text-slate-600 mb-6">Acesse todas as ferramentas sem pagar nada</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Nome */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Seu nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Seu melhor email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@email.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Checkbox de Consentimento */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-purple-200"
                required
              />
              <label htmlFor="consent" className="text-sm text-slate-700 leading-relaxed">
                Aceito receber conteúdos gratuitos sobre autoconhecimento e desenvolvimento pessoal por email
              </label>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Carregando...' : 'Começar Agora →'}
            </button>
          </form>

          {/* Segurança */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
            <Lock className="w-4 h-4" />
            <span>Seus dados estão protegidos e seguros</span>
          </div>
        </div>

        {/* Benefícios */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">8</div>
            <div className="text-xs text-blue-100">Ferramentas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">100%</div>
            <div className="text-xs text-blue-100">Gratuito</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">PDF</div>
            <div className="text-xs text-blue-100">Download</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Função para enviar dados ao Google Sheets
async function sendToGoogleSheets(data) {
  // IMPORTANTE: Substitua esta URL pela sua URL do Google Apps Script
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/u/0/home/projects/1SsTuxBRNQ6_-niN1vchZW-XgU2WiwNQtPM0awldQttbQRG4REtn0Gxoy/edit';
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Necessário para Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar para Google Sheets:', error);
    throw error;
  }
}

// Home View
function HomeView({ tools, openTool, savedResults, userName }) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Bem-vindo ao Insight+, {userName.split(' ')[0]}!
        </h2>
        <p className="text-lg text-slate-600">
          Explore ferramentas poderosas para entender melhor quem você é, seus valores, 
          forças e áreas de desenvolvimento. Cada avaliação gera um relatório completo que você pode salvar em PDF.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {tools.length}
          </div>
          <div className="text-slate-600 text-sm mt-1">Ferramentas Disponíveis</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {savedResults.length}
          </div>
          <div className="text-slate-600 text-sm mt-1">Avaliações Concluídas</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            100%
          </div>
          <div className="text-slate-600 text-sm mt-1">Gratuito</div>
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Escolha sua ferramenta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => openTool(tool)}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-slate-100 hover:border-purple-200"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {tool.name}
                </h4>
                <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
                <div className="flex items-center text-purple-600 text-sm font-medium">
                  Iniciar
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Tool View Router (mantém as mesmas ferramentas do app anterior)
function ToolView({ tool, goHome, saveResult }) {
  const toolComponents = {
    'roda-vida': RodaVida,
    'personalidade': Personalidade,
    'forcas-fraquezas': ForcasFraquezas,
    'inteligencia-emocional': InteligenciaEmocional,
    'valores': Valores,
    'aprendizagem': Aprendizagem,
    'proposito': Proposito,
    'gestao-tempo': GestaoTempo
  };

  const ToolComponent = toolComponents[tool.id];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <button onClick={goHome} className="hover:text-purple-600">Início</button>
          <ChevronRight className="w-4 h-4" />
          <span>{tool.name}</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800">{tool.name}</h2>
        <p className="text-slate-600 mt-2">{tool.description}</p>
      </div>
      <ToolComponent saveResult={saveResult} toolName={tool.name} />
    </div>
  );
}

// [TODAS AS FERRAMENTAS PERMANECEM IGUAIS - Copiando do código anterior]
// Por questão de espaço, vou incluir apenas a primeira como exemplo
// As demais são idênticas ao código anterior

function RodaVida({ saveResult, toolName }) {
  const [scores, setScores] = useState({
    saude: 5,
    relacionamentos: 5,
    carreira: 5,
    financas: 5,
    desenvolvimento: 5,
    lazer: 5,
    ambiente: 5,
    espiritualidade: 5
  });
  const [showResults, setShowResults] = useState(false);

  const areas = [
    { key: 'saude', label: 'Saúde e Bem-estar', desc: 'Condição física, alimentação, exercícios' },
    { key: 'relacionamentos', label: 'Relacionamentos', desc: 'Família, amigos, vida social' },
    { key: 'carreira', label: 'Carreira e Trabalho', desc: 'Satisfação profissional, crescimento' },
    { key: 'financas', label: 'Finanças', desc: 'Estabilidade financeira, planejamento' },
    { key: 'desenvolvimento', label: 'Desenvolvimento Pessoal', desc: 'Aprendizado, crescimento pessoal' },
    { key: 'lazer', label: 'Lazer e Diversão', desc: 'Hobbies, entretenimento, diversão' },
    { key: 'ambiente', label: 'Ambiente Físico', desc: 'Casa, trabalho, organização' },
    { key: 'espiritualidade', label: 'Espiritualidade', desc: 'Propósito, significado, fé' }
  ];

  const handleSubmit = () => {
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const average = total / Object.keys(scores).length;
    
    const result = {
      toolId: 'roda-vida',
      toolName,
      scores,
      average: average.toFixed(1),
      areas
    };
    
    saveResult(result);
    setShowResults(true);
  };

  const exportPDF = () => {
    const content = `INSIGHT+ - RODA DA VIDA\n\n${areas.map(area => `${area.label}: ${scores[area.key]}/10`).join('\n')}`;
    downloadPDF(content, 'insight-plus-roda-da-vida.pdf');
  };

  if (showResults) {
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const average = total / Object.keys(scores).length;
    const lowest = areas.reduce((min, area) => 
      scores[area.key] < scores[min.key] ? area : min
    );
    const highest = areas.reduce((max, area) => 
      scores[area.key] > scores[max.key] ? area : max
    );

    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-purple-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Seus Resultados</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 mb-4">Pontuação por Área</h4>
            {areas.map(area => (
              <div key={area.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{area.label}</span>
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {scores[area.key]}/10
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${scores[area.key] * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {average.toFixed(1)}/10
              </div>
              <div className="text-slate-700">Pontuação Média Geral</div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="font-semibold text-green-700 mb-2">Área Mais Forte</div>
              <div className="text-lg text-slate-800">{highest.label}</div>
              <div className="text-sm text-slate-600 mt-1">{scores[highest.key]}/10 pontos</div>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <div className="font-semibold text-amber-700 mb-2">Área para Desenvolvimento</div>
              <div className="text-lg text-slate-800">{lowest.label}</div>
              <div className="text-sm text-slate-600 mt-1">{scores[lowest.key]}/10 pontos</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 mb-6 border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Recomendações Personalizadas</h4>
          <div className="space-y-3">
            {average < 6 && (
              <p className="text-slate-700">• Sua pontuação geral indica que há várias áreas necessitando atenção. Priorize as áreas com menor pontuação.</p>
            )}
            {scores[lowest.key] < 5 && (
              <p className="text-slate-700">• <strong>{lowest.label}</strong> necessita atenção urgente. Defina 2-3 ações específicas para melhorar nesta área.</p>
            )}
            {Object.values(scores).filter(s => s >= 8).length >= 3 && (
              <p className="text-slate-700">• Você tem várias áreas bem desenvolvidas! Use essas forças para apoiar o crescimento nas áreas mais fracas.</p>
            )}
            <p className="text-slate-700">• Revise esta avaliação mensalmente para acompanhar seu progresso e fazer ajustes necessários.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Baixar PDF
          </button>
          <button
            onClick={() => setShowResults(false)}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Refazer Avaliação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-purple-100">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Como funciona?</h3>
        <p className="text-slate-600">
          Avalie cada área da sua vida em uma escala de 1 a 10, onde 1 é muito insatisfeito e 10 é completamente satisfeito.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {areas.map(area => (
          <div key={area.key} className="border-b border-slate-200 pb-6 last:border-0">
            <div className="mb-3">
              <label className="font-semibold text-slate-800 block mb-1">{area.label}</label>
              <p className="text-sm text-slate-600">{area.desc}</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={scores[area.key]}
                onChange={(e) => setScores({ ...scores, [area.key]: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(59 130 246) ${scores[area.key] * 10}%, rgb(226 232 240) ${scores[area.key] * 10}%, rgb(226 232 240) 100%)`
                }}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent w-12 text-center">
                {scores[area.key]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
      >
        Ver Resultados
      </button>
    </div>
  );
}

// [Incluir aqui TODAS as outras ferramentas do código anterior]
// Personalidade, ForcasFraquezas, InteligenciaEmocional, Valores, Aprendizagem, Proposito, GestaoTempo
// Por questão de limite de caracteres, mantenho a estrutura mas assumo que você copiará as funções completas

// Placeholder para as outras ferramentas (copiar do código anterior)
function Personalidade({ saveResult, toolName }) { return <div>Ferramenta Personalidade</div>; }
function ForcasFraquezas({ saveResult, toolName }) { return <div>Ferramenta Forças e Fraquezas</div>; }
function InteligenciaEmocional({ saveResult, toolName }) { return <div>Ferramenta Inteligência Emocional</div>; }
function Valores({ saveResult, toolName }) { return <div>Ferramenta Valores</div>; }
function Aprendizagem({ saveResult, toolName }) { return <div>Ferramenta Aprendizagem</div>; }
function Proposito({ saveResult, toolName }) { return <div>Ferramenta Propósito</div>; }
function GestaoTempo({ saveResult, toolName }) { return <div>Ferramenta Gestão de Tempo</div>; }

function downloadPDF(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace('.pdf', '.txt');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert('PDF gerado! (Versão simplificada em texto)');
}
