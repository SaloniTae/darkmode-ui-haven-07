
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ServiceType } from "@/lib/firebaseService";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [selectedService, setSelectedService] = useState<ServiceType>("crunchyroll");
  
  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await login(values.email, values.password, selectedService);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <Logo service={selectedService} size="lg" />
          </div>
          <CardTitle className="text-2xl font-bold">OORverse Admin</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        
        <Tabs 
          value={selectedService} 
          onValueChange={(value) => setSelectedService(value as ServiceType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mx-4">
            <TabsTrigger value="crunchyroll">Crunchyroll</TabsTrigger>
            <TabsTrigger value="netflix">Netflix</TabsTrigger>
            <TabsTrigger value="prime">Prime</TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    `Log in to ${selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}`
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex justify-between">
          <Button variant="link" asChild>
            <Link to="/password-reset">Forgot password?</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
