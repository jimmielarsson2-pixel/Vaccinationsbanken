import React, { useState } from "react";
import {
  ShieldCheck,
  Syringe,
  Bell,
  User,
  Plus,
  FileDown,
  LogOut,
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

const mockVaccines = [
  {
    id: 1,
    name: "TBE boosterdos",
    category: "Resevaccin",
    date: "2025-05-12",
    status: "Behöver påfyllnad",
    verified: true,
    clinic: "Svea Vaccin, Stockholm",
  },
  {
    id: 2,
    name: "Covid-19, dos 3",
    category: "Allmänt",
    date: "2023-11-02",
    status: "Aktiv",
    verified: true,
    clinic: "Region Stockholm",
  },
  {
    id: 3,
    name: "Stelkramp / difteri",
    category: "Grundskydd",
    date: "2018-06-21",
    status: "Närmar sig utgång",
    verified: false,
    clinic: "Okänd klinik (manuellt inlagd)",
  },
];

const mockReminders = [
  {
    id: 1,
    title: "TBE – nästa dos",
    text: "Du rekommenderas ta nästa TBE-dos inom 2 månader.",
  },
  {
    id: 2,
    title: "Influensavaccin",
    text: "Säsongens influensavaccin finns tillgängligt. Boka tid om du tillhör riskgrupp.",
  },
];

function StatusBadge({ status }) {
  const map = {
    Aktiv: "bg-emerald-100 text-emerald-800",
    "Behöver påfyllnad": "bg-amber-100 text-amber-800",
    "Närmar sig utgång": "bg-orange-100 text-orange-800",
    Utgången: "bg-red-100 text-red-800",
  };
  const cls = map[status] ?? "bg-slate-100 text-slate-800";
  return (
    <Badge className={`${cls} border-0 rounded-full px-3 py-1 text-xs`}>
      {status}
    </Badge>
  );
}

function VerifiedPill({ verified }) {
  return verified ? (
    <div className="flex items-center gap-1 text-xs text-emerald-700">
      <ShieldCheck className="w-3 h-3" />
      Verifierad vaccination
    </div>
  ) : (
    <div className="flex items-center gap-1 text-xs text-slate-500">
      <ShieldCheck className="w-3 h-3 opacity-40" />
      Ej verifierad (manuellt inlagd)
    </div>
  );
}

function VaccinationList({ onSelect }) {
  return (
    <div className="space-y-3 mt-3">
      {mockVaccines.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v.id)}
          className="w-full text-left"
        >
          <Card className="hover:shadow-md transition-shadow border-slate-100">
            <CardContent className="py-3 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-sky-500" />
                  <p className="font-medium text-sm text-slate-900">
                    {v.name}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
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

function VaccinationDetail({ id }) {
  const v = mockVaccines.find((x) => x.id === id);
  if (!v) return null;

  return (
    <Card className="mt-3 border-slate-100">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Syringe className="w-4 h-4 text-sky-500" />
            {v.name}
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">Kategori: {v.category}</p>
        </div>
        <StatusBadge status={v.status} />
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Vaccinationsdatum</span>
          <span className="font-medium text-slate-900">{v.date}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Klinik</span>
          <span className="text-right font-medium text-slate-900 max-w-[55%]">
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
            className="text-xs flex items-center gap-1"
          >
            <FileDown className="w-3 h-3" />
            Ladda ner intyg (PDF)
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Visa som QR-kod
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AddVaccinationForm() {
  return (
    <Card className="mt-3 border-dashed border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
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
        <Button className="w-full mt-1 h-9 text-xs flex items-center gap-1">
          Spara manuellt
        </Button>
        <p className="text-[11px] text-slate-500">
          För verifierad vaccination kan vårdgivare logga in i sin portal och
          signera dosen digitalt.
        </p>
      </CardContent>
    </Card>
  );
}

function RemindersPanel() {
  return (
    <Card className="border-slate-100">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <CardTitle className="text-sm">Kommande påminnelser</CardTitle>
        </div>
        <Badge className="bg-amber-50 text-amber-700 border-0 rounded-full px-2 py-0 text-[10px]">
          {mockReminders.length} aktiva
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {mockReminders.map((r) => (
          <div
            key={r.id}
            className="p-2 rounded-xl bg-amber-50/60 border border-amber-100"
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

function Header({ onLogout }) {
  return (
    <header className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100 bg-white/60 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-sm">
          <Syringe className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-sky-600 font-semibold">
            Vaccinationsbanken
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <User className="w-3 h-3" />
            Inloggad med BankID
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onLogout}>
        <LogOut className="w-4 h-4 text-slate-400" />
      </Button>
    </header>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="relative w-full max-w-sm mx-auto">
        <div className="absolute -top-16 -right-10 w-40 h-40 bg-sky-500/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-16 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full" />
        <Card className="relative border-slate-800 bg-slate-900/80 backdrop-blur-xl text-slate-50 shadow-2xl">
          <CardHeader className="space-y-2 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-lg">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-sky-400 font-semibold">
                  Vaccinationsbanken
                </p>
                <CardTitle className="text-lg mt-1">
                  Alla dina vaccinationer. På ett ställe.
                </CardTitle>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Logga in säkert med BankID och få en överblick över alla dina
              tidigare och kommande vaccinationer.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-1 pb-5">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                BankID-säker inloggning
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Bell className="w-3 h-3 text-amber-400" />
                Smarta påminnelser om boosterdoser
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FileDown className="w-3 h-3 text-sky-300" />
                Exportera intyg som PDF eller QR-kod
              </div>
            </div>
            <Button
              className="w-full h-11 mt-1 bg-sky-500 hover:bg-sky-400 text-sm font-medium flex items-center justify-center gap-2 rounded-xl"
              onClick={onLogin}
            >
              <span className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[10px] font-bold text-sky-600">
                ID
              </span>
              Logga in med BankID
            </Button>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Genom att logga in godkänner du att dina vaccinationsuppgifter
              lagras krypterat enligt GDPR. Du kan när som helst ta bort ditt
              konto och all data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VaccinationsbankenApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedId, setSelectedId] = useState(
    mockVaccines[0] ? mockVaccines[0].id : null
  );

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 shadow-xl bg-white overflow-hidden">
        <Header onLogout={() => setLoggedIn(false)} />
        <main className="px-4 pb-4 pt-2 bg-slate-50/80">
          <section className="mb-3 mt-1">
            <p className="text-[11px] text-slate-500 mb-1">Översikt</p>
            <div className="grid grid-cols-3 gap-2">
              <Card className="border-0 bg-sky-500 text-sky-50 shadow-sm">
                <CardContent className="py-2 px-3 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] opacity-80">
                    Totalt
                  </span>
                  <span className="text-xl font-semibold leading-none">
                    {mockVaccines.length}
                  </span>
                  <span className="text-[11px] opacity-80">vaccinationer</span>
                </CardContent>
              </Card>
              <Card className="border-0 bg-emerald-50">
                <CardContent className="py-2 px-3 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-emerald-700">
                    Verifierade
                  </span>
                  <span className="text-xl font-semibold leading-none text-emerald-900">
                    {mockVaccines.filter((v) => v.verified).length}
                  </span>
                  <span className="text-[11px] text-emerald-700/80">
                    via vårdgivare
                  </span>
                </CardContent>
              </Card>
              <Card className="border-0 bg-amber-50">
                <CardContent className="py-2 px-3 flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-amber-700">
                    Påminnelser
                  </span>
                  <span className="text-xl font-semibold leading-none text-amber-900">
                    {mockReminders.length}
                  </span>
                  <span className="text-[11px] text-amber-800/80">
                    kommande
                  </span>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-3">
            <Tabs defaultValue="lista">
              <TabsList className="grid grid-cols-2 bg-slate-100 rounded-xl px-1 py-1 h-9">
                <TabsTrigger value="lista" className="text-xs">
                  Mina vaccinationer
                </TabsTrigger>
                <TabsTrigger value="paaminnelser" className="text-xs">
                  Påminnelser
                </TabsTrigger>
              </TabsList>
              <TabsContent value="lista" className="mt-2">
                <VaccinationList onSelect={(id) => setSelectedId(id)} />
                {selectedId && <VaccinationDetail id={selectedId} />}
                <AddVaccinationForm />
              </TabsContent>
              <TabsContent value="paaminnelser" className="mt-2">
                <RemindersPanel />
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </div>
  );
}
