
import React, { useState, useEffect, useRef } from 'react';
import { Inspection, InspectionItem, Contract } from '../types';
import { askAI } from '../services/geminiService';

interface InspectionReportProps {
  contracts: Contract[];
  onSave: (inspection: Inspection) => void;
}

const InspectionReport: React.FC<InspectionReportProps> = ({ contracts, onSave }) => {
  const [selectedContractId, setSelectedContractId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  // Use any to avoid NodeJS.Timeout error in browser environment where setTimeout returns a number
  const debounceTimer = useRef<any>(null);

  const [roomItems, setRoomItems] = useState<InspectionItem[]>([
    { id: '1', name: 'Pintura de Paredes', status: '' },
    { id: '2', name: 'Piso e Rodapés', status: '' },
    { id: '3', name: 'Janelas e Vidros', status: '' },
    { id: '4', name: 'Porta e Fechadura', status: '' },
    { id: '5', name: 'Móveis (Cama/Armário)', status: '' },
    { id: '6', name: 'Tomadas e Interruptores', status: '' },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setRoomItems(items => items.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Automatic tips for inspection based on the last modified item
  useEffect(() => {
    const lastItemWithContent = [...roomItems].reverse().find(i => i.status.length > 5);
    if (!lastItemWithContent) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    setIsValidating(true);
    debounceTimer.current = setTimeout(async () => {
      const prompt = `Como consultor imobiliário, veja o que descrevi sobre "${lastItemWithContent.name}": "${lastItemWithContent.status}". 
      Dê uma dica rápida de como tornar essa descrição mais segura juridicamente para o locador. Seja muito breve (1 frase).`;
      const tip = await askAI(prompt);
      setAiTip(tip || null);
      setIsValidating(false);
    }, 2500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [roomItems]);

  const handleSave = () => {
    if (!selectedContractId) return alert('Selecione um contrato primeiro.');
    
    const inspection: Inspection = {
      contractId: selectedContractId,
      date: new Date().toISOString(),
      items: {
        room: roomItems,
        common: []
      }
    };
    onSave(inspection);
    alert('Vistoria salva com sucesso!');
  };

  const inputStyle = "flex-1 p-2 text-sm border rounded bg-black text-white border-gray-800 placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 transition-all";
  const selectStyle = "w-full p-3 border rounded-lg bg-black text-white border-gray-800 focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Termo de Vistoria</h2>
          <p className="text-gray-500">Documente o estado real do imóvel para sua segurança.</p>
        </div>
        <button onClick={handleSave} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 shadow-md border border-gray-700 transition-all">Salvar Vistoria</button>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-2">Selecione o Contrato do Morador</label>
        <select 
          className={selectStyle}
          value={selectedContractId}
          onChange={e => setSelectedContractId(e.target.value)}
        >
          <option value="" className="bg-black text-white">-- Escolha um contrato ativo --</option>
          {contracts.map(c => (
            <option key={c.id} value={c.id} className="bg-black text-white">{c.locatario.name} - {c.property.vagaType}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <span>🛏️</span> Estado do Quarto
          </h3>
          <div className="space-y-4">
            {roomItems.map(item => (
              <div key={item.id} className="pb-4 border-b border-gray-50 last:border-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">{item.name}</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ex: Nova, sem riscos, funcionando..."
                    className={inputStyle}
                    value={item.status}
                    onChange={e => updateStatus(item.id, e.target.value)}
                  />
                  <button className="bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors" title="Adicionar Foto">📸</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black p-6 rounded-xl border border-gray-800 text-white shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 flex justify-between items-center">
              Dicas de IA em Tempo Real
              {isValidating && (
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-75"></div>
                </div>
              )}
            </h3>
            {aiTip ? (
              <div className="p-3 bg-indigo-950/50 border border-indigo-900 rounded-lg animate-fadeIn">
                <p className="text-sm text-indigo-100 italic">" {aiTip} "</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Comece a preencher os estados dos itens para receber sugestões automáticas de segurança jurídica.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">Guia de Preenchimento</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-indigo-600">✅</span>
                <span><strong>Seja específico:</strong> Não use apenas "bom estado".</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600">✅</span>
                <span><strong>Teste tudo:</strong> Acenda a luz, abra a janela.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600">✅</span>
                <span><strong>Fotos:</strong> Tire fotos de todos os ângulos.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionReport;
