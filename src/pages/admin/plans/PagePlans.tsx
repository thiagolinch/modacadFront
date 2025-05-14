import { MdCheckCircleOutline } from 'react-icons/md';
import { LayoutDashboard } from '../../../shared/layouts';
import { CreatePlan } from './components/CreatePlan';
import { useEffect, useState } from 'react';
import { IPlanData, PlansService } from '../../../shared/api/plans/PlansService';

export const PagePlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<IPlanData | null>(null);
  const [plans, setPlans] = useState<IPlanData[]>([]);

  const handleSelectPlan = (id: string | null) => {
    const plan = plans.find((plan) => plan.id === id);
    window.gtag && window.gtag('event', `plano_${plan?.title}`, {
      method: 'button' // ou email, google, etc, como preferir
    });
    setSelectedPlan(plan || null);
  };

  const fetchPlans = () => {
    PlansService.getAll().then((response) => {
      if (response instanceof Error) {
        console.error(response);
        return;
      }
      setPlans(response);
    });
  };

  const onCreated = () => {
    fetchPlans();
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <LayoutDashboard>
      {/* Listagem de planos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-butler">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border border-[#414142] p-4 hover:bg-primary cursor-pointer min-h-[400px]"
            onClick={() => handleSelectPlan(plan.id)}
          >
            <h2 className="text-3xl text-center mb-4">{plan.title}</h2>
            <h3 className="text-6xl text-center mb-4">
              <span className="text-3xl align-top">R$</span>
              {plan.price}
              <span className="text-3xl">/mês</span>
            </h3>
            <p className="text-center text-xl font-medium mb-4">{plan.description}</p>
            <hr className="border-t border-[#414142] my-4" />
            <ul>
              {plan.topics.map((advantage) => (
                <li key={advantage.id} className="flex gap-2 items-center mb-4">
                  <MdCheckCircleOutline className="size-8 shrink-0" />
                  <p>{advantage.value}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div
          className="border border-[#414142] p-4 flex justify-center items-center hover:bg-primary cursor-pointer min-h-[400px]"
          onClick={() => handleSelectPlan(null)}
        >
          <p className="font-montserrat text-3xl">NOVO</p>
        </div>
      </div>
      <hr className="border-t border-[#414142] my-4" />
      {/* Formulário */}
      <CreatePlan selectedPlan={selectedPlan} onCreated={onCreated} />
    </LayoutDashboard>
  );
};
