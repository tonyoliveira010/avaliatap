import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { OnboardingFunnelModal } from "@/components/app/OnboardingFunnelModal";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Conheça a plataforma · AvaliaTap" },
      {
        name: "description",
        content: "Conheça o funil de conversão, fidelização por NFC e os benefícios de ter múltiplos slugs.",
      },
      { property: "og:title", content: "Conheça a plataforma · AvaliaTap" },
      {
        property: "og:description",
        content: "Descubra como o AvaliaTap multiplica seus clientes e avaliações 5 estrelas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <OnboardingFunnelModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          navigate({ to: "/" });
        }}
      />
    </div>
  );
}
