
import React from 'react';
import { Contract, Payment } from '../types';

interface DashboardProps {
  contracts: Contract[];
  payments: Payment[];
}

const Dashboard: React.FC<DashboardProps> = ({ contracts, payments }) => {
  const activeContracts = contracts.filter(c => c.status === 'active');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');

  const totalMonthlyIncome = activeContracts.reduce((acc, c) => acc + c.monthlyRent, 0);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Visão Geral</h2>
        <p className="text-gray-500">Acompanhe o status da sua imobiliária em tempo real.</p>
      </header>

      {/* Stats Grid - Now with Black Background and White Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="text-indigo-400 text-xs font-bold uppercase mb-1">Contratos Ativos</div>
          <div className="text-3xl font-bold text-white">{activeContracts.length}</div>
          <div className="mt-2 text-xs text-gray-400">Total de moradores: {activeContracts.length}</div>
        </div>
        
        <div className="bg-black p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="text-green-400 text-xs font-bold uppercase mb-1">Receita Mensal</div>
          <div className="text-3xl font-bold text-white">R$ {totalMonthlyIncome.toLocaleString('pt-BR')}</div>
          <div className="mt-2 text-xs text-gray-400">Previsão bruta</div>
        </div>

        <div className="bg-black p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="text-yellow-400 text-xs font-bold uppercase mb-1">Pagamentos Pendentes</div>
          <div className="text-3xl font-bold text-white">{pendingPayments.length}</div>
          <div className="mt-2 text-xs text-gray-400">Aguardando confirmação</div>
        </div>

        <div className="bg-black p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="text-red-400 text-xs font-bold uppercase mb-1">Inadimplência</div>
          <div className="text-3xl font-bold text-white">{overduePayments.length}</div>
          <div className="mt-2 text-xs text-gray-400">Pagamentos atrasados</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Contracts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-black flex justify-between items-center">
            <h3 className="font-bold text-white">Contratos Recentes</h3>
            <span className="text-xs text-indigo-300 font-semibold cursor-pointer">Ver todos</span>
          </div>
          <div className="p-0">
            {activeContracts.length === 0 ? (
              <p className="p-8 text-center text-gray-400">Nenhum contrato ativo.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <th className="px-4 py-2">Locatário</th>
                    <th className="px-4 py-2">Quarto</th>
                    <th className="px-4 py-2">Início</th>
                    <th className="px-4 py-2">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeContracts.slice(0, 5).map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.locatario.name}</td>
                      <td className="px-4 py-3 text-gray-500">{c.property.vagaType}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(c.startDate).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-600">R$ {c.monthlyRent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* AI Suggestions Card */}
        <div className="bg-black rounded-xl p-6 border border-gray-800 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold text-white">Dicas da Inteligência Imobiliária</h3>
          </div>
          <div className="space-y-4 text-sm text-gray-300">
            <p><strong className="text-indigo-400">Ajuste IGP-M:</strong> 2 contratos vencem em 30 dias. Prepare a notificação de reajuste com base no IPCA/IGP-M conforme previsto na cláusula 5ª.</p>
            <p><strong className="text-indigo-400">Vistoria:</strong> O quarto de "{activeContracts[0]?.locatario.name || 'Morador'}" deve passar por uma vistoria de manutenção em breve.</p>
            <p><strong className="text-indigo-400">Controle de Água:</strong> Verifique se a conta de água do imóvel superou a média histórica para aplicar a Cláusula 6ª de rateio.</p>
          </div>
          <button className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            Falar com Assistente IA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
