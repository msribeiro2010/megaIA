// =====================================================
// RELÓGIO E DATA - Widget Flutuante
// =====================================================

class ClockDateWidget {
    constructor(options = {}) {
        this.options = {
            showClock: options.showClock !== false,
            showDate: options.showDate !== false,
            timezone: options.timezone || 'Europe/Amsterdam',
            dateFormat: options.dateFormat || 'long', // 'short', 'medium', 'long', 'full'
            locale: options.locale || 'pt-NL',
            position: options.position || 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
            ...options
        };

        this.widget = null;
        this.clockInterval = null;

        this.init();
    }

    init() {
        this.createWidget();
        this.updateDateTime();
        this.startClock();
    }

    createWidget() {
        // Criar elemento do widget
        this.widget = document.createElement('div');
        this.widget.className = 'clock-date-widget';
        this.widget.id = 'clockDateWidget';

        // Aplicar posição
        this.applyPosition();

        // Criar estrutura HTML
        const html = `
            ${this.options.showClock ? '<div class="clock" id="clockTime">--:--:--</div>' : ''}
            ${this.options.showDate ? '<div class="date" id="clockDate">--/--/----</div>' : ''}
        `;

        this.widget.innerHTML = html;

        // Adicionar ao body
        document.body.appendChild(this.widget);
    }

    applyPosition() {
        // Remover classes de posição antigas
        this.widget.classList.remove('top-right', 'top-left', 'bottom-right', 'bottom-left');

        // Adicionar nova posição
        this.widget.classList.add(this.options.position);

        // Aplicar estilos CSS baseado na posição
        const positions = {
            'top-right': { top: '80px', right: '20px', bottom: 'auto', left: 'auto' },
            'top-left': { top: '80px', left: '20px', bottom: 'auto', right: 'auto' },
            'bottom-right': { bottom: '20px', right: '20px', top: 'auto', left: 'auto' },
            'bottom-left': { bottom: '20px', left: '20px', top: 'auto', right: 'auto' }
        };

        const pos = positions[this.options.position];
        Object.assign(this.widget.style, pos);
    }

    updateDateTime() {
        const now = new Date();

        // Atualizar relógio
        if (this.options.showClock) {
            const clockElement = document.getElementById('clockTime');
            if (clockElement) {
                const timeString = now.toLocaleTimeString(this.options.locale, {
                    timeZone: this.options.timezone,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                clockElement.textContent = timeString;
            }
        }

        // Atualizar data
        if (this.options.showDate) {
            const dateElement = document.getElementById('clockDate');
            if (dateElement) {
                const dateOptions = this.getDateFormatOptions();
                const dateString = now.toLocaleDateString(this.options.locale, dateOptions);
                dateElement.textContent = dateString;
            }
        }
    }

    getDateFormatOptions() {
        const formats = {
            'short': {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            },
            'medium': {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            },
            'long': {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            },
            'full': {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                timeZoneName: 'short'
            }
        };

        return {
            timeZone: this.options.timezone,
            ...formats[this.options.dateFormat]
        };
    }

    startClock() {
        // Atualizar a cada segundo
        this.clockInterval = setInterval(() => {
            this.updateDateTime();
        }, 1000);
    }

    stopClock() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }
    }

    show() {
        if (this.widget) {
            this.widget.style.display = 'block';
        }
    }

    hide() {
        if (this.widget) {
            this.widget.style.display = 'none';
        }
    }

    destroy() {
        this.stopClock();
        if (this.widget && this.widget.parentNode) {
            this.widget.parentNode.removeChild(this.widget);
        }
    }

    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.applyPosition();
        this.updateDateTime();
    }
}

// =====================================================
// INICIALIZAÇÃO AUTOMÁTICA
// =====================================================

let clockWidget = null;

// Função para inicializar com configurações do Supabase ou padrão
async function initClockDateWidget() {
    try {
        // Tentar buscar configurações do Supabase
        if (typeof SupabaseHelper !== 'undefined') {
            const { data: configs } = await SupabaseHelper.getConfiguracoes();

            if (configs) {
                const showClock = configs.mostrar_relogio === 'true';
                const showDate = configs.mostrar_data === 'true';
                const timezone = configs.fuso_horario || 'Europe/Amsterdam';

                // Criar widget com configurações do banco
                clockWidget = new ClockDateWidget({
                    showClock,
                    showDate,
                    timezone,
                    dateFormat: 'long',
                    locale: 'pt-NL',
                    position: 'top-right'
                });

                console.log('✅ Relógio inicializado com configurações do Supabase');
                return;
            }
        }

        // Configurações padrão se Supabase não estiver disponível
        clockWidget = new ClockDateWidget({
            showClock: true,
            showDate: true,
            timezone: 'Europe/Amsterdam',
            dateFormat: 'long',
            locale: 'pt-NL',
            position: 'top-right'
        });

        console.log('✅ Relógio inicializado com configurações padrão');
    } catch (error) {
        console.error('Erro ao inicializar relógio:', error);

        // Fallback para configurações padrão
        clockWidget = new ClockDateWidget();
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClockDateWidget);
} else {
    initClockDateWidget();
}

// Exportar para uso global
window.ClockDateWidget = ClockDateWidget;
window.clockWidget = clockWidget;
