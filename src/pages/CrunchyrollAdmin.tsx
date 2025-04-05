
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { CredentialsPanel } from "@/components/admin/CredentialsPanel";
import { SlotsPanel } from "@/components/admin/SlotsPanel";
import { ReferralsPanel } from "@/components/admin/ReferralsPanel";
import { TokenGenerator } from "@/components/admin/TokenGenerator";
import { TransactionsPanel } from "@/components/admin/TransactionsPanel";
import { ScreenConfigPanel } from "@/components/admin/ScreenConfigPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Loader2 } from "lucide-react";
import { subscribeToData } from "@/lib/firebase";

export default function CrunchyrollAdmin() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("credentials");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Set up listeners for all the data we need
    const unsubscribeAdminConfig = subscribeToData("/admin_config", (adminConfig) => {
      setData((prev: any) => ({ ...prev, adminConfig }));
    });
    
    const unsubscribeSlots = subscribeToData("/settings/slots", (slots) => {
      setData((prev: any) => ({ ...prev, slots }));
    });
    
    const unsubscribeCredentials = subscribeToData("/", (credentials) => {
      // Filter out non-credential data
      const filteredCredentials: any = {};
      Object.entries(credentials).forEach(([key, value]) => {
        if (key.startsWith("cred") && typeof value === "object") {
          filteredCredentials[key] = value;
        }
      });
      setData((prev: any) => ({ ...prev, credentials: filteredCredentials }));
    });
    
    const unsubscribeReferrals = subscribeToData("/referrals", (referrals) => {
      setData((prev: any) => ({ ...prev, referrals }));
    });
    
    const unsubscribeReferralSettings = subscribeToData("/referral_settings", (referralSettings) => {
      setData((prev: any) => ({ ...prev, referralSettings }));
    });
    
    const unsubscribeTransactions = subscribeToData("/transactions", (transactions) => {
      setData((prev: any) => ({ ...prev, transactions }));
    });
    
    const unsubscribeOrderIds = subscribeToData("/used_order_ids", (usedOrderIds) => {
      setData((prev: any) => ({ ...prev, usedOrderIds }));
    });
    
    const unsubscribeFreeTrialClaims = subscribeToData("/free_trial_claims", (freeTrialClaims) => {
      setData((prev: any) => ({ ...prev, freeTrialClaims }));
    });
    
    // Once we have all subscriptions set up, mark as not loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      // Clean up all subscriptions
      unsubscribeAdminConfig();
      unsubscribeSlots();
      unsubscribeCredentials();
      unsubscribeReferrals();
      unsubscribeReferralSettings();
      unsubscribeTransactions();
      unsubscribeOrderIds();
      unsubscribeFreeTrialClaims();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading Crunchyroll admin panel...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Failed to load data</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Logo service="crunchyroll" size="md" />
            <h1 className="text-xl font-bold">Crunchyroll Admin</h1>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-auto">
            <TabsList className="inline-flex w-full md:w-auto">
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="slots">Slots</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="screen">Screen Config</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="credentials" className="space-y-6">
            <CredentialsPanel credentials={data.credentials} slots={data.slots} />
          </TabsContent>
          
          <TabsContent value="slots" className="space-y-6">
            <SlotsPanel slots={data.slots} />
          </TabsContent>
          
          <TabsContent value="referrals" className="space-y-6">
            <ReferralsPanel 
              referrals={data.referrals} 
              referralSettings={data.referralSettings} 
              freeTrialClaims={data.freeTrialClaims} 
            />
          </TabsContent>
          
          <TabsContent value="screen" className="space-y-6">
            <ScreenConfigPanel service="crunchyroll" />
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            <TransactionsPanel 
              transactions={data.transactions} 
              usedOrderIds={data.usedOrderIds} 
            />
          </TabsContent>
          
          <TabsContent value="admin" className="space-y-6">
            <AdminPanel adminConfig={data.adminConfig} />
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <TokenGenerator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
