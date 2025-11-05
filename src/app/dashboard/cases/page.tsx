import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cases } from "@/lib/data";

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Open': return 'secondary';
        case 'In Progress': return 'default';
        case 'On Hold': return 'outline';
        case 'Closed': return 'destructive';
        default: return 'secondary';
    }
}

export default function CasesPage() {
  return (
    <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
            <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="contenciosa">Contenciosa</TabsTrigger>
                <TabsTrigger value="no-contenciosa">No Contenciosa</TabsTrigger>
            </TabsList>
            <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Case
            </Button>
        </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Cases</CardTitle>
            <CardDescription>Manage all legal cases.</CardDescription>
          </CardHeader>
          <CardContent>
            <CasesTable cases={cases} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="contenciosa">
        <Card>
          <CardHeader>
            <CardTitle>Contenciosa Cases</CardTitle>
            <CardDescription>Manage contenciosa legal cases.</CardDescription>
          </CardHeader>
          <CardContent>
            <CasesTable cases={cases.filter(c => c.category === 'Contenciosa')} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="no-contenciosa">
        <Card>
          <CardHeader>
            <CardTitle>No Contenciosa Cases</CardTitle>
            <CardDescription>Manage no contenciosa legal cases.</CardDescription>
          </CardHeader>
          <CardContent>
            <CasesTable cases={cases.filter(c => c.category === 'No Contenciosa')} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function CasesTable({ cases }: { cases: typeof import('@/lib/data').cases }) {
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case Title</TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Lifecycle</TableHead>
              <TableHead className="hidden md:table-cell">Last Update</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell>
                  <div className="font-medium">{caseItem.title}</div>
                  <div className="text-sm text-muted-foreground">{caseItem.id}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{caseItem.clientName}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(caseItem.status)}>{caseItem.status}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                        <Progress value={caseItem.opportunityLifecycle} aria-label={`${caseItem.opportunityLifecycle}% complete`} className="h-2"/>
                        <span className="text-xs text-muted-foreground">{caseItem.opportunityLifecycle}%</span>
                    </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{caseItem.lastUpdate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Manage Documents</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    );
}
