
import { useState } from "react";
import { Slots } from "@/types/database";
import { DataCard } from "@/components/ui/DataCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Edit, Save, Lock, Unlock, AlertCircle } from "lucide-react";
import { updateData } from "@/lib/firebase";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Credential {
  belongs_to_slot: string;
  email: string;
  password: string;
  expiry_date: string;
  locked: number;
  max_usage: number;
  usage_count: number;
}

interface CredentialsPanelProps {
  credentials: {
    cred1: Credential;
    cred2: Credential;
    cred3: Credential;
    cred4: Credential;
  };
  slots: Slots;
}

export function CredentialsPanel({ credentials, slots }: CredentialsPanelProps) {
  const [editingCredential, setEditingCredential] = useState<string | null>(null);
  const [editedCredentials, setEditedCredentials] = useState({ ...credentials });
  const [confirmationDialog, setConfirmationDialog] = useState<{open: boolean; action: () => Promise<void>; title: string; description: string}>({
    open: false,
    action: async () => {},
    title: "",
    description: ""
  });

  const handleEditCredential = (credKey: string) => {
    setEditingCredential(credKey);
  };

  const handleCancelEdit = () => {
    setEditedCredentials({ ...credentials });
    setEditingCredential(null);
  };

  const handleSaveCredential = async (credKey: string) => {
    try {
      await updateData(`/${credKey}`, editedCredentials[credKey as keyof typeof credentials]);
      toast.success(`${credKey} updated successfully`);
      setEditingCredential(null);
    } catch (error) {
      console.error(`Error updating ${credKey}:`, error);
      toast.error(`Failed to update ${credKey}`);
    }
  };

  const handleInputChange = (credKey: string, field: keyof Credential, value: any) => {
    setEditedCredentials({
      ...editedCredentials,
      [credKey]: {
        ...editedCredentials[credKey as keyof typeof credentials],
        [field]: value
      }
    });
  };

  const toggleLockState = async (credKey: string) => {
    const currentCred = editedCredentials[credKey as keyof typeof credentials];
    const newLockedValue = currentCred.locked === 0 ? 1 : 0;
    
    setConfirmationDialog({
      open: true,
      action: async () => {
        try {
          await updateData(`/${credKey}/locked`, newLockedValue);
          
          setEditedCredentials({
            ...editedCredentials,
            [credKey]: {
              ...currentCred,
              locked: newLockedValue
            }
          });
          
          toast.success(`${credKey} ${newLockedValue === 1 ? 'locked' : 'unlocked'} successfully`);
        } catch (error) {
          console.error(`Error updating lock state for ${credKey}:`, error);
          toast.error(`Failed to ${newLockedValue === 1 ? 'lock' : 'unlock'} ${credKey}`);
        }
      },
      title: `${newLockedValue === 1 ? 'Lock' : 'Unlock'} ${credKey}`,
      description: `Are you sure you want to ${newLockedValue === 1 ? 'lock' : 'unlock'} ${credKey}?`
    });
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(parse(dateString, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const handleDateSelect = (credKey: string, date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      handleInputChange(credKey, 'expiry_date', formattedDate);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Credentials Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(credentials).map(([credKey, cred]) => {
          const isEditing = editingCredential === credKey;
          const currentCred = editedCredentials[credKey as keyof typeof credentials];
          
          return (
            <DataCard
              key={credKey}
              title={credKey}
              className={currentCred.locked === 0 ? "border-green-500/30" : "border-red-500/30"}
            >
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor={`${credKey}-email`}>Email</Label>
                        <Input
                          id={`${credKey}-email`}
                          value={currentCred.email}
                          onChange={(e) => handleInputChange(credKey, 'email', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`${credKey}-password`}>Password</Label>
                        <Input
                          id={`${credKey}-password`}
                          type="text" // Changed from password type for editing
                          value={currentCred.password}
                          onChange={(e) => handleInputChange(credKey, 'password', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`${credKey}-slot`}>Slot</Label>
                        <Select
                          value={currentCred.belongs_to_slot}
                          onValueChange={(value) => handleInputChange(credKey, 'belongs_to_slot', value)}
                        >
                          <SelectTrigger id={`${credKey}-slot`}>
                            <SelectValue placeholder="Select slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(slots).map((slotKey) => (
                              <SelectItem key={slotKey} value={slotKey}>{slotKey}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`${credKey}-expiry`}>Expiry Date</Label>
                        <div className="flex">
                          <Input
                            id={`${credKey}-expiry`}
                            value={currentCred.expiry_date}
                            onChange={(e) => handleInputChange(credKey, 'expiry_date', e.target.value)}
                            className="flex-1"
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="ml-2">
                                <Calendar className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={parse(currentCred.expiry_date, 'yyyy-MM-dd', new Date())}
                                onSelect={(date) => handleDateSelect(credKey, date)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`${credKey}-max-usage`}>Max Usage</Label>
                          <Input
                            id={`${credKey}-max-usage`}
                            type="number"
                            value={currentCred.max_usage}
                            onChange={(e) => handleInputChange(credKey, 'max_usage', parseInt(e.target.value))}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`${credKey}-usage-count`}>Usage Count</Label>
                          <Input
                            id={`${credKey}-usage-count`}
                            type="number"
                            value={currentCred.usage_count}
                            onChange={(e) => handleInputChange(credKey, 'usage_count', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                      <Button onClick={() => handleSaveCredential(credKey)}>
                        <Save className="mr-2 h-4 w-4" /> Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant={currentCred.locked === 0 ? "outline" : "destructive"} className={cn("px-2 py-1", currentCred.locked === 0 ? "bg-green-500/20 text-green-600 hover:bg-green-500/30 hover:text-green-700" : "")}>
                          {currentCred.locked === 0 ? "Unlocked" : "Locked"}
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10">{currentCred.belongs_to_slot}</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="glass-morphism p-3 rounded-md">
                          <p className="text-sm text-muted-foreground mb-1">Email</p>
                          <p className="font-medium text-sm break-all">{currentCred.email}</p>
                        </div>
                        
                        <div className="glass-morphism p-3 rounded-md">
                          <p className="text-sm text-muted-foreground mb-1">Password</p>
                          <p className="font-medium text-sm break-all">{currentCred.password}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="glass-morphism p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">Expiry</p>
                          <p className="font-medium text-sm">{formatDate(currentCred.expiry_date)}</p>
                        </div>
                        <div className="glass-morphism p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">Max Usage</p>
                          <p className="font-medium text-sm">{currentCred.max_usage}</p>
                        </div>
                        <div className="glass-morphism p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">Usage Count</p>
                          <p className="font-medium text-sm">{currentCred.usage_count}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        variant={currentCred.locked === 0 ? "destructive" : "outline"} 
                        size="sm"
                        onClick={() => toggleLockState(credKey)}
                      >
                        {currentCred.locked === 0 ? (
                          <><Lock className="mr-2 h-4 w-4" /> Lock</>
                        ) : (
                          <><Unlock className="mr-2 h-4 w-4" /> Unlock</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCredential(credKey)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DataCard>
          );
        })}
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog 
        open={confirmationDialog.open} 
        onOpenChange={(open) => {
          if (!open) {
            setConfirmationDialog({...confirmationDialog, open: false});
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmationDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                await confirmationDialog.action();
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
