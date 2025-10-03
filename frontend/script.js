/*
 * ===================================================================================
 * TÍTULO: Lógica do Frontend (script.js)
 * ===================================================================================
 *
 * FUNCIONALIDADE:
 * Este arquivo é responsável por:
 * 1. Capturar o evento de submissão do formulário.
 * 2. Coletar os dados preenchidos pelo usuário.
 * 3. Enviar esses dados para o nosso backend (servidor Node.js) via uma requisição HTTP.
 * 4. Receber a resposta do backend e exibir uma mensagem de sucesso ou erro para o usuário.
 *
 * CONCEITOS:
 * - DOM (Document Object Model): É a representação do nosso HTML que o JavaScript consegue entender e manipular.
 * - Event Listeners: Mecanismo que permite ao nosso código "escutar" por ações do usuário (como um clique ou o envio de um formulário) e reagir a elas.
 * - Fetch API: A ferramenta moderna dos navegadores para fazer requisições de rede (HTTP) de forma assíncrona.
 */

// -----------------------------------------------------------------------------------
// SUBTÍTULO: Preparação e Seleção de Elementos do DOM
// -----------------------------------------------------------------------------------

// CONCEITO: Evento 'DOMContentLoaded'
// Este é um "ouvinte de eventos" que espera toda a página HTML ser completamente carregada e analisada
// antes de executar o código JavaScript dentro dele. É uma boa prática fundamental para evitar
// que nosso script tente encontrar um elemento que ainda não existe na página.
document.addEventListener("DOMContentLoaded", () => {
  // FUNCIONALIDADE: "Capturamos" os elementos HTML com os quais queremos interagir, usando seus IDs.
  // Guardamos uma referência a eles em constantes para fácil acesso.
  const form = document.getElementById("cadastroForm"); // Nosso formulário
  const mensagemDiv = document.getElementById("mensagem"); // Onde exibiremos as respostas

  // -----------------------------------------------------------------------------------
  // SUBTÍTULO: Escutando o Evento de Submissão do Formulário
  // -----------------------------------------------------------------------------------
  // FUNCIONALIDADE:
  // Adicionamos um "espião" (Event Listener) ao nosso formulário que será acionado
  // sempre que o evento 'submit' ocorrer (ou seja, quando o usuário clicar no botão 'Cadastrar').
  // A função 'async' nos permite usar 'await' para lidar com operações assíncronas (como a requisição de rede) de forma mais limpa.
  form.addEventListener("submit", async (event) => {
    // --- PASSO 1: Prevenir o Comportamento Padrão ---
    // FUNCIONALIDADE: Impede que o navegador recarregue a página, que é o comportamento
    // padrão de um formulário. Isso nos dá controle total sobre o que acontece a seguir.
    event.preventDefault();

    // --- PASSO 2: Coletar os Dados do Formulário ---
    // CONCEITO: FormData
    // O objeto 'FormData' é uma maneira fácil de capturar todos os pares de 'name' e 'value' de um formulário.
    const formData = new FormData(form);

    // Convertemos o 'formData' para um objeto JavaScript simples, que é mais fácil de manipular e enviar como JSON.
    const dados = Object.fromEntries(formData.entries());

    // -----------------------------------------------------------------------------------
    // SUBTÍTULO: A Requisição para o Backend (A "Ligação")
    // -----------------------------------------------------------------------------------
    /*
     * CONCEITO: try...catch
     * Usamos este bloco para lidar com possíveis erros de rede. Se a requisição 'fetch' falhar
     * (ex: o servidor está desligado), o código dentro do bloco 'catch' será executado.
     */
    try {
      // --- PASSO 3: Enviar os Dados ---
      // CONCEITO: Fetch API
      // 'fetch' é a função que faz a chamada HTTP. 'await' pausa a execução do nosso código aqui
      // até que o servidor responda.
      const response = await fetch("http://localhost:3000/cadastro", {
        // method: 'POST': Informamos que estamos ENVIANDO dados para criar um novo recurso.
        method: "POST",
        // headers: 'cabeçalhos' que dão informações sobre nossa requisição.
        headers: {
          // 'Content-Type': 'application/json': Avisa ao nosso backend que os dados no corpo (body) estão no formato JSON.
          "Content-Type": "application/json",
        },
        // body: O corpo da requisição, contendo os dados.
        // JSON.stringify(dados): Converte nosso objeto JavaScript para uma string no formato JSON, que é o formato padrão para comunicação em APIs.
        body: JSON.stringify(dados),
      });

      // --- PASSO 4: Tratar a Resposta do Servidor ---
      // Verificamos se a resposta do servidor foi bem-sucedida (ex: status 201 Created).
      if (response.ok) {
        // Convertemos a resposta JSON do servidor de volta para um objeto JavaScript.
        const resultado = await response.json();

        // Mostramos a mensagem de sucesso na tela para o usuário.
        mensagemDiv.textContent = resultado.message;
        mensagemDiv.className = "mensagem sucesso"; // Adiciona a classe CSS para o estilo verde.

        // Limpa todos os campos do formulário para um novo cadastro.
        form.reset();
      } else {
        // Se o servidor retornou um erro (ex: status 500), mostramos uma mensagem de erro genérica.
        mensagemDiv.textContent = "Erro ao cadastrar. Tente novamente.";
        mensagemDiv.className = "mensagem erro";
      }
    } catch (error) {
      // Se o 'fetch' falhou (ex: sem conexão), o bloco 'catch' é executado.
      console.error("Erro na requisição:", error);
      mensagemDiv.textContent =
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";
      mensagemDiv.className = "mensagem erro";
    }
  });
});
