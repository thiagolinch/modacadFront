import { FC, useEffect, useState } from 'react';

import { IPlanData, PlansService } from '../../../shared/api/plans/PlansService';
import { useAuthDialog } from '../../../shared/contexts/AuthDialogContext';
import { transformPrice } from '../../../shared/utils/priceUtils';
import { useUser } from '../../../shared/contexts';

import checkListIcon from '../../../assets/icons/check-mark.svg';

interface IPlanCardProps {
  plan: IPlanData;
  highlight?: boolean;
  isFirst: boolean;
  currentPlan?: boolean;
}

export const PlanCard: FC<IPlanCardProps> = ({ plan, highlight = false, isFirst = false, currentPlan = false }) => {
  const { user } = useUser();
  const { openDialog } = useAuthDialog();

  const [storedPlanId, setStoredPlanId] = useState<string | null>(null);

  const priceParts = transformPrice(Number(plan.price), plan.frequency);

  const handleGeneratePaymentLink = async (planId: string, plan_name?: string) => {
    if (!user) {
      setStoredPlanId(planId);
      openDialog('login');
      return;
    }

    const paymentLink = await PlansService.generatePaymentLink(planId);

    if (paymentLink instanceof Error) {
      console.error(paymentLink);
      return;
    }

    window.gtag && window.gtag('event', plan_name, {
      method: 'plan_card' // ou email, google, etc, como preferir
    });

    window.location.href = paymentLink;
  };

  useEffect(() => {
    if (user && storedPlanId) {
      handleGeneratePaymentLink(storedPlanId);
      setStoredPlanId(null);
    }
  }, [user, storedPlanId]);

  return (
    <div
      className={`flex flex-col items-center p-8 ${!isFirst ? 'border-l-0' : ''} ${highlight ? ' shadow-read' : ''} border border-zinc-950`}
    >
      <p className="font-butler text-5xl text-center">{plan.title}</p>
      <div
        className={`rounded-md bg-cyan-600 py-1 px-3 border border-transparent text-sm text-white transition-all shadow-sm font-montserrat mt-8 ${
          plan.frequency == 12 ? 'visible' : 'invisible'
        }`}
      >
        41% de desconto
      </div>
      <div className="flex items-center leading-none items-center mt-4">
        <span className="text-4xl font-butler self-start mt-3 font-light mr-2">R$</span>
        <p className="font-butler text-8xl">{priceParts.integerPart}</p>
        <span className="text-3xl font-butler self-start mt-3 font-light">{priceParts.decimalPart}</span>
        <span className="text-4xl font-butler self-end mb-3 font-light">/mês</span>
      </div>
      <p className="font-butler font-medium text-3xl mt-4">{plan.description}</p>
      <hr className="my-8 h-1 border-t border-gray-950 w-full" />
      <div>
        <ul className="flex gap-2 flex-col mb-8">
          {plan.topics.map((topic, index) => (
            <li className="flex gap-2 text-lg leading-tight font-montserrat font-light items-center" key={index}>
              <img src={checkListIcon} alt="" className="h-[30px]" />
              {topic.value}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button
          onClick={() => handleGeneratePaymentLink(plan.id, plan.title)}
          disabled={currentPlan} // Desabilita o botão se for o plano atual
          className={`
            px-8 py-4 border border-gray-950 font-montserrat text-lg
            ${
              currentPlan
                ? 'cursor-not-allowed opacity-50' // Efeito de desabilitado
                : 'hover:bg-[#dcdf1e]' // Efeito de hover apenas se não estiver desabilitado
            }
          `}
        >
          {currentPlan ? 'Plano atual' : 'Quero este'}
        </button>
      </div>
    </div>
  );
};
