import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  export default function SettingsPage() {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your application settings here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Settings page is under construction.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  