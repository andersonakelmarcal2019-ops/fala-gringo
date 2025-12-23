import React, { useState, useEffect, memo, useCallback, useRef, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Headphones, 
  Smartphone, 
  Star, 
  ChevronDown, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Infinity as InfinityIcon, 
  ShoppingBag, 
  ChevronLeft, 
  Layout, 
  Cpu 
} from 'lucide-react';

// --- Constants ---
const CHECKOUT_URL = "https://pay.lowify.com.br/checkout?product_id=PdyvLK";

const BRAZILIAN_NAMES = [
  "João Silva", "Maria Oliveira", "Pedro Santos", "Ana Souza", "Carlos Pereira",
  "Juliana Lima", "Ricardo Costa", "Fernanda Rocha", "Lucas Mendes", "Beatriz Alves",
  "Gabriel Barbosa", "Camila Castro", "Marcos Vinícius", "Patrícia Gomes", "Felipe Machado",
  "Amanda Ribeiro", "Rodrigo Nogueira", "Larissa Fernandes", "Thiago Silva", "Letícia Martins"
];

const TESTIMONIAL_IMAGES = [
  "https://i.imgur.com/x4wlyzY.jpeg",
  "https://i.imgur.com/f7cKIQR.jpeg",
  "https://i.imgur.com/NFv1Or0.jpeg",
  "https://i.imgur.com/5QoTAlg.jpeg"
];

// --- Helper for Safe Events ---
/**
 * CRITICAL FIX: O erro "Converting circular structure to JSON" ocorre quando scripts 
 * de terceiros tentam serializar o 'event.target' que contém propriedades do React (__reactFiber).
 * Usamos divs com role="button" e impedimos a propagação para evitar que scripts globais 
 * capturem o elemento e tentem transformá-lo em JSON.
 */
const handleSafeClick = (e: any, callback?: () => void) => {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation();
    }
  }
  if (callback) callback();
};

// --- Components ---

interface CTAButtonProps {
  text: string;
  className?: string;
  onClick: () => void;
}

const CTAButton = memo(({ text, className, onClick }: CTAButtonProps) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSafeClick(e, onClick); }}
      onClick={(e) => handleSafeClick(e, onClick)}
      className={`cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-black py-5 px-8 md:px-12 rounded-2xl shadow-xl cta-shadow transition-colors duration-200 text-lg md:text-2xl uppercase tracking-tighter flex items-center justify-center gap-3 w-full md:w-auto select-none ${className}`}
    >
      {text}
      <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
    </div>
  );
});

const FAQItem = memo(({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <div 
        role="button"
        tabIndex={0}
        onClick={(e) => handleSafeClick(e, () => setIsOpen(!isOpen))}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSafeClick(e, () => setIsOpen(!isOpen)); }}
        className="w-full py-6 flex justify-between items-center text-left hover:text-sky-600 transition-colors cursor-pointer select-none"
      >
        <span className="text-lg md:text-xl font-bold pr-8 text-slate-800 leading-tight">{question}</span>
        <ChevronDown className={`w-6 h-6 text-sky-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="overflow-hidden">
          <p className="pb-6 text-slate-500 text-lg leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
});

const SalesNotification = memo(() => {
  const [visible, setVisible] = useState(false);
  const [currentName, setCurrentName] = useState("");

  useEffect(() => {
    let hideTimeout: number;
    const showNotification = () => {
      const randomName = BRAZILIAN_NAMES[Math.floor(Math.random() * BRAZILIAN_NAMES.length)];
      setCurrentName(randomName);
      setVisible(true);
      hideTimeout = window.setTimeout(() => setVisible(false), 4000);
    };

    const initialTimeout = window.setTimeout(showNotification, 8000);
    const interval = window.setInterval(showNotification, 15000);

    return () => {
      window.clearTimeout(initialTimeout);
      window.clearTimeout(hideTimeout);
      window.clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-24 right-4 z-[110] glass bg-white/95 p-4 rounded-2xl shadow-2xl border border-sky-100 flex items-center gap-4 max-w-[260px] md:max-w-[300px] pointer-events-none">
      <div className="bg-sky-500 p-2 rounded-full shrink-0">
        <ShoppingBag className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-black text-slate-900 leading-tight">{currentName}</p>
        <p className="text-xs text-slate-500 font-medium">Acabou de liberar o App!</p>
      </div>
    </div>
  );
});

const TestimonialSlider = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIAL_IMAGES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIAL_IMAGES.length) % TESTIMONIAL_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative max-w-4xl mx-auto px-4 group">
      <div className="overflow-hidden rounded-[40px] shadow-2xl border-4 border-white aspect-[4/5] md:aspect-[16/10] relative bg-white flex items-center justify-center">
        <img
          src={TESTIMONIAL_IMAGES[currentIndex]}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain pointer-events-none select-none"
          alt={`Depoimento ${currentIndex + 1}`}
        />
      </div>

      <div 
        role="button"
        tabIndex={0}
        onClick={(e) => handleSafeClick(e, prev)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSafeClick(e, prev); }}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-xl text-slate-900 hover:bg-sky-500 hover:text-white transition-all z-20 cursor-pointer select-none"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </div>
      <div 
        role="button"
        tabIndex={0}
        onClick={(e) => handleSafeClick(e, next)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSafeClick(e, next); }}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white p-4 rounded-full shadow-xl text-slate-900 hover:bg-sky-500 hover:text-white transition-all z-20 cursor-pointer select-none"
      >
        <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
      </div>

      <div className="flex justify-center gap-3 mt-10">
        {TESTIMONIAL_IMAGES.map((_, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={(e) => handleSafeClick(e, () => setCurrentIndex(i))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSafeClick(e, () => setCurrentIndex(i)); }}
            className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex ? 'w-10 bg-sky-500' : 'w-3 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
});

export default function App() {
  const pricingRef = useRef<HTMLDivElement>(null);

  const scrollToPricing = useCallback(() => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleCheckout = useCallback(() => {
    window.location.href = CHECKOUT_URL;
  }, []);

  const differenceItems = useMemo(() => [
    { icon: <Smartphone className="w-7 h-7 text-sky-500" />, title: "Interface Intuitiva", text: "Navegue pelas 1000 palavras mais usadas com apenas um toque." },
    { icon: <Headphones className="w-7 h-7 text-sky-500" />, title: "Áudio Nativo Integrado", text: "Não apenas leia, ouça a pronúncia perfeita de cada palavra dentro do app." },
    { icon: <Zap className="w-7 h-7 text-sky-500" />, title: "Sistema de Repetição", text: "O app ajuda você a fixar o conteúdo de forma inteligente e rápida." },
    { icon: <Layout className="text-sky-500 w-7 h-7" />, title: "Multiplataforma", text: "Acesse pelo celular, tablet ou computador. Seu progresso é sincronizado." },
    { icon: <Star className="w-7 h-7 text-sky-500" />, title: "Comunidade de Alunos", text: "Mais de 500 usuários ativos dominando o inglês todos os dias." }
  ], []);

  return (
    <div className="antialiased overflow-x-hidden selection:bg-sky-500 selection:text-white bg-white">
      {/* Top Banner */}
      <div className="bg-red-600 text-white py-3 px-4 text-center font-bold text-sm md:text-base sticky top-0 z-[100] shadow-lg">
        <p>⚠️ Atenção: Oferta Promocional Apenas HOJE ({new Date().toLocaleDateString('pt-BR')})</p>
      </div>

      <SalesNotification />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-16 overflow-hidden bg-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[120px] -translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-[900] mb-8 leading-[1.15] md:leading-[1.15] tracking-tighter text-slate-900">
            Apenas 7 Dias e Mais Nada <br />
            <span className="gradient-text italic inline-block py-3 px-1">e Você Já Entende Inglês!</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-semibold px-4">
            🤡 Não caia no golpe das escolas de inglês e não pague por curso, apenas decore essas palavras!
          </p>
          <div className="mb-16 max-w-3xl mx-auto px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-100 blur-[80px] rounded-full opacity-40 -z-10"></div>
              <img 
                src="https://i.imgur.com/Uk1egTp.png" 
                alt="Aplicativo Inglês Real Mockup" 
                width="800" height="500" 
                decoding="async"
                fetchPriority="high"
                className="w-full h-auto drop-shadow-[0_20px_20px_rgba(0,0,0,0.08)]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <CTAButton text="VER OFERTA E APRENDER AGORA" onClick={scrollToPricing} />
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest">
              <Smartphone className="w-4 h-4" /> Acesso Imediato Web & Mobile
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-5xl font-[900] leading-tight text-slate-900 uppercase italic tracking-tighter">
              85% do inglês falado usa sempre <br />
              <span className="text-sky-600 underline decoration-sky-300 underline-offset-[12px]">as mesmas palavras.</span>
            </h3>
            <p className="text-xl md:text-2xl text-slate-500 font-medium">Nosso App organiza isso para você dominar o idioma em tempo recorde.</p>
          </div>
        </div>
      </section>

      {/* Why Method Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="bg-sky-100 p-4 rounded-full mb-8 inline-block">
            <Cpu className="w-10 h-10 text-sky-600 fill-sky-600" />
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
            💡 Por que usar o <span className="text-sky-600">Nosso App</span> é 10x mais rápido que cursos comuns?
          </h2>
          <div className="glass p-8 md:p-12 rounded-[40px] bg-white border-2 border-sky-100 mb-12 shadow-xl text-lg md:text-2xl text-slate-700 font-medium leading-relaxed space-y-6 text-left md:text-center">
            <p>Estudar com PDFs é cansativo e ler livros é desmotivador. O Aplicativo Inglês Real foi desenhado para ser viciante.</p>
            <p className="font-bold text-slate-900">Você clica, ouve a pronúncia nativa e vê a tradução na hora. É o método das <span className="text-sky-600">1000 palavras</span> potencializado pela tecnologia.</p>
            <p>Treine no ônibus, na fila do banco ou antes de dormir. <span className="italic underline decoration-sky-400">O inglês agora faz parte da sua rotina digital.</span></p>
          </div>
          <CTAButton text="VER OFERTA EXCLUSIVA" onClick={scrollToPricing} />
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-20 px-6 bg-white overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase italic mx-auto">
              Um Aplicativo <br /> <span className="text-sky-600">diferente de tudo</span> <br /> que você já viu!
            </h2>
          </div>
          <div className="space-y-8 mb-16">
            {differenceItems.map((item, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="mt-1 bg-sky-50 p-3 rounded-2xl group-hover:bg-sky-100 transition-colors shrink-0">{item.icon}</div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <CTAButton text="SIM, QUERO O APP" onClick={scrollToPricing} />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6 bg-slate-50 overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-8 h-8 fill-yellow-400 text-yellow-400" />)}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-16">
            Mais de 500 pessoas já estão usando o App diariamente.
          </h2>
          <TestimonialSlider />
        </div>
      </section>

      {/* Pricing / Offer Section */}
      <section ref={pricingRef} className="py-20 px-6 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="glass p-8 md:p-16 rounded-[60px] border-4 border-white bg-white shadow-2xl">
            <div className="inline-block bg-red-600 text-white px-8 py-2 rounded-full font-black uppercase text-sm tracking-[0.2em] mb-10 shadow-lg shadow-red-200">Oferta por Tempo Limitado</div>
            <h2 className="text-4xl md:text-6xl font-black mb-12 uppercase italic text-slate-900 tracking-tighter">O QUE VOCÊ LIBERA HOJE:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left max-w-2xl mx-auto mb-16 font-bold text-xl text-slate-700">
              <div className="flex items-center gap-4"><Smartphone className="text-sky-600 w-6 h-6 shrink-0" /> Aplicativo 1000 Palavras</div>
              <div className="flex items-center gap-4"><Headphones className="text-sky-600 w-6 h-6 shrink-0" /> Audiobook 1000 Palavras</div>
              <div className="flex items-center gap-4"><Zap className="text-sky-600 w-6 h-6 shrink-0" /> Tradução e Pronúncia</div>
              <div className="flex items-center gap-4"><CheckCircle className="text-sky-600 w-6 h-6 shrink-0" /> Download Imediato</div>
              <div className="flex items-center gap-4"><InfinityIcon className="text-sky-600 w-6 h-6 shrink-0" /> Acesso Vitalício</div>
            </div>
            <div className="mb-12">
              <p className="text-slate-400 line-through text-2xl font-black mb-2 opacity-50">De R$ 97,00</p>
              <div className="flex flex-col items-center justify-center">
                <span className="text-slate-900 text-3xl font-black uppercase">POR APENAS</span>
                <span className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter">R$ 19,90</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <CTAButton text="LIBERAR MEU LOGIN AGORA" className="mb-8" onClick={handleCheckout} />
              <div className="flex flex-col md:flex-row items-center gap-8 text-slate-400 font-bold uppercase tracking-widest text-xs">
                <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500" /> 7 Dias de Garantia Incondicional</div>
                <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-sky-500" /> Ativação Imediata</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 uppercase text-slate-900 tracking-tighter italic">❓ DÚVIDAS FREQUENTES</h2>
          <div className="glass p-8 md:p-12 rounded-[48px] bg-white border-2 border-slate-100">
            {[
              { question: "Preciso instalar o app pela loja?", answer: "Não, nosso app é um Web App Premium. Você acessa direto pelo navegador e pode criar um atalho na tela inicial do seu celular, economizando espaço e facilitando o acesso." },
              { question: "O app funciona offline?", answer: "Você precisa de conexão para o primeiro acesso e sincronização, mas a estrutura do app é otimizada para carregar rapidamente em qualquer rede." },
              { question: "Como recebo meus dados de login?", answer: "Imediatamente após a confirmação do pagamento, você receberá um e-mail com o link de acesso e suas credenciais exclusivas." },
              { question: "O app tem mensalidade?", answer: "Não. O pagamento de R$ 19,90 é único e garante seu acesso vitalício a todas as 1000 palavras e atualizações." },
              { question: "Funciona em iPhone e Android?", answer: "Sim! Como é um Web App de última geração, ele funciona perfeitamente em qualquer dispositivo com internet." },
              { question: "E se eu não me adaptar ao app?", answer: "Você tem 7 dias de garantia total. Se achar que o aplicativo não é para você, devolvemos seu dinheiro na hora." }
            ].map((faq, i) => <FAQItem key={i} question={faq.question} answer={faq.answer} />)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-slate-100 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-6xl font-black mb-12 uppercase italic text-slate-900 tracking-tighter">🚀 O APP QUE MUDA TUDO.</h2>
          <div className="flex justify-center mb-12">
            <CTAButton text="INSTALAR APP E APRENDER AGORA!" onClick={scrollToPricing} />
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 font-bold uppercase tracking-widest text-xs">
            <p>© 2025 INGLÊS REAL APP. TODOS OS DIREITOS RESERVADOS.</p>
            <div className="flex gap-10">
              <span className="cursor-pointer hover:text-sky-600 transition-colors" onClick={(e) => handleSafeClick(e)}>Termos de Uso</span>
              <span className="cursor-pointer hover:text-sky-600 transition-colors" onClick={(e) => handleSafeClick(e)}>Privacidade</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
