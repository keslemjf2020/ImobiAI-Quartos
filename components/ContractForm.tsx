
import React, { useState, useEffect, useRef } from 'react';
import { Contract, Person, PropertyDetails } from '../types';
import { validateFormData } from '../services/geminiService';

interface ContractFormProps {
  onSave: (contract: Contract) => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSave }) => {
  const [step, setStep] = useState(1);
  const [isValidating, setIsValidating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  // Use any to avoid NodeJS.Timeout error in browser environment where setTimeout returns a number
  const debounceTimer = useRef<any>(null);

  const [locador, setLocador] = useState<Person>({
    name: '', cpf: '', rg: '', civilStatus: 'Solteiro(a)', profession: '', address: '', email: '', phone: ''
  });
  const [locatario, setLocatario] = useState<Person>({
    name: '', cpf: '', rg: '', civilStatus: 'Solteiro(a)', profession: '', address: '', email: '', phone: ''
  });
  const [property, setProperty] = useState<PropertyDetails>({
    address: '', roomDescription: '', vagaType: 'Quarto Individual', sharedAreas: 'Cozinha, Banheiro, Sala e Lavanderia'
  });
  const [contractDetails, setContractDetails] = useState({
    startDate: '', durationMonths: 6, monthlyRent: 0, paymentDay: 10, pixKey: ''
  });

  // Automatic Real-time Validation Logic
  useEffect(() => {
    const currentData = step === 1 ? locador : step === 2 ? locatario : step === 3 ? property : contractDetails;
    const stepName = step === 1 ? "Locador" : step === 2 ? "Locatário" : step === 3 ? "Propriedade" : "Financeiro";

    // Check if there is enough data to validate (avoid validating empty fields immediately)
    const hasData = Object.values(currentData).some(val => val && val.toString().length > 2);
    
    if (!hasData) {
      setAiFeedback(null);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    setIsValidating(true);
    debounceTimer.current = setTimeout(async () => {
      const feedback = await validateFormData(stepName, currentData);
      setAiFeedback(feedback || "Tudo parece em ordem.");
      setIsValidating(false);
    }, 2000); // 2 seconds debounce to wait for user to finish typing

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [locador, locatario, property, contractDetails, step]);

  const handleSubmit = () => {
    const newContract: Contract = {
      id: Math.random().toString(36).substr(2, 9),
      locador,
      locatario,
      property,
      startDate: contractDetails.startDate,
      durationMonths: contractDetails.durationMonths,
      monthlyRent: contractDetails.monthlyRent,
      paymentDay: contractDetails.paymentDay,
      pixKey: contractDetails.pixKey,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    onSave(newContract);
  };

  const inputStyle = "mt-1 block w-full rounded-md bg-black text-white border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border placeholder-gray-500 transition-all";
  const labelStyle = "block text-sm font-medium text-gray-700";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-indigo-900 border-b pb-2 mb-6">Passo 1: Dados do Locador (Proprietário)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Nome Completo</label>
                <input type="text" className={inputStyle} value={locador.name} onChange={e => setLocador({...locador, name: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>CPF</label>
                <input type="text" className={inputStyle} value={locador.cpf} onChange={e => setLocador({...locador, cpf: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Endereço de Residência</label>
                <input type="text" className={inputStyle} value={locador.address} onChange={e => setLocador({...locador, address: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Telefone/WhatsApp</label>
                <input type="text" className={inputStyle} value={locador.phone} onChange={e => setLocador({...locador, phone: e.target.value})} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-indigo-900 border-b pb-2 mb-6">Passo 2: Dados do Locatário (Inquilino)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Nome Completo</label>
                <input type="text" className={inputStyle} value={locatario.name} onChange={e => setLocatario({...locatario, name: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>CPF</label>
                <input type="text" className={inputStyle} value={locatario.cpf} onChange={e => setLocatario({...locatario, cpf: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Profissão</label>
                <input type="text" className={inputStyle} value={locatario.profession} onChange={e => setLocatario({...locatario, profession: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Email de Contato</label>
                <input type="email" className={inputStyle} value={locatario.email} onChange={e => setLocatario({...locatario, email: e.target.value})} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-indigo-900 border-b pb-2 mb-6">Passo 3: Detalhes do Quarto e Imóvel</h3>
            <div className="space-y-4">
              <div>
                <label className={labelStyle}>Endereço do Imóvel Compartilhado</label>
                <input type="text" className={inputStyle} value={property.address} onChange={e => setProperty({...property, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Tipo de Quarto</label>
                  <select className={inputStyle} value={property.vagaType} onChange={e => setProperty({...property, vagaType: e.target.value})}>
                    <option className="bg-black text-white">Quarto Individual</option>
                    <option className="bg-black text-white">Suíte</option>
                    <option className="bg-black text-white">Quarto Compartilhado</option>
                    <option className="bg-black text-white">Kitnet</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Descrição Específica (ex: 2º quarto à esquerda)</label>
                  <input type="text" className={inputStyle} value={property.roomDescription} onChange={e => setProperty({...property, roomDescription: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-indigo-900 border-b pb-2 mb-6">Passo 4: Prazos e Pagamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Data de Início</label>
                <input type="date" className={inputStyle} value={contractDetails.startDate} onChange={e => setContractDetails({...contractDetails, startDate: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Duração (Meses)</label>
                <input type="number" className={inputStyle} value={contractDetails.durationMonths} onChange={e => setContractDetails({...contractDetails, durationMonths: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className={labelStyle}>Valor do Aluguel (R$)</label>
                <input type="number" className={inputStyle} value={contractDetails.monthlyRent} onChange={e => setContractDetails({...contractDetails, monthlyRent: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className={labelStyle}>Dia de Vencimento</label>
                <input type="number" min="1" max="31" className={inputStyle} value={contractDetails.paymentDay} onChange={e => setContractDetails({...contractDetails, paymentDay: parseInt(e.target.value)})} />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Chave PIX para Recebimento</label>
                <input type="text" className={inputStyle} placeholder="Chave, Tipo de Chave, Banco" value={contractDetails.pixKey} onChange={e => setContractDetails({...contractDetails, pixKey: e.target.value})} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-gray-100 flex flex-col md:flex-row">
      <div className="flex-1">
        <div className="bg-black p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Contrato Inteligente</h2>
            <p className="text-indigo-300 text-sm">Passo {step} de 4</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isValidating ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
              <span className="text-[10px] uppercase font-bold text-gray-400">
                {isValidating ? 'IA Analisando...' : 'Análise em Tempo Real Ativa'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 min-h-[400px]">
          {renderStep()}
          
          <div className="mt-8 transition-all duration-500">
            {isValidating ? (
              <div className="p-4 bg-black border border-indigo-900 rounded-xl flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                </div>
                <span className="text-xs text-indigo-300 font-medium">A IA está revisando seus dados...</span>
              </div>
            ) : aiFeedback ? (
              <div className="p-4 bg-black border border-indigo-900 rounded-xl animate-slideUp">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-indigo-400">🤖</span>
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Feedback Automático da IA</h4>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{aiFeedback}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-between">
          <button
            onClick={() => { setStep(prev => Math.max(1, prev - 1)); setAiFeedback(null); }}
            disabled={step === 1}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100'}`}
          >
            Anterior
          </button>
          {step < 4 ? (
            <button
              onClick={() => { setStep(prev => prev + 1); setAiFeedback(null); }}
              className="px-8 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md"
            >
              Finalizar e Salvar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
