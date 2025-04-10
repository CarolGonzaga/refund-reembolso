// Seleciona os campos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount"); // Campo do valor da despesa
const expense = document.getElementById("expense"); // Campo do nome da despesa
const category = document.getElementById("category"); // Campo de seleção de categoria

// Seleciona os elementos da interface relacionados à lista de despesas
const expenseList = document.querySelector("ul"); // Lista onde as despesas serão exibidas
const expensesQuantity = document.querySelector("#expense-qt"); // Elemento que mostra a quantidade de despesas
const expensesTotal = document.querySelector("#expense-total"); // Elemento que mostra o valor total das despesas

// Função que formata um valor para o formato de moeda brasileira (R$)
function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Função que adiciona uma nova despesa à lista
function expenseAdd(newExpense) {
  try {
    // Cria um item de lista (li) para a nova despesa
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Define o conteúdo HTML do item da despesa, incluindo:
    // - ícone da categoria
    // - nome da despesa e nome da categoria
    // - valor da despesa
    // - ícone de remoção
    expenseItem.innerHTML = `
        <img src="assets/images/${newExpense.category_id}.svg" alt="Ícone de ${
      newExpense.category_name
    }" />

        <div class="expense-info">
            <strong>${newExpense.expense}</strong>
            <span>${newExpense.category_name}</span>
        </div>

        <span class="expense-amount">
            <small>R$</small>${newExpense.amount
              .toUpperCase()
              .replace("R$", "")}
        </span>

        <img src="assets/images/remove.svg" alt="remover" class="remove-icon" />
    `;

    // Adiciona o item de despesa à lista (ul)
    expenseList.appendChild(expenseItem);

    // Limpa os campos do formulário após adicionar a despesa
    formClear();

    // Atualiza os totais de despesas (quantidade e valor)
    updateTotals();
  } catch (error) {
    alert("Erro ao adicionar despesa! Tente novamente mais tarde.");
    console.log(error);
  }
}

// Função que atualiza o total de despesas e a quantidade na interface
function updateTotals() {
  try {
    const items = expenseList.children; // Todos os itens da lista (li)

    // Atualiza a contagem de despesas
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;

    // Percorre todos os itens para somar os valores
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      // Limpa o texto para extrair somente os números e converte para float
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "") // Remove tudo que não for número ou vírgula
        .replace(",", "."); // Converte vírgula para ponto
      value = parseFloat(value);

      // Se não for um número válido, exibe alerta e interrompe
      if (isNaN(value)) {
        return alert("Erro ao calcular. O valor não é válido.");
      }

      total += Number(value);
    }

    // Cria o símbolo "R$" separadamente para estilização
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formata o total e remove o símbolo (já vai ser adicionado separadamente)
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    // Atualiza o elemento do total com o novo valor
    expensesTotal.innerHTML = "";
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    console.log(error);
    alert("Erro ao atualizar o total de despesas.");
  }
}

// Função que limpa os campos do formulário
function formClear() {
  expense.value = ""; // Limpa campo de nome da despesa
  category.value = ""; // Limpa seleção de categoria
  amount.value = ""; // Limpa campo de valor

  expense.focus(); // Foca novamente no campo de nome
}

// Evento que formata automaticamente o valor digitado no campo "amount"
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, ""); // Remove tudo que não for número
  value = Number(value) / 100; // Converte para valor em reais (centavos)
  amount.value = formatCurrencyBRL(value); // Atualiza o input com o valor formatado
};

// Evento de envio do formulário
form.onsubmit = (event) => {
  event.preventDefault(); // Impede o comportamento padrão de envio

  // Cria um novo objeto de despesa com os dados preenchidos
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense); // Adiciona a despesa na lista
  updateTotals(); // Atualiza os totais
};

// Evento que detecta cliques na lista de despesas
expenseList.onclick = (event) => {
  // Verifica se o clique foi no ícone de remover
  if (event.target.classList.contains("remove-icon")) {
    const expenseItem = event.target.closest(".expense"); // Encontra o item pai
    expenseItem.remove(); // Remove o item da lista
  }

  // Atualiza os totais após remover
  updateTotals();
};
