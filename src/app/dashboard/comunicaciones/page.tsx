// Importamos los componentes e íconos necesarios para la página de comunicaciones.
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
  } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Send, Search, PlusCircle, MessageSquare, Users, Hash } from "lucide-react";
  
  // Datos de ejemplo para los canales y mensajes directos.
  const channels = [
    { id: "C01", name: "General" },
    { id: "C02", name: "Casos Urgentes" },
    { id: "C03", name: "Anuncios" },
  ];
  
  const directMessages = [
    { id: "U01", name: "Eduardo Martins", avatar: "https://picsum.photos/seed/avatar6/40/40", online: true },
    { id: "U02", name: "Fernanda Lima", avatar: "https://picsum.photos/seed/avatar7/40/40", online: false },
    { id: "U03", name: "Gabriel Rocha", avatar: "https://picsum.photos/seed/avatar8/40/40", online: true },
  ];
  
  // Datos de ejemplo para los mensajes en el chat activo.
  const activeChatMessages = [
    {
      sender: "Eduardo Martins",
      avatar: "https://picsum.photos/seed/avatar6/40/40",
      text: "Hola a todos, recuerden la reunión de equipo mañana a las 10 AM.",
      time: "10:30 AM",
    },
    {
      sender: "Admin",
      avatar: "https://picsum.photos/seed/admin-avatar/40/40",
      text: "¡Entendido! Prepararé el resumen de casos para la reunión.",
      time: "10:32 AM",
    },
    {
      sender: "Fernanda Lima",
      avatar: "https://picsum.photos/seed/avatar7/40/40",
      text: "Perfecto, ¿necesitan que lleve algo específico sobre el caso CAS002?",
      time: "10:35 AM",
    },
  ];
  
  // Esta es la función principal que define la página de Comunicaciones.
  export default function CommunicationsPage() {
    return (
      <Card className="h-[calc(100vh-8rem)] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare />
            Comunicaciones Internas
          </CardTitle>
          <CardDescription>
            Colabora con tu equipo a través de canales y mensajes directos.
          </CardDescription>
        </CardHeader>
        {/* El contenido se divide en una barra lateral y el panel de chat principal. */}
        <CardContent className="flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 overflow-hidden p-0">
          
          {/* Barra lateral con canales y mensajes directos */}
          <div className="flex flex-col gap-4 border-r bg-muted/20 p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="pl-8" />
            </div>
            {/* Sección de Canales */}
            <nav className="flex-1 space-y-2">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                    <Hash className="h-4 w-4"/>
                    Canales
                </h3>
                <div className="space-y-1">
                {channels.map((channel) => (
                    <Button key={channel.id} variant="ghost" className="w-full justify-start">
                    # {channel.name}
                    </Button>
                ))}
                </div>
            </nav>
            {/* Sección de Mensajes Directos */}
            <nav className="flex-1 space-y-2">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                    <Users className="h-4 w-4"/>
                    Mensajes Directos
                </h3>
                <div className="space-y-1">
                {directMessages.map((dm) => (
                    <Button key={dm.id} variant="ghost" className="w-full justify-start h-auto py-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 relative">
                            <AvatarImage src={dm.avatar} />
                            <AvatarFallback>{dm.name.charAt(0)}</AvatarFallback>
                            {dm.online && (
                                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
                            )}
                        </Avatar>
                        <span>{dm.name}</span>
                    </div>
                    </Button>
                ))}
                </div>
            </nav>
            <Button variant="outline" className="mt-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Mensaje
            </Button>
          </div>
  
          {/* Panel principal del chat */}
          <div className="flex flex-col h-full p-4">
            {/* Encabezado del chat activo */}
            <div className="flex items-center gap-3 border-b pb-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="https://picsum.photos/seed/avatar6/40/40" />
                    <AvatarFallback>EM</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-lg font-semibold">Eduardo Martins</h2>
                    <p className="text-sm text-muted-foreground">En línea</p>
                </div>
            </div>
            
            {/* Contenedor de mensajes */}
            <div className="flex-1 space-y-6 overflow-y-auto py-4 pr-4">
              {activeChatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.sender === "Admin" ? "justify-end" : ""
                  }`}
                >
                  {msg.sender !== "Admin" && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${msg.sender === "Admin" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-md rounded-lg px-4 py-2 ${msg.sender === "Admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <p className="font-semibold text-sm">{msg.sender}</p>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{msg.time}</span>
                  </div>
                  {msg.sender === "Admin" && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
  
            {/* Área para escribir un nuevo mensaje */}
            <div className="mt-auto border-t pt-4">
              <div className="relative">
                <Input
                  placeholder="Escribe un mensaje en #General..."
                  className="pr-12"
                />
                <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }