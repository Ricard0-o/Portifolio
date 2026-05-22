// descriçaõ de utilização deste codiogo


document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.btn').forEach(function(btn) {
    btn.addEventListener('mousedown', function() {
      btn.style.transform = 'scale(0.97)';
    });

    btn.addEventListener('mouseup', function() {
      btn.style.transform = 'scale(1)';
    });

    btn.addEventListener('mouseleave', function() {
      btn.style.transform = 'scale(1)';
    });
  });

  const contatoForm = document.querySelector('.form-contato');

  if (contatoForm) {
    const status = contatoForm.querySelector('.form-status');
    const submitButton = contatoForm.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton ? submitButton.textContent : 'Enviar';

    contatoForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      if (!contatoForm.checkValidity()) {
        contatoForm.reportValidity();
        return;
      }

      const webhookUrl = contatoForm.dataset.webhookUrl;

      if (!webhookUrl) {
        setFormStatus(status, 'Configure a URL do webhook n8n no atributo data-webhook-url.', 'error');
        return;
      }

      const formData = new FormData(contatoForm);
      const payload = {
        nome: String(formData.get('nome') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        mensagem: String(formData.get('mensagem') || '').trim(),
        origem: 'portfolio-contato',
        pagina: window.location.href,
        enviadoEm: new Date().toISOString()
      };

      try {
        toggleFormLoading(submitButton, true, 'Enviando...');
        setFormStatus(status, 'Enviando sua mensagem...', 'loading');

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Falha no envio');
        }

        contatoForm.reset();
        setFormStatus(status, 'Mensagem enviada com sucesso. Obrigado pelo contato!', 'success');
      } catch (error) {
        setFormStatus(status, 'Nao foi possivel enviar agora. Tente novamente ou use o e-mail ao lado.', 'error');
      } finally {
        toggleFormLoading(submitButton, false, defaultButtonText);
      }
    });
  }
});

function setFormStatus(element, message, type) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.dataset.status = type;
}

function toggleFormLoading(button, isLoading, text) {
  if (!button) {
    return;
  }

  button.disabled = isLoading;
  button.textContent = text;
}
