// =====================
// CONFIGURAÇÃO DA IA
// =====================

const BRAND_CONTEXT = `
Você é o assistente de conteúdo da plataforma ContentIQ.
A marca atual é a Neat Space: serviço profissional de limpeza para imóveis Airbnb em Brisbane, Austrália.
Público-alvo: proprietários e gestores de imóveis Airbnb em Brisbane.
Tom de voz: profissional, confiável, direto e especialista.
Pilares de conteúdo: educativo (40%), prova social (25%), bastidores (20%), oferta direta (15%).
Melhor horário de publicação: terças e quintas às 19h.
Formato que mais performa: carrosséis educativos (3× mais salvamentos).
Idioma: Português do Brasil (salvo quando especificado inglês para o mercado australiano).
Sempre inclua CTA claro no final de cada conteúdo gerado.
Responda de forma completa, prática e pronta para publicar.
`;

// =====================
// GERAR POST (tela Criar)
// =====================

async function generatePost() {
  const topic = document.getElementById('topic-input').value.trim();
  if (!topic) {
    document.getElementById('topic-input').style.borderColor = '#E24B4A';
    document.getElementById('topic-input').focus();
    return;
  }
  document.getElementById('topic-input').style.borderColor = '';

  const format   = document.querySelector('.format-card.selected')?.querySelector('.format-name')?.innerText || 'Carrossel';
  const goal     = document.querySelector('#goal-pills .pill.on')?.innerText || 'Engajamento';
  const hook     = document.querySelector('.hook-card.selected .hook-label')?.innerText || 'IA decide';
  const platforms = [...document.querySelectorAll('#plat-pills .pill.on')].map(p => p.innerText).join(', ') || 'Instagram';

  const prompt = `${BRAND_CONTEXT}

Crie um post completo para a Neat Space com as seguintes especificações:
- Formato: ${format}
- Assunto: ${topic}
- Objetivo: ${goal}
- Tipo de abertura/gancho: ${hook}
- Plataformas: ${platforms}

Para cada plataforma selecionada, entregue:
1. Copy completo adaptado ao formato e linguagem da plataforma
2. Hashtags segmentadas para o nicho (mínimo 10)
3. Melhor horário sugerido para publicar
4. CTA específico para o objetivo

Separe claramente cada plataforma com um cabeçalho.`;

  const btn = document.querySelector('.btn-primary.full-width');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Gerando com IA...';

  const resultDiv = document.getElementById('ai-result');
  const resultText = document.getElementById('ai-result-text');
  resultDiv.style.display = 'none';

  try {
    const text = await callAI(prompt);
    resultText.textContent = text;
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    showNotification('Erro ao gerar conteúdo. Tente novamente.');
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-sparkles"></i>Gerar conteúdo completo com IA';
}

// =====================
// GERAR A PARTIR DE TENDÊNCIA / CURADORIA
// =====================

async function generateFromTrend(customPrompt) {
  const modal = document.getElementById('ai-modal');
  const content = document.getElementById('modal-content');
  const title = document.querySelector('.modal-title');

  title.innerHTML = '<i class="ti ti-sparkles"></i> Gerando com IA...';
  modal.style.display = 'flex';
  content.innerHTML = `
    <div style="text-align:center;padding:40px 20px">
      <div class="spinner" style="border-color:rgba(83,74,183,.3);border-top-color:#534AB7;margin:0 auto 16px;width:28px;height:28px;border-width:3px"></div>
      <p style="color:#4B4B6B;font-size:13px">Criando conteúdo personalizado para a Neat Space...</p>
    </div>`;

  await generateWithAI(BRAND_CONTEXT + '\n\n' + customPrompt, content, title);
}

// =====================
// CORE: CHAMAR A API DA ANTHROPIC
// =====================

async function callAI(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro na API');
  }

  const data = await response.json();
  return data.content.map(b => b.text || '').join('');
}

// =====================
// GERAR E MOSTRAR NO MODAL
// =====================

async function generateWithAI(prompt, contentEl, titleEl) {
  try {
    const text = await callAI(prompt);

    if (titleEl) {
      titleEl.innerHTML = '<i class="ti ti-check-circle" style="color:#0F6E56"></i> Conteúdo gerado!';
    }

    contentEl.innerHTML = '';
    const pre = document.createElement('div');
    pre.style.cssText = 'font-size:13px;line-height:1.8;color:#1A1A2E;white-space:pre-wrap;word-break:break-word';
    pre.textContent = text;
    contentEl.appendChild(pre);

  } catch (e) {
    contentEl.innerHTML = `
      <div style="padding:20px;text-align:center">
        <i class="ti ti-alert-circle" style="font-size:32px;color:#E24B4A;display:block;margin-bottom:10px"></i>
        <p style="color:#4B4B6B;font-size:13px;margin-bottom:8px">Não foi possível conectar com a IA.</p>
        <p style="color:#8888AA;font-size:12px">Para ativar a geração de conteúdo com IA, você precisa de uma chave de API da Anthropic.<br>
        Acesse <strong>console.anthropic.com</strong> para criar a sua gratuitamente.</p>
      </div>`;
  }
}
