 import React, { useState } from "react";
import {
  ShieldCheck,
  Syringe,
  Bell,
  User,
  Plus,
  FileDown,
  LogOut,
  MapPin,
  Star,
  Calendar,
  Globe2,
  ArrowRight,
  Users,
  QrCode,
  AlertTriangle,
  Info,
  Camera,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card.jsx";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";
import { Badge } from "./components/ui/badge.jsx";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./components/ui/tabs.jsx";

/* ------------ MOCKDATA ----------------- */

const profiles = [
  { id: "jimmie", name: "Jimmie", relation: "Du", age: 34 },
  { id: "william", name: "William", relation: "Barn", age: 2 },
  { id: "gabriella", name: "Gabriella", relation: "Partner", age: 32 },
];

const mockVaccines = [
  {
    id: 1,
    profileId: "jimmie",
    name: "TBE boosterdos",
    category: "Resevaccin",
    date: "2025-05-12",
    status: "Behöver påfyllnad",
    verified: true,
    clinic: "Svea Vaccin, Stockholm",
  },
  {
    id: 2,
    profileId: "jimmie",
    name: "Covid-19, dos 3",
    category: "Allmänt",
    date: "2023-11-02",
    status: "Aktiv",
    verified: true,
    clinic: "Region Stockholm",
  },
  {
    id: 3,
    profileId: "jimmie",
    name: "Stelkramp / difteri",
    category: "Grundskydd",
    date: "2018-06-21",
    status: "Närmar sig utgång",
    verified: false,
    clinic: "Okänd klinik (manuellt inlagd)",
  },
  {
    id: 4,
    profileId: "william",
    name: "Rotavirus, dos 2",
    category: "Barnvaccin",
    date: "2024-10-03",
    status: "Aktiv",
    verified: true,
    clinic: "BVC, Region Västernorrland",
  },
];

const mockReminders = [
  {
    id: 1,
    profileId: "jimmie",
    title: "TBE – nästa dos",
    text: "Du rekommenderas ta nästa TBE-dos inom 2 månader.",
  },
  {
    id: 2,
    profileId: "jimmie",
    title: "Influensavaccin",
    text: "Säsongens influensavaccin finns tillgängligt. Boka tid om du tillhör riskgrupp.",
  },
];

const vaccineOptions = [
  { id: "tbe", label: "TBE" },
  { id: "covid", label: "Covid-19" },
  { id: "flu", label: "Influensa (säsong)" },
  { id: "hep_a", label: "Hepatit A" },
  { id: "hep_b", label: "Hepatit B" },
  { id: "tet", label: "Stelkramp / difteri" },
];

const providerOptions = [
  {
    id: 1,
    name: "Svea Vaccin – Stockholm City",
    city: "Stockholm",
    address: "Drottninggatan 59",
    rating: 4.7,
    priceFrom: 395,
    hasTimesToday: true,
    vaccines: ["tbe", "covid", "flu", "hep_a", "hep_b", "tet"],
  },
  {
    id: 2,
    name: "Vaccinova – Malmö Emporia",
    city: "Malmö",
    address: "Emporia, plan 1",
    rating: 4.5,
    priceFrom: 365,
    hasTimesToday: false,
    vaccines: ["tbe", "flu", "hep_a", "tet"],
  },
  {
    id: 3,
    name: "Min Doktor – Göteborg Nordstan",
    city: "Göteborg",
    address: "Nordstan, Apoteket",
    rating: 4.3,
    priceFrom: 399,
    hasTimesToday: true,
    vaccines: ["covid", "flu", "tet"],
  },
];

const mockShareLog = [
  {
    id: 1,
    actor: "Företagshälsan, Stockholm",
    purpose: "Tjänstbarhetsintyg",
    date: "2025-02-01",
  },
  {
    id: 2,
    actor: "BVC, Region Västernorrland",
    purpose: "Barnvaccinationskontroll",
    date: "2024-11-15",
  },
];

/* ------------ HJÄLPKOMPONENTER ----------------- */

function StatusBadge({ status }) {
  const map = {
    Aktiv: "bg-emerald-50 text-emerald-800 border-emerald-100",
    "Behöver påfyllnad": "bg-amber-50 text-amber-800 border-amber-100",
    "Närmar sig utgång": "bg-orange-50 text-orange-800 border-orange-100",
    Utgången: "bg-red-50 text-red-800 border-red-100",
  };
  const cls = map[status] ?? "bg-slate-50 text-slate-800 border-slate-100";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] border ${cls}`}
    >
      {status}
    </span>
  );
}

function VerifiedPill({ verified }) {
  return verified ? (
    <div className="flex items-center gap-1 text-[11px] text-emerald-700">
      <ShieldCheck className="w-3 h-3" />
      Verifierad vaccination
    </div>
  ) : (
    <div className="flex items-center gap-1 text-[11px] text-amber-700">
      <AlertTriangle className="w-3 h-3" />
      Ej verifierad – inlagd av dig
    </div>
  );
}

function ProfileChip({ profile, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1 transition ${
        active
          ? "bg-white text-emerald-900 shadow-sm border border-emerald-200"
          : "bg-emerald-50 text-emerald-800 border border-emerald-50 hover:bg-white hover:border-emerald-200"
      }`}
    >
      <Users className="w-3 h-3" />
      <span>{profile.name}</span>
      <span className="text-[10px] opacity-80">• {profile.relation}</span>
    </button>
  );
}

/* ------------ LISTA / DETALJ ----------------- */

function VaccinationList({ onSelect, vaccines }) {
  if (!vaccines.length) {
    return (
      <p className="text-xs text-slate-500 mt-3">
        Inga vaccinationer registrerade ännu för denna profil.
      </p>
    );
  }

  return (
    <div className="space-y-2 mt-3">
      {vaccines.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v.id)}
          className="w-full text-left"
        >
          <Card className="border-slate-100 bg-white hover:bg-emerald-50/40 transition-colors">
            <CardContent className="py-2.5 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-emerald-700" />
                  <p className="font-medium text-sm text-slate-900">
                    {v.name}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  {v.category} • {v.date}
                </p>
                <VerifiedPill verified={v.verified} />
              </div>
              <StatusBadge status={v.status} />
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}

function VaccinationDetail({ id, vaccines }) {
  const v = vaccines.find((x) => x.id === id);
  if (!v) return null;

  return (
    <Card className="mt-3 border-slate-100 bg-white">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm flex items-center gap-2">
            <Syringe className="w-4 h-4 text-emerald-700" />
            {v.name}
          </CardTitle>
          <p className="text-[11px] text-slate-500 mt-1">
            Kategori: {v.category}
          </p>
        </div>
        <StatusBadge status={v.status} />
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600 text-xs">
          <span>Vaccinationsdatum</span>
          <span className="font-medium text-slate-900">{v.date}</span>
        </div>
        <div className="flex justify-between text-slate-600 text-xs">
          <span>Klinik</span>
          <span className="text-right font-medium text-slate-900 max-w-[60%]">
            {v.clinic}
          </span>
        </div>
        <div>
          <VerifiedPill verified={v.verified} />
        </div>
        <div className="pt-1 flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
          >
            <FileDown className="w-3 h-3" />
            Ladda ner intyg (PDF)
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1 text-slate-700 hover:bg-slate-100"
          >
            <QrCode className="w-3 h-3" />
            Visa som QR-kod
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AddVaccinationForm() {
  return (
    <Card className="mt-3 border-dashed border-slate-200 bg-slate-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
          <Plus className="w-4 h-4 text-emerald-700" />
          Lägg till vaccination
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="space-y-1">
          <label className="text-xs text-slate-600">Namn på vaccin</label>
          <Input placeholder="t.ex. TBE, dos 1" className="h-9 text-xs" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600">Kategori</label>
          <Input
            placeholder="Resevaccin, Grundskydd, Covid..."
            className="h-9 text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600">Datum</label>
          <Input type="date" className="h-9 text-xs" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600">Klinik</label>
          <Input
            placeholder="Var fick du vaccinet?"
            className="h-9 text-xs"
          />
        </div>
        <div className="space-y-2 pt-1">
          <Button className="w-full mt-1 h-9 text-xs flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500">
            Spara manuellt (demo)
          </Button>
          <Button
            variant="outline"
            className="w-full h-9 text-xs flex items-center gap-1 border-slate-300"
          >
            <Camera className="w-3 h-3" />
            Ladda upp foto på vaccinationskort (demo)
          </Button>
        </div>
        <p className="text-[11px] text-slate-500">
          I skarp version kan vårdgivare verifiera vaccinet digitalt. Foto används som
          stöd och du godkänner alltid innan något sparas.
        </p>
      </CardContent>
    </Card>
  );
}

function RemindersPanel({ reminders }) {
  if (!reminders.length) {
    return (
      <p className="text-xs text-slate-500 mt-2">
        Inga aktiva påminnelser för denna profil just nu.
      </p>
    );
  }

  return (
    <Card className="border-slate-100 bg-white">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-600" />
          <CardTitle className="text-sm">Kommande påminnelser</CardTitle>
        </div>
        <Badge className="bg-amber-50 text-amber-700 border-amber-100 rounded-full px-2 py-0 text-[10px]">
          {reminders.length} aktiva
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {reminders.map((r) => (
          <div
            key={r.id}
            className="p-2 rounded-xl bg-amber-50/80 border border-amber-100"
          >
            <p className="font-medium text-amber-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {r.title}
            </p>
            <p className="text-[11px] text-amber-800 mt-1">{r.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ------------ BOKNING ----------------- */

function VaccineSelect({ selectedId, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-600 flex items-center gap-1">
        <Syringe className="w-3 h-3 text-emerald-700" />
        Vilket vaccin vill du boka?
      </label>
      <select
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Välj vaccin...</option>
        {vaccineOptions.map((v) => (
          <option key={v.id} value={v.id}>
            {v.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ClinicCard({ clinic, selectedVaccine }) {
  const vaccineLabel =
    vaccineOptions.find((v) => v.id === selectedVaccine)?.label || "Vaccin";

  return (
    <Card className="border-slate-100 bg-white hover:bg-emerald-50/40 transition-colors">
      <CardContent className="py-3 px-3 space-y-2 text-xs">
        <div className="flex justify-between gap-2">
          <div>
            <p className="font-semibold text-slate-900 text-sm">
              {clinic.name}
            </p>
            <div className="flex items-center gap-2 text-slate-500 mt-0.5">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {clinic.city}
              </span>
              <span className="hidden sm:inline text-[11px]">
                {clinic.address}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500" />
              <span className="text-[11px] text-slate-700">
                {clinic.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              från {clinic.priceFrom} kr
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3 text-emerald-700" />
            {clinic.hasTimesToday ? (
              <span className="text-emerald-800">
                Lediga tider idag för {vaccineLabel}
              </span>
            ) : (
              <span className="text-slate-500">
                Nästa lediga tider inom 7 dagar
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="h-8 px-3 text-[11px] flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500"
          >
            Boka tid
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingPanel() {
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const filteredProviders = providerOptions.filter((p) => {
    const matchVaccine =
      !selectedVaccine || p.vaccines.includes(selectedVaccine);
    const matchCity =
      !cityFilter ||
      p.city.toLowerCase().includes(cityFilter.trim().toLowerCase());
    return matchVaccine && matchCity;
  });

  return (
    <div className="space-y-3 mt-2">
      <Card className="border-slate-100 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
            <Globe2 className="w-4 h-4 text-emerald-700" />
            Boka vaccination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <p className="text-slate-600">
            Välj vaccin och stad så visar vi kliniker som har tider. I denna
            prototyp används exempeldata – i skarp version hämtas tider i
            realtid från vaccinatörerna.
          </p>
          <VaccineSelect
            selectedId={selectedVaccine}
            onChange={setSelectedVaccine}
          />
          <div className="space-y-1">
            <label className="text-xs text-slate-600 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-700" />
              Var vill du vaccinera dig?
            </label>
            <Input
              className="h-9 text-xs"
              placeholder="t.ex. Stockholm, Göteborg, Malmö..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {selectedVaccine && (
        <p className="text-[11px] text-slate-500 px-1">
          Visar kliniker för{" "}
          <span className="font-semibold">
            {
              vaccineOptions.find((v) => v.id === selectedVaccine)?.label ??
              "valt vaccin"
            }
          </span>
          . Reserekommendationer per land kan läggas till här i nästa steg.
        </p>
      )}

      <div className="space-y-2">
        {filteredProviders.length === 0 ? (
          <p className="text-xs text-slate-500 px-1">
            Inga kliniker matchar din filtrering just nu. Prova att ändra stad
            eller vaccin.
          </p>
        ) : (
          filteredProviders.map((clinic) => (
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              selectedVaccine={selectedVaccine}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* -------- DELA, ICE, KONTO & EXPORT -------- */

function ShareAndICEPanel({ activeProfile }) {
  return (
    <div className="space-y-3 mt-2">
      {/* Dela vaccinationer */}
      <Card className="border-slate-100 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-700" />
            Dela dina vaccinationer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <p className="text-slate-600">
            Visa en QR-kod som t.ex. företagshälsa, BVC eller vårdpersonal kan
            skanna. Du godkänner alltid delningen i appen innan de får se något.
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500">
                Gäller profil:
              </span>
              <span className="text-sm font-medium text-slate-900">
                {activeProfile.name}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs flex items-center gap-1 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            >
              <QrCode className="w-3 h-3" />
              Visa QR-kod (demo)
            </Button>
          </div>
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <p className="text-[11px] font-semibold text-slate-700">
              Senaste delningar
            </p>
            {mockShareLog.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-[11px] py-1"
              >
                <div className="flex flex-col">
                  <span className="text-slate-800">{item.actor}</span>
                  <span className="text-slate-500">{item.purpose}</span>
                </div>
                <span className="text-slate-400">{item.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ICE / Nödlägeskort */}
      <Card className="border-slate-100 bg-emerald-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-emerald-900">
            <AlertTriangle className="w-4 h-4 text-emerald-800" />
            ICE / Nödlägeskort
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <p className="text-slate-700">
            I nödläge kan vården snabbt se dina viktigaste vaccinationer. I
            framtiden kan detta sparas som PDF eller i Apple Wallet / Google
            Wallet.
          </p>
          <div className="rounded-xl border border-emerald-200 bg-white px-3 py-2 space-y-1">
            <p className="text-[11px] text-slate-500">Profil</p>
            <p className="text-sm font-semibold text-slate-900">
              {activeProfile.name} ({activeProfile.age} år)
            </p>
            <p className="text-[11px] text-slate-600">
              Detta är en prototyp – i skarp version kan du lägga till
              allergier, mediciner och ICE-kontakter.
            </p>
          </div>
          <Button className="w-full h-9 text-xs bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1">
            <FileDown className="w-3 h-3" />
            Skapa ICE-kort (demo)
          </Button>
        </CardContent>
      </Card>

      {/* Integritet & data */}
      <Card className="border-slate-100 bg-white">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <Info className="w-4 h-4 text-slate-500" />
          <CardTitle className="text-sm">Integritet & data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-[11px] text-slate-600">
          <p>
            • Du äger alltid dina data. Du kan exportera allt och ta bort ditt
            konto permanent.
          </p>
          <p>
            • All lagring ska i skarp version ske krypterat inom EU och enligt
            GDPR.
          </p>
          <p>
            • Varje verifierad vaccination loggas med vårdgivare, tidpunkt och
            behörig användare.
          </p>
        </CardContent>
      </Card>

      {/* Konto & export – modell för avslut */}
      <Card className="border-slate-100 bg-slate-50">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <Trash2 className="w-4 h-4 text-slate-700" />
          <CardTitle className="text-sm">Konto & export (modell)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-[11px] text-slate-700">
          <p>
            Så här kan flödet se ut när en användare vill avsluta sitt konto
            men ändå få med sig alla vaccinationer:
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Först skapa en full export (ZIP + PDF per profil).</li>
            <li>Visa nedladdningslänk direkt i appen.</li>
            <li>Skicka exporten via e-post som backup.</li>
            <li>Låt användaren välja: pausa/arkivera eller radera kontot.</li>
          </ol>

          <div className="mt-2 space-y-2">
            <Button className="w-full h-9 text-xs bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1">
              <FileDown className="w-3 h-3" />
              1. Exportera alla vaccinationer (demo)
            </Button>
            <p className="text-[11px] text-slate-600">
              Skapar en samlad export med ZIP + PDF. I skarp version kan detta
              även innehålla Wallet-kort och skickas via e-post.
            </p>

            <Button
              variant="outline"
              className="w-full h-9 text-xs flex items-center gap-1 border-slate-300"
            >
              <User className="w-3 h-3" />
              2. Arkivera konto (kan återaktiveras) – demo
            </Button>
            <p className="text-[11px] text-slate-600">
              Kontot stängs men data finns kvar krypterad. Användaren kan
              återaktivera med BankID och få tillbaka allt.
            </p>

            <Button
              variant="ghost"
              className="w-full h-9 text-xs flex items-center gap-1 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3" />
              3. Radera konto permanent – demo
            </Button>
            <p className="text-[11px] text-slate-600">
              I skarp version visas här en sista bekräftelse och information om
              att radering är oåterkallelig, men att export redan skapats.
            </p>
          </div>

          <p className="text-[10px] text-slate-500 mt-1">
            Denna sektion är en prototyp för att visa flödet. Själva
            exporten/raderingen implementeras senare i backend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------ HEADER & LOGIN ----------------- */

function Header({ onLogout, activeProfile }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0EA05D] text-white">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
          <Syringe className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/80 font-semibold">
            Vaccinationsbanken
          </p>
          <p className="text-[11px] text-white/90 flex items-center gap-1">
            <User className="w-3 h-3" />
            Inloggad med BankID • {activeProfile.name}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 hover:bg-white/10 text-white"
        onClick={onLogout}
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </header>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F8]">
      <div className="w-full max-w-sm mx-auto">
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader className="space-y-2 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0EA05D] flex items-center justify-center text-white">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                  Vaccinationsbanken
                </p>
                <CardTitle className="text-lg mt-1">
                  Samla och ha koll på alla dina vaccinationer.
                </CardTitle>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Logga in med BankID i skarp version. Här är det en demoinloggning
              så att du kan testa flödet.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-1 pb-5">
            <Button
              className="w-full h-11 bg-[#0EA05D] hover:bg-[#0A8A4E] text-sm font-medium flex items-center justify-center gap-2 rounded-xl"
              onClick={onLogin}
            >
              <span className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[10px] font-bold text-[#0EA05D]">
                ID
              </span>
              Logga in (demo)
            </Button>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Detta är en prototyp. Ingen riktig BankID-koppling och ingen data
              sparas. I skarp version lagras allt krypterat inom EU och du kan
              när som helst ta bort ditt konto.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ------------ ROOT ----------------- */

export default function VaccinationsbankenApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState("jimmie");
  const [selectedId, setSelectedId] = useState(
    mockVaccines[0] ? mockVaccines[0].id : null
  );

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) ?? profiles[0];

  const vaccinesForProfile = mockVaccines.filter(
    (v) => v.profileId === activeProfileId
  );
  const remindersForProfile = mockReminders.filter(
    (r) => r.profileId === activeProfileId
  );

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F8] py-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 shadow-[0_14px_40px_rgba(15,23,42,0.12)] bg-white overflow-hidden">
        <Header
          onLogout={() => setLoggedIn(false)}
          activeProfile={activeProfile}
        />
        <main className="px-4 pb-4 pt-3 bg-[#F9FAFB]">
          {/* Profilväxlare */}
          <section className="mb-3">
            <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-700" />
              Välj profil
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {profiles.map((p) => (
                <ProfileChip
                  key={p.id}
                  profile={p}
                  active={p.id === activeProfileId}
                  onClick={() => {
                    setActiveProfileId(p.id);
                    const first = mockVaccines.find(
                      (v) => v.profileId === p.id
                    );
                    setSelectedId(first ? first.id : null);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Översiktskort */}
          <section className="mb-3">
            <p className="text-[11px] text-slate-500 mb-1">Översikt</p>
            <div className="grid grid-cols-3 gap-2">
              <Card className="border-0 bg-[#0EA05D] text-white">
                <CardContent className="py-2 px-3 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/80">
                    Totalt
                  </span>
                  <span className="text-xl font-semibold leading-none">
                    {vaccinesForProfile.length}
                  </span>
                  <span className="text-[11px] text-white/80">
                    vaccinationer
                  </span>
                </CardContent>
              </Card>
              <Card className="border-0 bg-emerald-50">
                <CardContent className="py-2 px-3 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-emerald-800">
                    Verifierade
                  </span>
                  <span className="text-xl font-semibold leading-none text-emerald-900">
                    {vaccinesForProfile.filter((v) => v.verified).length}
                  </span>
                  <span className="text-[11px] text-emerald-800/80">
                    via vårdgivare
                  </span>
                </CardContent>
              </Card>
              <Card className="border-0 bg-amber-50">
                <CardContent className="py-2 px-3 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-amber-800">
                    Påminnelser
                  </span>
                  <span className="text-xl font-semibold leading-none text-amber-900">
                    {remindersForProfile.length}
                  </span>
                  <span className="text-[11px] text-amber-900/80">
                    kommande
                  </span>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Huvudflikar */}
          <section className="mb-3">
            <Tabs defaultValue="lista">
              <TabsList className="grid grid-cols-4 bg-white border border-slate-200 rounded-2xl px-1 py-1 h-9">
                <TabsTrigger value="lista" className="text-[11px] data-[state=active]:text-emerald-700">
                  Vaccin
                </TabsTrigger>
                <TabsTrigger
                  value="paaminnelser"
                  className="text-[11px] data-[state=active]:text-emerald-700"
                >
                  Påminn.
                </TabsTrigger>
                <TabsTrigger
                  value="boka"
                  className="text-[11px] data-[state=active]:text-emerald-700"
                >
                  Boka
                </TabsTrigger>
                <TabsTrigger
                  value="dela_ice"
                  className="text-[11px] data-[state=active]:text-emerald-700"
                >
                  Dela & ICE
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lista" className="mt-2">
                <VaccinationList
                  onSelect={(id) => setSelectedId(id)}
                  vaccines={vaccinesForProfile}
                />
                {selectedId && (
                  <VaccinationDetail
                    id={selectedId}
                    vaccines={vaccinesForProfile}
                  />
                )}
                <AddVaccinationForm />
              </TabsContent>

              <TabsContent value="paaminnelser" className="mt-2">
                <RemindersPanel reminders={remindersForProfile} />
              </TabsContent>

              <TabsContent value="boka" className="mt-2">
                <BookingPanel />
              </TabsContent>

              <TabsContent value="dela_ice" className="mt-2">
                <ShareAndICEPanel activeProfile={activeProfile} />
              </TabsContent>
            </Tabs>
          </section>

          {/* Fotnot */}
          <section className="mt-1">
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Trash2 className="w-3 h-3" />
              I skarp version kan du när som helst exportera och radera ditt
              konto permanent.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
