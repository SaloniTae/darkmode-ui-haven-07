
import { useState, useEffect } from "react";
import { DataCard } from "@/components/ui/DataCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save } from "lucide-react";
import { updateServiceData, subscribeToServiceData, ServiceType, usesGifUrl } from "@/lib/firebaseService";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface ScreenConfigPanelProps {
  service: ServiceType;
}

export function ScreenConfigPanel({ service }: ScreenConfigPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [screenConfig, setScreenConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentService } = useAuth();
  const useGifUrl = usesGifUrl(service);

  // Fetch initial data and subscribe to updates
  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = subscribeToServiceData(service, "/crunchyroll_screen", (data) => {
      setScreenConfig(data);
      setIsLoading(false);
    });
    
    return () => {
      unsubscribe();
    };
  }, [service]);

  const handleSaveChanges = async () => {
    try {
      await updateServiceData(service, "/crunchyroll_screen", screenConfig);
      toast.success("Screen configuration updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating screen config:", error);
      toast.error("Failed to update screen configuration");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setScreenConfig({
      ...screenConfig,
      [field]: value
    });
  };

  if (isLoading) {
    return <div>Loading screen configuration...</div>;
  }

  if (!screenConfig) {
    return <div>No screen configuration found</div>;
  }

  return (
    <DataCard title={`${service.charAt(0).toUpperCase() + service.slice(1)} Screen Configuration`}>
      <div className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="button-text">Button Text</Label>
                <Input
                  id="button-text"
                  value={screenConfig.button_text}
                  onChange={(e) => handleInputChange('button_text', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="callback-data">Callback Data</Label>
                <Input
                  id="callback-data"
                  value={screenConfig.callback_data}
                  onChange={(e) => handleInputChange('callback_data', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={screenConfig.caption}
                  onChange={(e) => handleInputChange('caption', e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="media-url">
                  {useGifUrl ? "GIF URL" : "Photo URL"}
                </Label>
                <Input
                  id="media-url"
                  value={useGifUrl ? screenConfig.gif_url : screenConfig.photo_url}
                  onChange={(e) => handleInputChange(
                    useGifUrl ? 'gif_url' : 'photo_url', 
                    e.target.value
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {useGifUrl 
                    ? "URL to a GIF that will be displayed to users" 
                    : "URL to a photo that will be displayed to users"}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Button Text</p>
                <p className="font-medium">{screenConfig.button_text}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Callback Data</p>
                <p className="font-medium">{screenConfig.callback_data}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Caption</p>
                <p className="font-medium whitespace-pre-line">{screenConfig.caption}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {useGifUrl ? "GIF URL" : "Photo URL"}
                </p>
                <p className="font-medium text-sm break-all">
                  {useGifUrl ? screenConfig.gif_url : screenConfig.photo_url}
                </p>
              </div>
              
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Preview</p>
                {useGifUrl ? (
                  screenConfig.gif_url ? (
                    <img 
                      src={screenConfig.gif_url} 
                      alt="Media preview" 
                      className="max-w-full h-auto rounded-md border" 
                    />
                  ) : <p className="text-sm text-muted-foreground">No GIF URL provided</p>
                ) : (
                  screenConfig.photo_url ? (
                    <img 
                      src={screenConfig.photo_url} 
                      alt="Media preview" 
                      className="max-w-full h-auto rounded-md border" 
                    />
                  ) : <p className="text-sm text-muted-foreground">No photo URL provided</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </div>
          </>
        )}
      </div>
    </DataCard>
  );
}
