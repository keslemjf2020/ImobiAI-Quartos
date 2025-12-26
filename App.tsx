
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ContractForm from './components/ContractForm';
import InspectionReport from './components/InspectionReport';
import AIChat from './components/AIChat';
import { Contract, Payment, Inspection } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);

  const handleSaveContract = (contract: Contract) => {
    setContracts([...contracts, contract]);
    // Simulate initial payment creation
    const initialPayment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      contractId: contract.id,
      amount: contract.monthlyRent,
      dueDate: contract.startDate,
      status: 'pending',
    };
    setPayments([...payments, initialPayment]);
    setActiveTab('dashboard');
  };

  const handleSaveInspection = (inspection: Inspection) => {
    setInspections([...inspections, inspection]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard contracts={contracts} payments={payments} />;
      case 'new-contract':
        return <ContractForm onSave={handleSaveContract} />;
      case 'payments':
        return (
          <div className="space-y-6">
            <header>
              <h2 className="text-3xl font-bold text-gray-800">Controle de Pagamentos</h2>
              <p className="text-gray-500">Gerencie recebimentos e inadimplência.</p>
            </header>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <th className="px-6 py-4">Locatário</th>
                    <th className="px-6 py-4">Vencimento</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-400">Nenhum pagamento registrado.</td></tr>
                  ) : (
                    payments.map(p => {
                      const contract = contracts.find(c => c.id === p.contractId);
                      return (
                        <tr key={p.id}>
                          <td className="px-6 py-4 font-medium">{contract?.locatario.name || '---'}</td>
                          <td className="px-6 py-4">{new Date(p.dueDate).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 font-bold">R$ {p.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              p.status === 'paid' ? 'bg-green-100 text-green-700' :
                              p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {p.status === 'paid' ? 'Pago' : p.status === 'pending' ? 'Pendente' : 'Atrasado'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-indigo-600 hover:text-indigo-900 font-semibold">Confirmar Recebimento</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'inspection':
        return <InspectionReport contracts={contracts} onSave={handleSaveInspection} />;
      case 'ai-chat':
        return <AIChat />;
      default:
        return <Dashboard contracts={contracts} payments={payments} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
