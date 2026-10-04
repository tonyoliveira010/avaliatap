import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Clock, CalendarCheck, Sparkles } from "lucide-react";
import { getMerchant } from "@/lib/merchants";
import { useCatalogProducts, brl } from "@/lib/products";
import { CartButton } from "@/components/public/CartProvider";
import { BookingModal, defaultServices } from "@/components/public/BookingModal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/c/$slug/produtos/")({
  head: () => ({
    meta: [
      { title: "Vitrine e Serviços · AvaliaTap" },
      {
        name: "description",
        content: "Conheça produtos e serviços exclusivos com agendamento online e entrega facilitada.",
      },
      { property: "og:title", content: "Vitrine e Serviços · AvaliaTap" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { slug } = Route.useParams();
  const merchant = getMerchant(slug);
  const products = useCatalogProducts(slug);
  const [activeTab, setActiveTab] = useState<"products" | "services">("products");
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background px-5 pb-28 pt-7">
      <header className="flex items-center justify-between">
        <Link
          to="/c/$slug"
          params={{ slug }}
          aria-label="Voltar"
          className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-muted"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <strong className="text-[19px] tracking-tight text-foreground">
          {activeTab === "products" ? "Produtos" : "Serviços"}
        </strong>
        <CartButton />
      </header>

      <h1 className="mt-6 px-1 text-[28px] font-extrabold leading-[1.05] tracking-tight text-foreground">
        A vitrine de {merchant?.name ?? "nossa casa"}.
      </h1>
      <p className="mt-2 px-1 text-[13.5px] text-muted-foreground">
        Produtos selecionados e procedimentos com agendamento online.
      </p>

      {/* Tabs: Produtos e Serviços */}
      <div className="mt-6 flex rounded-2xl bg-muted p-1">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex-1 rounded-xl py-2.5 text-[13px] font-extrabold transition-all ${
            activeTab === "products"
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Produtos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`flex-1 rounded-xl py-2.5 text-[13px] font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "services"
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Serviços ({defaultServices.length})
        </button>
      </div>

      {/* LISTA DE PRODUTOS */}
      {activeTab === "products" && (
        <div className="mt-5 grid gap-3">
          {products.map((p) => (
            <Link
              key={p.id}
              to="/c/$slug/produtos/$productId"
              params={{ slug, productId: p.id }}
              className="flex items-center gap-3 rounded-[22px] border border-border bg-surface p-3 transition-colors hover:border-primary/40"
            >
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl">
                {p.emoji}
              </div>
              <div className="min-w-0 flex-1">
                {p.badge && (
                  <small className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
                    {p.badge}
                  </small>
                )}
                <h2 className="mt-0.5 text-[15px] font-semibold text-foreground">{p.name}</h2>
                <p className="line-clamp-2 text-[11.5px] text-muted-foreground">{p.desc}</p>
                <p className="mt-1.5 text-[14px] font-extrabold text-foreground">
                  {brl(p.price)}{" "}
                  {p.oldPrice && (
                    <span className="text-[11px] font-medium text-muted-foreground line-through">
                      {brl(p.oldPrice)}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <p className="rounded-3xl bg-muted p-6 text-center text-[13px] text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </p>
          )}
        </div>
      )}

      {/* LISTA DE SERVIÇOS COM FOTOS E AGENDAMENTO */}
      {activeTab === "services" && (
        <div className="mt-5 space-y-3.5">
          {defaultServices.map((service) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-[26px] border border-border bg-surface p-4 shadow-sm transition-all hover:border-primary/40"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={service.photo}
                  alt={service.name}
                  className="h-20 w-20 rounded-2xl object-cover shrink-0 shadow-sm border border-border"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {service.category && (
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[9.5px] font-extrabold text-primary uppercase tracking-wider">
                        {service.category}
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" />
                      {service.duration}
                    </span>
                  </div>
                  <h3 className="mt-1 text-[15px] font-bold text-foreground leading-tight">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                  <p className="mt-2 text-[15px] font-extrabold text-foreground">
                    R$ {service.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-border flex items-center justify-between gap-3">
                <span className="text-[11.5px] text-muted-foreground">
                  Atendimento com hora marcada
                </span>
                <Button
                  onClick={() => setBookingOpen(true)}
                  className="h-10 px-4 rounded-xl bg-primary text-[12.5px] font-extrabold text-primary-foreground shadow-sm hover:bg-primary/90 flex items-center gap-1.5"
                >
                  <CalendarCheck className="h-3.5 w-3.5" />
                  Agendar
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal de Agendamento */}
      {merchant && (
        <BookingModal
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          merchant={merchant}
        />
      )}
    </div>
  );
}
