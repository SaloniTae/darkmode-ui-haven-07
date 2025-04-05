
import { useEffect, useState, useRef, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { CredentialsPanel } from "@/components/admin/CredentialsPanel";
import { SlotsPanel } from "@/components/admin/SlotsPanel";
import { ReferralsPanel } from "@/components/admin/ReferralsPanel";
import { TransactionsPanel } from "@/components/admin/TransactionsPanel";
import { UIConfigPanel } from "@/components/admin/UIConfigPanel";
import { UsersPanel } from "@/components/admin/UsersPanel";
import { Loader2 } from "lucide-react";
import { fetchNetflixData, subscribeToNetflixData } from "@/lib/firebaseService";
import { DatabaseSchema } from "@/types/database";
import { toast } from "sonner";

export default function NetflixAdmin() {
  const [loading, setLoading] = useState(true);
  const [dbData, setDbData] = useState<DatabaseSchema | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Initial data load
      const data = await fetchNetflixData("/");
      setDbData(data);
      toast.success("Netflix database loaded successfully");
      
      // Set up real-time listener
      unsubscribeRef.current = subscribeToNetflixData("/", (realtimeData) => {
        if (realtimeData) {
          setDbData(realtimeData);
        }
      });
    } catch (error) {
      console.error("Error loading Netflix database:", error);
      toast.error("Failed to load Netflix database");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    
    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [loadData]);

  if (loading) {
    return <MainLayout className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-medium">Loading Netflix database...</h2>
        </div>
      </MainLayout>;
  }

  if (!dbData) {
    return <MainLayout>
        <div className="glass-morphism p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Database Error</h2>
          <p className="text-red-400">Failed to load Netflix database. Please check your connection and try again.</p>
        </div>
      </MainLayout>;
  }

  return <MainLayout>
      <div className="space-y-8">
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-2 md:grid-cols-7 h-auto p-1 glass-morphism shadow-lg">
            <TabsTrigger className="py-2.5 text-sm font-medium transition-all hover:bg-white/10" value="admin">Admins</TabsTrigger>
            <TabsTrigger className="py-2.5 text-sm font-medium transition-all hover:bg-white/10" value="credentials">Credentials</TabsTrigger>
            <TabsTrigger className="py-2.5 text-sm font-medium transition-all hover:bg-white/10" value="slots">Slots</TabsTrigger>
            <TabsTrigger className="py-2.5 text-sm font-medium transition-all hover:bg-white/10" value="referrals">Referrals</TabsTrigger>
            <TabsTrigger className="py-2.5 text-sm font-medium transition-all hover:bg-white/10" value="transactions">Transactions</TabsTrigger>
            <TabsTrigger className="py-2.5 text-sm font-medium transition-all hover:bg-white/10" value="uiconfig">UI Config</TabsTrigger>
            <TabsTrigger className="py-2.5 text-sm font-medium transition-all hover:bg-white/10" value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin" className="mt-0">
            <AdminPanel adminConfig={dbData.admin_config} />
          </TabsContent>
          
          <TabsContent value="credentials" className="mt-0">
            <CredentialsPanel credentials={{
              cred1: dbData.cred1,
              cred2: dbData.cred2,
              cred3: dbData.cred3,
              cred4: dbData.cred4,
              ...Object.fromEntries(
                Object.entries(dbData)
                  .filter(([key]) => key.startsWith('cred') && !['cred1', 'cred2', 'cred3', 'cred4'].includes(key))
                  .map(([key, value]) => [key, value])
              )
            }} slots={dbData.settings.slots} />
          </TabsContent>
          
          <TabsContent value="slots" className="mt-0">
            <SlotsPanel slots={dbData.settings.slots} />
          </TabsContent>
          
          <TabsContent value="referrals" className="mt-0">
            <ReferralsPanel referrals={dbData.referrals} referralSettings={dbData.referral_settings} freeTrialClaims={dbData.free_trial_claims} />
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-0">
            <TransactionsPanel transactions={dbData.transactions} usedOrderIds={dbData.used_orderids} />
          </TabsContent>
          
          <TabsContent value="uiconfig" className="mt-0">
            <UIConfigPanel uiConfig={dbData.ui_config} />
          </TabsContent>
          
          <TabsContent value="users" className="mt-0">
            <UsersPanel users={dbData.users} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>;
}
