'use client';

import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import Logotipo from '@/logotipo.png';

// Base de dados cadastrada dos funcionários
const FUNCIONARIOS_CADASTRADOS = [
  {
    nome: 'ANGELO MARCELINO',
    departamento: 'Dep.Juridico',
    funcao: 'Auxiliar Juridico',
    codigo: '003.090502026',
    salarioBase: 50000,
    subsidioTransporte: 10000,
    subsidioAlimentacao: 30000,
    assiduidade: 10000,
  },
  {
    nome: 'BEATRIZ SILVA',
    departamento: 'Dep.Recursos Humanos',
    funcao: 'Técnica de RH',
    codigo: '004.090502026',
    salarioBase: 60000,
    subsidioTransporte: 15000,
    subsidioAlimentacao: 30000,
    assiduidade: 10000,
  },
  {
    nome: 'AZEVEDO DOS SANTOS',
    departamento: 'Dep.Contabilidade',
    funcao: 'Contabilista',
    codigo: '005.090502026',
    salarioBase: 70000,
    subsidioTransporte: 15000,
    subsidioAlimentacao: 35000,
    assiduidade: 10000,
  },
  {
    nome: 'EMÍLIA COSTA',
    departamento: 'Dep.Comercial',
    funcao: 'Consultora de Viagens',
    codigo: '006.090502026',
    salarioBase: 55000,
    subsidioTransporte: 10000,
    subsidioAlimentacao: 30000,
    assiduidade: 10000,
  },
];

export default function ReciboSalarial() {
  const agora = new Date();
  const dataAtual = agora.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
  const horaAtual = `${String(agora.getHours()).padStart(2, '0')}h${String(agora.getMinutes()).padStart(2, '0')}`;

  const [selectedFunc, setSelectedFunc] = useState('ANGELO MARCELINO');
  const [numeroContaInput, setNumeroContaInput] = useState('8040853910001');

  // Estado do formulário gerado
  const [formData, setFormData] = useState({
    ...FUNCIONARIOS_CADASTRADOS[0],
    data: dataAtual,
    hora: horaAtual,
    irt: '------',
    bonosSalarial: '------',
    subsidioSaude: '------',
    metodoPagamento: 'Tranferencia Bancaria | Imediata',
    detalhesBanco: 'BCI.Transação.: 677630927',
    numeroConta: '8040853910001',
  });

  // Função para Gerar Automaticamente com os botões/selects
  const handleGerarRecibo = () => {
    const funcionario = FUNCIONARIOS_CADASTRADOS.find((f) => f.nome === selectedFunc);
    if (!funcionario) return;

    const novaData = new Date();
    const dataFormatada = novaData.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
    const horaFormatada = `${String(novaData.getHours()).padStart(2, '0')}h${String(novaData.getMinutes()).padStart(2, '0')}`;

    setFormData({
      ...funcionario,
      data: dataFormatada,
      hora: horaFormatada,
      irt: '------',
      bonosSalarial: '------',
      subsidioSaude: '------',
      metodoPagamento: 'Tranferencia Bancaria | Imediata',
      detalhesBanco: 'BCI.Transação.: ' + Math.floor(100000000 + Math.random() * 900000000),
      numeroConta: numeroContaInput,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('salario') || name.includes('subsidio') || name === 'assiduidade' 
        ? Number(value) || 0 
        : value,
    }));
  };

  const total =
    (Number(formData.salarioBase) || 0) +
    (Number(formData.subsidioTransporte) || 0) +
    (Number(formData.subsidioAlimentacao) || 0) +
    (Number(formData.assiduidade) || 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-800 font-sans print:bg-white print:p-0">
      
      {/* PAINEL DE CONTROLO AUTOMÁTICO (Escondido na Impressão) */}
      <div className="max-w-2xl mx-auto mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200 print:hidden space-y-4">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide border-b pb-2">
          ⚡ Gerador Rápido de Recibos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              1. Seleccionar Funcionário:
            </label>
            <select
              value={selectedFunc}
              onChange={(e) => setSelectedFunc(e.target.value)}
              className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              {FUNCIONARIOS_CADASTRADOS.map((f) => (
                <option key={f.nome} value={f.nome}>
                  {f.nome} ({f.funcao})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              2. Nº de Conta a Debitar:
            </label>
            <input
              type="text"
              value={numeroContaInput}
              onChange={(e) => setNumeroContaInput(e.target.value)}
              className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Ex: 8040853910001"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center pt-2">
          <button
            onClick={handleGerarRecibo}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 rounded text-sm shadow transition flex items-center gap-2"
          >
            🔄 Gerar Recibo Automático
          </button>

          <button
            onClick={() => window.print()}
            className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-5 rounded text-sm shadow transition flex items-center gap-2"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* MODELO DE RECIBO DE SAÍDA */}
      <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-200 shadow-lg print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* Cabeçalho com o Logo Correto da Empresa */}
        <div className="flex justify-between items-start mb-8">
          <div className="w-68">
            <Image 
              src={Logotipo}
              alt="Sexto Continente"
              width={1000}
              height={85}
              className="w-full h-auto object-contain -mt-16"
              priority
            />
          </div>
          <div className="text-right text-[10px] text-gray-600 leading-tight max-w-[280px]">
            <p className="font-bold">AGÊNCIA DE VIAGENS & TURISMO (SU), LDA.</p>
            <p>NIF: 5002828693</p>
            <p>SEDE: PROVÍNCIA DE BENGUELA, MUNICÍPIO DE BENGUELA, LARGO DA PEÇA, RUA JOÃO DE DEUS, CASA S/N.º, (PRÓXIMO DA IGREJA TESTEMUNHA DE JEOVÁ).</p>
            <p className="text-orange-600">www.agenciasextocontinente.com</p>
          </div>
        </div>

        {/* Título */}
        <div className="text-center my-6">
          <h2 className="text-2xl font-black text-gray-800 tracking-wider">RECIBO SALARIAL</h2>
        </div>

        {/* Dados da Funcionária e Transação */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm border-b pb-4">
          <div>
            <p className="font-bold text-gray-700 text-xs mb-1">A FUNCIONARIA:</p>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full font-bold uppercase border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
            />
            <input
              type="text"
              name="departamento"
              value={formData.departamento}
              onChange={handleInputChange}
              className="w-full text-xs border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
            />
            <input
              type="text"
              name="funcao"
              value={formData.funcao}
              onChange={handleInputChange}
              className="w-full text-xs border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
            />
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleInputChange}
              className="w-full font-semibold text-xs border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
            />
          </div>

          <div className="text-right">
            <p className="font-bold text-gray-700 text-xs mb-1">TRANSAÇÃO FEITA:</p>
            <div className="flex justify-end gap-2 text-xs items-center">
              <span className="text-gray-500">DATA:</span>
              <input
                type="text"
                name="data"
                value={formData.data}
                onChange={handleInputChange}
                className="w-24 text-right border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent font-semibold"
              />
            </div>
            <div className="flex justify-end gap-2 text-xs items-center">
              <span className="text-gray-500">HORA:</span>
              <input
                type="text"
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                className="w-24 text-right border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Bloco Centralizado da Tabela de Valores */}
        <div className="max-w-lg mx-auto my-6 px-4">
          <div className="flex justify-between border-b pb-1 mb-3 font-bold text-xs tracking-wider text-gray-700">
            <span>DESCRIÇÃO</span>
            <span>VALORES</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Salario Base</span>
              <div className="flex items-center">
                <input
                  type="number"
                  name="salarioBase"
                  value={formData.salarioBase}
                  onChange={handleInputChange}
                  className="text-right w-24 border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
                />
                <span className="ml-1">kz</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>Subsídio de transporte</span>
              <div className="flex items-center">
                <input
                  type="number"
                  name="subsidioTransporte"
                  value={formData.subsidioTransporte}
                  onChange={handleInputChange}
                  className="text-right w-24 border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
                />
                <span className="ml-1">kz</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>Subsídio de alimentação</span>
              <div className="flex items-center">
                <input
                  type="number"
                  name="subsidioAlimentacao"
                  value={formData.subsidioAlimentacao}
                  onChange={handleInputChange}
                  className="text-right w-24 border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
                />
                <span className="ml-1">kz</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-gray-500">
              <span>IRT</span>
              <span>{formData.irt}</span>
            </div>

            <div className="flex justify-between items-center text-gray-500">
              <span>Bonos salarial</span>
              <span>{formData.bonosSalarial}</span>
            </div>

            <div className="flex justify-between items-center text-gray-500">
              <span>Subsídio de saude</span>
              <span>{formData.subsidioSaude}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Assiduidade</span>
              <div className="flex items-center">
                <input
                  type="number"
                  name="assiduidade"
                  value={formData.assiduidade}
                  onChange={handleInputChange}
                  className="text-right w-24 border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
                />
                <span className="ml-1">kz</span>
              </div>
            </div>
          </div>

          <div className="border-t border-b py-3 mt-4 flex justify-between items-center font-bold text-sm">
            <span>TOTAL</span>
            <div className="text-right">
              <span className="text-xs text-gray-500 mr-4 font-normal">Tax: 0%</span>
              <span>{total.toLocaleString('pt-AO')}.00kz</span>
            </div>
          </div>
        </div>

        {/* Dados do Pagamento */}
        <div className="mb-8 text-xs space-y-1">
          <p className="font-bold text-gray-700">PAGAMENTO POR:</p>
          <input
            type="text"
            name="metodoPagamento"
            value={formData.metodoPagamento}
            onChange={handleInputChange}
            className="w-full border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
          />
          <input
            type="text"
            name="detalhesBanco"
            value={formData.detalhesBanco}
            onChange={handleInputChange}
            className="w-full border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent"
          />
          <div className="flex items-center">
            <span>Numero de conta a debitar.:</span>
            <input
              type="text"
              name="numeroConta"
              value={formData.numeroConta}
              onChange={handleInputChange}
              className="ml-1 flex-1 border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none print:border-none bg-transparent font-semibold"
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-orange-600 tracking-widest">
            #OBRIGADO POR CAMINHAR CONOSCO
          </p>
        </div>
      </div>
    </div>
  );
}