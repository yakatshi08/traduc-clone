import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Zap, 
  Rocket, 
  Building2, 
  Users,
  Shield,
  HeadphonesIcon,
  Clock,
  Globe,
  Award,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Info,
  CreditCard
} from 'lucide-react';

interface PlanFeature {
  name: string;
  included: boolean;
  value?: string;
  tooltip?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceYearly: number;
  currency: string;
  popular?: boolean;
  features: PlanFeature[];
  limits: {
    transcriptionHours: number | 'unlimited';
    translationChars: number | 'unlimited';
    projects: number | 'unlimited';
    teamMembers: number | 'unlimited';
    storage: string;
    apiCalls: number | 'unlimited';
  };
  cta: string;
  color: string;
  icon: React.ReactNode;
}

const PricingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Freemium',
      description: 'Parfait pour découvrir TraducXion',
      price: 0,
      priceYearly: 0,
      currency: '€',
      features: [
        { name: 'Transcription', included: true, value: '2h/mois' },
        { name: 'Traduction', included: true, value: '10k caractères' },
        { name: 'Projets actifs', included: true, value: '3 projets' },
        { name: 'Formats', included: true, value: 'MP3, MP4, WAV' },
        { name: 'Langues', included: true, value: '5 langues' },
        { name: 'Export', included: true, value: 'TXT, DOCX' },
        { name: 'Stockage', included: true, value: '1 GB' },
        { name: 'Support', included: true, value: 'Email (72h)' },
        { name: 'API', included: false },
        { name: 'Équipe', included: false },
        { name: 'Intégrations', included: false },
        { name: 'IA personnalisée', included: false }
      ],
      limits: {
        transcriptionHours: 2,
        translationChars: 10000,
        projects: 3,
        teamMembers: 1,
        storage: '1 GB',
        apiCalls: 0
      },
      cta: 'Commencer gratuitement',
      color: 'gray',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Pour les professionnels',
      price: 29,
      priceYearly: 290,
      currency: '€',
      popular: true,
      features: [
        { name: 'Transcription', included: true, value: '50h/mois' },
        { name: 'Traduction', included: true, value: '500k caractères' },
        { name: 'Projets', included: true, value: 'Illimités' },
        { name: 'Formats', included: true, value: 'Tous formats' },
        { name: 'Langues', included: true, value: '30+ langues' },
        { name: 'Export', included: true, value: 'Tous + SRT' },
        { name: 'Stockage', included: true, value: '50 GB' },
        { name: 'Support', included: true, value: 'Prioritaire' },
        { name: 'API', included: true, value: '1k appels' },
        { name: 'Équipe', included: true, value: '5 membres' },
        { name: 'Intégrations', included: true, value: 'Cloud' },
        { name: 'IA personnalisée', included: false }
      ],
      limits: {
        transcriptionHours: 50,
        translationChars: 500000,
        projects: 'unlimited',
        teamMembers: 5,
        storage: '50 GB',
        apiCalls: 1000
      },
      cta: 'Essai 14 jours',
      color: 'blue',
      icon: <Rocket className="w-6 h-6" />
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Pour les équipes',
      price: 79,
      priceYearly: 790,
      currency: '€',
      features: [
        { name: 'Transcription', included: true, value: '200h/mois' },
        { name: 'Traduction', included: true, value: '2M caractères' },
        { name: 'Projets', included: true, value: 'Illimités' },
        { name: 'Formats', included: true, value: 'Priorité' },
        { name: 'Langues', included: true, value: '50+ langues' },
        { name: 'Export', included: true, value: 'API incluse' },
        { name: 'Stockage', included: true, value: '500 GB' },
        { name: 'Support', included: true, value: 'Dédié (1h)' },
        { name: 'API', included: true, value: '10k appels' },
        { name: 'Équipe', included: true, value: '20 membres' },
        { name: 'Intégrations', included: true, value: 'Toutes' },
        { name: 'IA personnalisée', included: true, value: '3 modèles' }
      ],
      limits: {
        transcriptionHours: 200,
        translationChars: 2000000,
        projects: 'unlimited',
        teamMembers: 20,
        storage: '500 GB',
        apiCalls: 10000
      },
      cta: 'Démarrer',
      color: 'purple',
      icon: <Building2 className="w-6 h-6" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solutions sur mesure',
      price: -1,
      priceYearly: -1,
      currency: '€',
      features: [
        { name: 'Transcription', included: true, value: 'Illimitée' },
        { name: 'Traduction', included: true, value: 'Illimitée' },
        { name: 'Projets', included: true, value: 'Illimités' },
        { name: 'Formats', included: true, value: 'Custom' },
        { name: 'Langues', included: true, value: '100+ langues' },
        { name: 'Export', included: true, value: 'Sur mesure' },
        { name: 'Stockage', included: true, value: 'Illimité' },
        { name: 'Support', included: true, value: 'Premium 24/7' },
        { name: 'API', included: true, value: 'Illimitée + SLA' },
        { name: 'Équipe', included: true, value: 'Illimitée + SSO' },
        { name: 'Intégrations', included: true, value: 'Custom dev' },
        { name: 'IA personnalisée', included: true, value: 'Dédiée' }
      ],
      limits: {
        transcriptionHours: 'unlimited',
        translationChars: 'unlimited',
        projects: 'unlimited',
        teamMembers: 'unlimited',
        storage: 'Illimité',
        apiCalls: 'unlimited'
      },
      cta: 'Contact',
      color: 'gradient',
      icon: <Users className="w-6 h-6" />
    }
  ];

  const calculateSavings = (plan: Plan) => {
    if (plan.price === 0 || plan.price === -1) return 0;
    const monthlyTotal = plan.price * 12;
    const yearlyTotal = plan.priceYearly;
    return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
  };

  const formatPrice = (price: number) => {
    if (price === -1) return 'Sur devis';
    if (price === 0) return 'Gratuit';
    return `${price}${billingPeriod === 'yearly' ? '0' : ''}`;
  };

  const faqItems = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et sont facturés au prorata."
    },
    {
      question: "Comment fonctionne l'essai gratuit ?",
      answer: "L'essai gratuit de 14 jours vous donne accès à toutes les fonctionnalités du plan Pro. Aucune carte bancaire n'est requise pour commencer."
    },
    {
      question: "Que se passe-t-il si je dépasse mes limites ?",
      answer: "Nous vous prévenons lorsque vous approchez de vos limites. Vous pouvez soit upgrader votre plan, soit acheter des crédits supplémentaires."
    },
    {
      question: "Les prix incluent-ils la TVA ?",
      answer: "Les prix affichés sont hors TVA. La TVA applicable sera ajoutée lors du paiement selon votre pays de résidence."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Choisissez le plan qui vous convient
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Des solutions flexibles pour tous vos besoins de transcription et traduction
        </p>

        {/* Toggle facturation */}
        <div className="inline-flex items-center gap-4 p-1 bg-gray-800 rounded-lg">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              billingPeriod === 'monthly' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              billingPeriod === 'yearly' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Annuel
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans - Version corrigée */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-gray-800 rounded-xl border ${
              plan.popular 
                ? 'border-blue-500 xl:scale-105 shadow-xl shadow-blue-500/20' 
                : 'border-gray-700'
            } p-8 hover:border-gray-600 transition-all`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-4 h-4" />
                  Plus populaire
                </span>
              </div>
            )}

            {/* En-tête du plan */}
            <div className="mb-6">
              <div className={`inline-flex p-3 rounded-lg mb-4 ${
                plan.color === 'gradient' 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600' 
                  : `bg-${plan.color}-600/20`
              }`}>
                {plan.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
            </div>

            {/* Prix */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">
                  {formatPrice(plan.price)}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-400 text-sm">
                    {plan.currency}/mois
                  </span>
                )}
              </div>
              {billingPeriod === 'yearly' && plan.price > 0 && (
                <p className="text-sm text-green-400 mt-1">
                  Économisez {calculateSavings(plan)}% par an
                </p>
              )}
            </div>

            {/* Bouton CTA */}
            <button
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all mb-6 ${
                plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : plan.id === 'enterprise'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {plan.cta}
            </button>

            {/* Limites principales - Plus d'espace */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Transcription</span>
                <span className="font-medium text-sm text-right whitespace-nowrap">
                  {plan.limits.transcriptionHours === 'unlimited' 
                    ? 'Illimitée' 
                    : `${plan.limits.transcriptionHours}h/mois`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Traduction</span>
                <span className="font-medium text-sm text-right whitespace-nowrap">
                  {plan.limits.translationChars === 'unlimited' 
                    ? 'Illimitée' 
                    : plan.limits.translationChars >= 1000000
                    ? `${(plan.limits.translationChars / 1000000).toFixed(0)}M car.`
                    : `${(plan.limits.translationChars / 1000).toFixed(0)}k car.`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Stockage</span>
                <span className="font-medium text-sm whitespace-nowrap">{plan.limits.storage}</span>
              </div>
            </div>

            {/* Fonctionnalités - Optimisées */}
            <div className="space-y-3">
              {plan.features.slice(0, 5).map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className={`text-sm flex-1 ${
                    feature.included ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <span className="block">{feature.name}</span>
                    {feature.value && feature.included && (
                      <span className="text-xs text-gray-500 block mt-0.5">
                        {feature.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Voir plus */}
            <button
              onClick={() => setShowComparison(true)}
              className="w-full mt-6 text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1"
            >
              Voir toutes les fonctionnalités
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Bannière de confiance */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 mb-12 border border-blue-600/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Sécurité garantie</h4>
            <p className="text-sm text-gray-400">Chiffrement AES-256</p>
          </div>
          <div>
            <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Support 24/7</h4>
            <p className="text-sm text-gray-400">Équipe dédiée</p>
          </div>
          <div>
            <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">100+ langues</h4>
            <p className="text-sm text-gray-400">Couverture mondiale</p>
          </div>
          <div>
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Satisfait ou remboursé</h4>
            <p className="text-sm text-gray-400">Garantie 30 jours</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Questions fréquentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold mb-2 flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                {item.question}
              </h3>
              <p className="text-gray-400 text-sm ml-7">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div className="text-center py-12 border-t border-gray-800">
        <h2 className="text-2xl font-bold mb-4">
          Prêt à transformer votre workflow ?
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'entreprises qui font confiance à TraducXion pour leurs besoins de transcription et traduction.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setSelectedPlan('free')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Essayer gratuitement
          </button>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5" />
            Parler à un expert
          </button>
        </div>
      </div>

      {/* Modal de comparaison (placeholder) */}
      {showComparison && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Comparaison détaillée des plans</h2>
              <button
                onClick={() => setShowComparison(false)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 text-center py-12">
              Tableau de comparaison détaillé à venir...
            </p>
          </div>
        </div>
      )}

      {/* Modal de paiement (placeholder) */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              Finaliser votre abonnement
            </h2>
            <p className="text-gray-400 mb-6">
              Vous avez sélectionné le plan <strong className="text-white">
                {plans.find(p => p.id === selectedPlan)?.name}
              </strong>
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Procéder au paiement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;