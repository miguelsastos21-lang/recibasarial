'use client';

import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import Logotipo from '@/logotipo.png';

// Tipos de documentos suportados
type TipoDocumento = 'RECIBO_SALARIO' | 'FATURA_PROFORMA' | 'FATURA_RECIBO';

// Base de dados cadastrada dos funcionários
const FUNCIONARIOS_CADASTRADOS = [
  {
    nome: 'ANGELO MARCELINO',
    departamento: 'Dep. Jurídico e Vistos',
    funcao: 'Especialista em Documentação',
    codigo: '003.090502026',
    salarioBase: 50000,
    subsidioTransporte: 10000,
    subsidioAlimentacao: 30000,
    assiduidade: 10000,
  },
  {
    nome: 'BEATRIZ SILVA',
    departamento: 'Dep. Recursos Humanos',
    funcao: 'Técnica de RH',
    codigo: '004.090502026',
    salarioBase: 60000,
    subsidioTransporte: 15000,
    subsidioAlimentacao: 30000,
    assiduidade: 10000,
  },
  {
    nome: 'AZEVEDO DOS SANTOS',
    departamento: 'Dep. Contabilidade',
    funcao: 'Contabilista',
    codigo: '005.090502026',
    salarioBase: 70000,
    subsidioTransporte: 15000,
    subsidioAlimentacao: 35000,
    assiduidade: 10000,
  },
  {
    nome: 'EMÍLIA COSTA',
    departamento: 'Dep. Comercial & Turismo',
    funcao: 'Consultora de Viagens',
    codigo: '006.090502026',
    salarioBase: 55000,
    subsidioTransporte: 10000,
    subsidioAlimentacao: 30000,
    assiduidade: 10000,
  },
];

export default function DocumentoCorporativoViagens() {
  const agora = new Date();
  const dataAtual = agora.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
  const horaAtual = `${String(agora.getHours()).padStart(2, '0')}h${String(agora.getMinutes()).padStart(2, '0')}`;

  const [tipoDoc, setTipoDoc] = useState<TipoDocumento>('RECIBO_SALARIO');
  const [selectedFunc, setSelectedFunc] = useState('ANGELO MARCELINO');
  const [numeroContaInput, setNumeroContaInput] = useState('8040853910001');

  // Estado geral do formulário adaptado a viagens, vistos e passaportes
  const [formData, setFormData] = useState({
    ...FUNCIONARIOS_CADASTRADOS[0],
    clienteNome: 'CLIENTE EXEMPLO, S.A.',
    clientNif: '5001234567',
    clientEndereco: 'Luanda, Talatona',
    documentoNumero: 'REC-2026-001',
    data: dataAtual,
    hora: horaAtual,
    irt: '------',
    bonosSalarial: '------',
    subsidioSaude: '------',
    metodoPagamento: 'Transferência Bancária | Imediata',
    detalhesBanco: 'BCI. Transação: 677630927',
    numeroConta: '8040853910001',
    // Itens editáveis para Passaportes, Vistos e Viagens
    itensFatura: [
      { descricao: 'Pacote Viagem Turística - Dubai', quantidade: 1, precoUnitario: 250000 },
      { descricao: 'Taxas de Reserva e Emissão', quantidade: 1, precoUnitario: 25000 },
    ],
  });

  const handleMudarTipoDoc = (novoTipo: TipoDocumento) => {
    setTipoDoc(novoTipo);
    let prefixo = 'REC';
    if (novoTipo === 'FATURA_PROFORMA') prefixo = 'PRO';
    if (novoTipo === 'FATURA_RECIBO') prefixo = 'FR';
    
    setFormData((prev) => ({
      ...prev,
      documentoNumero: `${prefixo}-${Math.floor(100 + Math.random() * 900)}`,
    }));
  };

  const handleGerarDados = () => {
    const funcionario = FUNCIONARIOS_CADASTRADOS.find((f) => f.nome === selectedFunc);
    if (!funcionario) return;

    const novaData = new Date();
    const dataFormatada = novaData.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
    const horaFormatada = `${String(novaData.getHours()).padStart(2, '0')}h${String(novaData.getMinutes()).padStart(2, '0')}`;

    setFormData((prev) => ({
      ...prev,
      ...funcionario,
      data: dataFormatada,
      hora: horaFormatada,
      detalhesBanco: 'BCI. Transação: ' + Math.floor(100000000 + Math.random() * 900000000),
      numeroConta: numeroContaInput,
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: !isNaN(Number(value)) && name !== 'codigo' && name !== 'data' && name !== 'hora' && name !== 'detalhesBanco' && name !== 'metodoPagamento' && name !== 'numeroConta' && name !== 'clientNif' && name !== 'clientEndereco' && name !== 'clienteNome' && name !== 'departamento' && name !== 'funcao' && name !== 'nome'
        ? Number(value) 
        : value,
    }));
  };

  // Função para atualizar os itens dinâmicos da fatura (descrição, quantidade ou preço)
  const handleItemChange = (index: number, campo: string, valor: string | number) => {
    const novosItens = [...formData.itensFatura];
    novosItens[index] = {
      ...novosItens[index],
      [campo]: campo === 'quantidade' || campo === 'precoUnitario' ? Number(valor) || 0 : valor,
    };
    setFormData((prev) => ({
      ...prev,
      itensFatura: novosItens,
    }));
  };

  const calcularTotal = () => {
    if (tipoDoc === 'RECIBO_SALARIO') {
      return (
        (Number(formData.salarioBase) || 0) +
        (Number(formData.subsidioTransporte) || 0) +
        (Number(formData.subsidioAlimentacao) || 0) +
        (Number(formData.assiduidade) || 0)
      );
    } else {
      return formData.itensFatura.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
    }
  };

  const totalGeral = calcularTotal();

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-800 font-sans print:bg-white print:p-0">
      
      {/* PAINEL DE CONTROLO CORPORATIVO */}
      <div className="max-w-3xl mx-auto mb-6 bg-white p-6 rounded-xl shadow-md border border-slate-200 print:hidden space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-3 gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              ✈️ Gestão de Documentos - Viagens & Vistos
            </h3>
            <p className="text-xs text-slate-500">Alternar entre Recibo Salarial, Fatura Pró-forma e Fatura-Recibo.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border">
            <button
              onClick={() => handleMudarTipoDoc('RECIBO_SALARIO')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${tipoDoc === 'RECIBO_SALARIO' ? 'bg-orange-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              Recibo Salarial
            </button>
            <button
              onClick={() => handleMudarTipoDoc('FATURA_PROFORMA')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${tipoDoc === 'FATURA_PROFORMA' ? 'bg-orange-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              Fatura Pró-forma
            </button>
            <button
              onClick={() => handleMudarTipoDoc('FATURA_RECIBO')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${tipoDoc === 'FATURA_RECIBO' ? 'bg-orange-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              Fatura-Recibo
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Selecionar Colaborador (Responsável / Emissor):
            </label>
            <select
              value={selectedFunc}
              onChange={(e) => setSelectedFunc(e.target.value)}
              className="w-full border border-slate-300 p-2 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              {FUNCIONARIOS_CADASTRADOS.map((f) => (
                <option key={f.nome} value={f.nome}>
                  {f.nome} ({f.funcao})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nº de Conta / Referência Bancária:
            </label>
            <input
              type="text"
              value={numeroContaInput}
              onChange={(e) => setNumeroContaInput(e.target.value)}
              className="w-full border border-slate-300 p-2 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Ex: 8040853910001"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center pt-2 border-t">
          <button
            onClick={handleGerarDados}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-sm transition flex items-center gap-2"
          >
            🔄 Carregar Dados do Colaborador
          </button>

          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-5 rounded-lg text-xs shadow-sm transition flex items-center gap-2 ml-auto"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* DOCUMENTO PRINCIPAL */}
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 border border-slate-200 shadow-xl rounded-none print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div className="w-56">
            <Image 
              src={Logotipo}
              alt="Sexto Continente"
              width={1000}
              height={85}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <div className="text-right text-[10px] text-slate-600 leading-tight max-w-[260px]">
            <p className="font-bold text-slate-800">AGÊNCIA DE VIAGENS & TURISMO (SU), LDA.</p>
            <p>NIF: 5002828693</p>
            <p>SEDE: BENGUELA, LARGO DA PEÇA, RUA JOÃO DE DEUS.</p>
            <p className="text-orange-600 font-medium">Especialistas em Passaportes, Vistos & Turismo</p>
          </div>
        </div>

        {/* Título */}
        <div className="text-center my-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-wider uppercase">
            {tipoDoc === 'RECIBO_SALARIO' && 'RECIBO SALARIAL'}
            {tipoDoc === 'FATURA_PROFORMA' && 'FATURA PRÓ-FORMA'}
            {tipoDoc === 'FATURA_RECIBO' && 'FATURA-RECIBO'}
          </h2>
          <div className="flex justify-center items-center gap-2 mt-1">
            <span className="text-xs text-slate-400 font-medium">Nº do Documento:</span>
            <input
              type="text"
              name="documentoNumero"
              value={formData.documentoNumero}
              onChange={handleInputChange}
              className="text-xs font-bold text-slate-700 w-28 text-center border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
            />
          </div>
        </div>

        {/* Secção de Dados */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm border-b pb-5">
          {tipoDoc === 'RECIBO_SALARIO' ? (
            <div>
              <p className="font-bold text-slate-700 text-xs mb-1 uppercase">COLABORADOR:</p>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full font-bold uppercase border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent text-sm"
              />
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                className="w-full text-xs text-slate-600 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
              />
              <input
                type="text"
                name="funcao"
                value={formData.funcao}
                onChange={handleInputChange}
                className="w-full text-xs text-slate-600 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
              />
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                className="w-full font-semibold text-xs text-slate-500 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
              />
            </div>
          ) : (
            <div>
              <p className="font-bold text-slate-700 text-xs mb-1 uppercase">EXMO.(S) SR.(S) / PASSAGEIRO:</p>
              <input
                type="text"
                name="clienteNome"
                value={formData.clienteNome}
                onChange={handleInputChange}
                className="w-full font-bold uppercase border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent text-sm"
              />
              <input
                type="text"
                name="clientNif"
                value={`NIF: ${formData.clientNif}`}
                onChange={(e) => setFormData({...formData, clientNif: e.target.value.replace('NIF: ', '')})}
                className="w-full text-xs text-slate-600 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
              />
              <input
                type="text"
                name="clientEndereco"
                value={formData.clientEndereco}
                onChange={handleInputChange}
                className="w-full text-xs text-slate-600 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
              />
              <div className="mt-2 pt-2 border-t border-dashed text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Emitido por:</span> {formData.nome}
              </div>
            </div>
          )}

          <div className="text-right">
            <p className="font-bold text-slate-700 text-xs mb-1 uppercase">REGISTO DE EMISSÃO:</p>
            <div className="flex justify-end gap-2 text-xs items-center">
              <span className="text-slate-400">DATA:</span>
              <input
                type="text"
                name="data"
                value={formData.data}
                onChange={handleInputChange}
                className="w-24 text-right border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent font-semibold"
              />
            </div>
            <div className="flex justify-end gap-2 text-xs items-center">
              <span className="text-slate-400">HORA:</span>
              <input
                type="text"
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                className="w-24 text-right border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Tabela de Itens Editáveis */}
        <div className="max-w-xl mx-auto my-6 px-2">
          <div className="flex justify-between border-b pb-2 mb-3 font-bold text-xs tracking-wider text-slate-600 uppercase">
            <span>Descrição do Serviço / Item</span>
            <span className="text-right">Qtd / Preço Unitário (Kz)</span>
          </div>

          {tipoDoc === 'RECIBO_SALARIO' ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Salário Base</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="salarioBase"
                    value={formData.salarioBase}
                    onChange={handleInputChange}
                    className="text-right w-28 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
                  />
                  <span className="ml-1 text-xs text-slate-500">kz</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>Subsídio de Transporte</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="subsidioTransporte"
                    value={formData.subsidioTransporte}
                    onChange={handleInputChange}
                    className="text-right w-28 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
                  />
                  <span className="ml-1 text-xs text-slate-500">kz</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>Subsídio de Alimentação</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="subsidioAlimentacao"
                    value={formData.subsidioAlimentacao}
                    onChange={handleInputChange}
                    className="text-right w-28 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
                  />
                  <span className="ml-1 text-xs text-slate-500">kz</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-slate-400 text-xs">
                <span>IRT</span>
                <span>{formData.irt}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Assiduidade</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="assiduidade"
                    value={formData.assiduidade}
                    onChange={handleInputChange}
                    className="text-right w-28 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
                  />
                  <span className="ml-1 text-xs text-slate-500">kz</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              {formData.itensFatura.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-dashed pb-3 gap-2">
                  <div className="w-full md:w-64">
                    <input
                      type="text"
                      value={item.descricao}
                      onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                      className="w-full font-medium text-slate-800 text-xs border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
                      placeholder="Descrição do serviço"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span>Qtd:</span>
                      <input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                        className="w-12 text-center border-b border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">P. Unit:</span>
                      <input
                        type="number"
                        value={item.precoUnitario}
                        onChange={(e) => handleItemChange(index, 'precoUnitario', e.target.value)}
                        className="w-24 text-right border-b border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent font-semibold text-xs"
                      />
                      <span className="text-xs text-slate-500">Kz</span>
                    </div>

                    <span className="font-bold text-xs text-slate-700 min-w-[70px] text-right">
                      {(item.quantidade * item.precoUnitario).toLocaleString('pt-AO')} kz
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Totais */}
          <div className="border-t-2 border-slate-200 py-3 mt-4 flex justify-between items-center font-bold text-sm">
            <span className="uppercase text-slate-700">Total Geral</span>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 mr-3 font-normal">
                {tipoDoc === 'RECIBO_SALARIO' ? 'Líquido a Processar' : 'IVA Incluído (14%)'}
              </span>
              <span className="text-base text-orange-600">{totalGeral.toLocaleString('pt-AO')}.00 kz</span>
            </div>
          </div>
        </div>

        {/* Detalhes de Pagamento */}
        <div className="mb-8 text-xs space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-100 print:bg-transparent print:border-none print:p-0">
          <p className="font-bold text-slate-700 uppercase">Detalhes da Transação / Condições de Visto:</p>
          <input
            type="text"
            name="metodoPagamento"
            value={formData.metodoPagamento}
            onChange={handleInputChange}
            className="w-full border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent text-slate-700 font-medium"
          />
          <input
            type="text"
            name="detalhesBanco"
            value={formData.detalhesBanco}
            onChange={handleInputChange}
            className="w-full border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent text-slate-600"
          />
          <div className="flex items-center pt-1">
            <span className="text-slate-500">Número de conta afetada:</span>
            <input
              type="text"
              name="numeroConta"
              value={formData.numeroConta}
              onChange={handleInputChange}
              className="ml-1 flex-1 border-b border-transparent hover:border-slate-300 focus:border-orange-500 outline-none print:border-none bg-transparent font-semibold text-slate-800"
            />
          </div>
        </div>

        {/* Rodapé Corporativo */}
        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-[11px] font-bold text-orange-600 tracking-widest">
            #OBRIGADO POR VIAJAR E CRESCER CONOSCO
          </p>
          <p className="text-[9px] text-slate-400 mt-1">
            Agência de Viagens & Turismo Sexto Continente, SU, Lda. — Soluções Globais em Vistos e Passaportes.
          </p>
        </div>

      </div>
    </div>
  );
}