// =====================================================
// CONFIGURAÇÃO DO SUPABASE
// =====================================================

// ⚠️ IMPORTANTE: Substitua com suas credenciais do Supabase
// Obtenha em: https://app.supabase.com/project/SEU_PROJETO/settings/api

const SUPABASE_CONFIG = {
    url: 'https://rqisgojbqsplmxsfhrxy.supabase.co', // Ex: https://xyzcompany.supabase.co
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxaXNnb2picXNwbG14c2Zocnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MzU2NTUsImV4cCI6MjA3ODAxMTY1NX0.7_bwffW8mTKbZt_KyG3MKO8APYYT76vS5moqa9YQ2ro' // Chave pública (anon/public)
};

// Verificar se as credenciais foram configuradas
if (SUPABASE_CONFIG.url === 'SUA_URL_DO_SUPABASE' || SUPABASE_CONFIG.anonKey === 'SUA_ANON_KEY_DO_SUPABASE') {
    console.error('⚠️ Configure suas credenciais do Supabase em js/supabase-config.js');
}

// Inicializar cliente do Supabase
let supabaseClient = null;

// Função para inicializar o Supabase
function initSupabase() {
    console.log('🔄 initSupabase() chamado');

    if (supabaseClient !== null) {
        console.log('✅ Cliente já existe, retornando cache');
        return supabaseClient;
    }

    // Verificar se a biblioteca do Supabase está carregada
    if (!window.supabase || !window.supabase.createClient) {
        console.error('❌ Biblioteca do Supabase não carregada. Verifique o CDN.');
        console.log('window.supabase:', window.supabase);
        return null;
    }

    try {
        console.log('🔑 Criando cliente com URL:', SUPABASE_CONFIG.url);
        supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        console.log('✅ Supabase inicializado com sucesso');
        console.log('Cliente criado:', !!supabaseClient);
        return supabaseClient;
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
        return null;
    }
}

// Expor globalmente para compatibilidade
window.initSupabase = initSupabase;

// Aguardar DOM estar pronto antes de inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        try {
            console.log('🔄 Inicializando Supabase após DOM ready...');
            const client = initSupabase();
            if (client) {
                window.supabaseClient = client;
                console.log('✅ window.supabaseClient definido');
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar Supabase:', error);
        }
    });
} else {
    // DOM já está pronto, inicializar imediatamente
    try {
        console.log('🔄 Inicializando Supabase imediatamente...');
        const client = initSupabase();
        if (client) {
            window.supabaseClient = client;
            console.log('✅ window.supabaseClient definido');
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
    }
}

// =====================================================
// HELPER FUNCTIONS PARA O SUPABASE
// =====================================================

const SupabaseHelper = {
    // Inicializar cliente
    init() {
        return initSupabase();
    },

    // Verificar se usuário está autenticado
    async isAuthenticated() {
        const client = initSupabase();
        if (!client) return false;

        try {
            const { data: { session } } = await client.auth.getSession();
            return session !== null;
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return false;
        }
    },

    // Obter usuário atual
    async getCurrentUser() {
        const client = initSupabase();
        if (!client) return null;

        try {
            const { data: { user } } = await client.auth.getUser();
            return user;
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            return null;
        }
    },

    // Login
    async signIn(email, password) {
        const client = initSupabase();
        if (!client) return { error: 'Supabase não inicializado' };

        try {
            const { data, error } = await client.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erro no login:', error);
            return { data: null, error: error.message };
        }
    },

    // Logout
    async signOut() {
        const client = initSupabase();
        if (!client) return { error: 'Supabase não inicializado' };

        try {
            const { error } = await client.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erro no logout:', error);
            return { error: error.message };
        }
    },

    // Buscar todos os produtos
    async getProdutos() {
        const client = initSupabase();
        if (!client) return { data: null, error: 'Supabase não inicializado' };

        try {
            const { data, error } = await client
                .from('produtos')
                .select('*')
                .eq('ativo', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return { data: null, error: error.message };
        }
    },

    // Buscar produto por ID
    async getProdutoById(id) {
        const client = initSupabase();
        if (!client) return { data: null, error: 'Supabase não inicializado' };

        try {
            const { data, error } = await client
                .from('produtos')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return { data: null, error: error.message };
        }
    },

    // Criar produto
    async createProduto(produto) {
        const client = initSupabase();
        if (!client) return { data: null, error: 'Supabase não inicializado' };

        try {
            const { data, error } = await client
                .from('produtos')
                .insert([produto])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            return { data: null, error: error.message };
        }
    },

    // Atualizar produto
    async updateProduto(id, produto) {
        const client = initSupabase();
        if (!client) return { data: null, error: 'Supabase não inicializado' };

        try {
            const { data, error } = await client
                .from('produtos')
                .update(produto)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return { data: null, error: error.message };
        }
    },

    // Deletar produto
    async deleteProduto(id) {
        const client = initSupabase();
        if (!client) return { error: 'Supabase não inicializado' };

        try {
            const { error } = await client
                .from('produtos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            return { error: error.message };
        }
    },

    // Upload de imagem
    async uploadImagem(file, folder = 'produtos') {
        const client = initSupabase();
        if (!client) return { data: null, error: 'Supabase não inicializado' };

        try {
            // Extrair extensão do arquivo
            const fileExtension = file.name.split('.').pop().toLowerCase();

            // Criar nome de arquivo seguro
            // Usar apenas timestamp + extensão para evitar qualquer problema com caracteres especiais
            const safeFileName = `${Date.now()}.${fileExtension}`;
            const filePath = `${folder}/${safeFileName}`;

            console.log(`📤 Upload para bucket 'produtos'`);
            console.log(`📝 Nome original: ${file.name}`);
            console.log(`✨ Nome seguro: ${safeFileName}`);
            console.log(`📍 Caminho completo: ${filePath}`);

            const { data, error } = await client.storage
                .from('produtos')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('❌ Erro no upload:', error);
                throw error;
            }

            console.log('✅ Upload bem-sucedido:', data);

            // Obter URL pública da imagem
            const { data: { publicUrl } } = client.storage
                .from('produtos')
                .getPublicUrl(filePath);

            console.log('🔗 URL pública gerada:', publicUrl);

            return { data: { path: filePath, url: publicUrl }, error: null };
        } catch (error) {
            console.error('❌ Erro ao fazer upload:', error);
            return { data: null, error: error.message };
        }
    },

    // Deletar imagem
    async deleteImagem(path) {
        const client = initSupabase();
        if (!client) return { error: 'Supabase não inicializado' };

        try {
            const { error } = await client.storage
                .from('produtos')
                .remove([path]);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erro ao deletar imagem:', error);
            return { error: error.message };
        }
    },

    // Buscar categorias
    async getCategorias() {
        const client = initSupabase();
        if (!client) return { data: null, error: 'Supabase não inicializado' };

        try {
            const { data, error } = await client
                .from('categorias')
                .select('*')
                .eq('ativo', true)
                .order('ordem', { ascending: true });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return { data: null, error: error.message };
        }
    },

    // Criar pedido
    async createPedido(pedido) {
        const client = initSupabase();
        if (!client) return { data: null, error: 'Supabase não inicializado' };

        try {
            // Gerar número do pedido
            const { data: numeroData, error: numeroError } = await client
                .rpc('gerar_numero_pedido');

            if (numeroError) throw numeroError;

            pedido.numero_pedido = numeroData;

            const { data, error } = await client
                .from('pedidos')
                .insert([pedido])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            return { data: null, error: error.message };
        }
    },

    // Buscar código promocional
    async getCodigoPromocional(codigo) {
        const client = initSupabase();
        if (!client) return { data: null, error: 'Supabase não inicializado' };

        try {
            const { data, error } = await client
                .from('codigos_promocionais')
                .select('*')
                .eq('codigo', codigo.toUpperCase())
                .eq('ativo', true)
                .single();

            if (error) throw error;

            // Verificar validade
            const agora = new Date();
            if (data.data_inicio && new Date(data.data_inicio) > agora) {
                return { data: null, error: 'Cupom ainda não está ativo' };
            }
            if (data.data_fim && new Date(data.data_fim) < agora) {
                return { data: null, error: 'Cupom expirado' };
            }
            if (data.limite_uso && data.vezes_usado >= data.limite_uso) {
                return { data: null, error: 'Cupom esgotado' };
            }

            return { data, error: null };
        } catch (error) {
            console.error('Erro ao buscar código promocional:', error);
            return { data: null, error: 'Cupom inválido' };
        }
    },

    // Buscar configurações
    async getConfiguracoes() {
        const client = initSupabase();
        if (!client) return { data: null, error: 'Supabase não inicializado' };

        try {
            const { data, error } = await client
                .from('configuracoes')
                .select('*');

            if (error) throw error;

            // Converter array em objeto
            const config = {};
            data.forEach(item => {
                config[item.chave] = item.valor;
            });

            return { data: config, error: null };
        } catch (error) {
            console.error('Erro ao buscar configurações:', error);
            return { data: null, error: error.message };
        }
    }
};

// Exportar para uso global
window.SupabaseHelper = SupabaseHelper;
