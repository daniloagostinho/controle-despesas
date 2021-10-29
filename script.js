const trasacoesUl = document.querySelector('#transactions')
const saldoh1 = document.querySelector('#balance')
const receitap = document.querySelector('#money-plus')
const despesap = document.querySelector('#money-minus')
const form = document.querySelector('#form')

let inputTransacaoNome = document.querySelector('#text')
let inputTransacaoValor = document.querySelector('#amount')

const localStorageTransacoes = JSON.parse(localStorage.getItem('transacoes'))
let transacoes = localStorage.getItem('transacoes') !== null ? localStorageTransacoes : []
console.log(transacoes)     

const deletarProduto = id => {
    transacoes = transacoes.filter(transacao => transacao.id != id)
    iniciar()
    atualizaLocalstorage()
}

const adicionaTransacaoNoDom = ({ valor, nome, id }) => {
    const li = document.createElement('li');
    const operador = valor > 0 ? '+' : '-'
    const CSSclass = valor > 0 ? 'plus' : 'minus'
    li.classList.add(CSSclass)
    li.innerHTML = `${nome}<span>${operador} ${Math.abs(valor)}</span>
 <button class="delete-btn" onClick="deletarProduto(${id})">x</button>`
    trasacoesUl.appendChild(li)
}

const pegarDespesas = saldoTransacoes => Math.abs(saldoTransacoes
    .filter(despesa => despesa < 0)
    .reduce((accumulador, despesa) => accumulador + despesa, 0))
    .toFixed(2)

const pegarReceitas = saldoTransacoes => saldoTransacoes
    .filter(transacao => transacao > 0)
    .reduce((accumulador, receita) => accumulador + receita, 0)
    .toFixed(2)

const pegarTotalSaldo = saldoTransacoes => saldoTransacoes
    .reduce((accumulador, saldo) => accumulador + saldo, 0)
    .toFixed(2)
 
const atualizarValoresSaldo = () => {
    const saldoTransacoes = transacoes
        .map(({valor}) => valor)
    const totalSaldo = pegarTotalSaldo(saldoTransacoes)
    const receita = pegarReceitas(saldoTransacoes)
    const despesas = pegarDespesas(saldoTransacoes)

    saldoh1.textContent = `R$ ${totalSaldo}`
    receitap.textContent = `R$ ${receita}`
    despesap.textContent = `R$ ${despesas}`

}
const iniciar = () => {
    trasacoesUl.innerHTML = ``
    transacoes.forEach(adicionaTransacaoNoDom)
    atualizarValoresSaldo()
}

iniciar()

atualizaLocalstorage = () => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes))
}

const geradorId = () => Math.round(Math.random() * 1000)

const adicionaTransacaoNoArray = (transacaoNome, transacaoValor) => {
    transacoes.push({ id: geradorId(), nome: transacaoNome, valor: Number(transacaoValor) })
}


const limparInputs = () => {
    inputTransacaoNome.value = ''
    inputTransacaoValor.value = ''
}

const lidarComTransacaoEnviada = evento => {
    evento.preventDefault();
    const verificaSeVazio = inputTransacaoNome.value.trim() === '' || inputTransacaoValor.value.trim() === ''
    const transacaoNome = inputTransacaoNome.value.trim()
    const transacaoValor = inputTransacaoValor.value.trim()

    if (verificaSeVazio) {
        alert('preencha os campos!')
        return;
    }
    adicionaTransacaoNoArray(transacaoNome, transacaoValor)
    iniciar()
    atualizaLocalstorage()
    limparInputs()
}

form.addEventListener('submit', lidarComTransacaoEnviada)