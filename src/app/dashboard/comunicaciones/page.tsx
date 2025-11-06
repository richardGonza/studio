// Importamos los componentes e íconos necesarios para la página de comunicaciones.
"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Send,
  Search,
  PlusCircle,
  MessageSquare,
  Users,
  Inbox,
  Star,
  Archive,
  FileText,
  Clock,
  Paperclip,
  Smile,
  MessageCircle,
  MessagesSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  conversations,
  chatMessages,
  internalNotes,
  ChatMessage,
  InternalNote,
} from "@/lib/data";
import { cn } from "@/lib/utils";

// Esta es la función principal que define la página de Comunicaciones.
export default function CommunicationsPage() {
  const [selectedConversation, setSelectedConversation] = React.useState(
    conversations[0]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_340px_1fr] h-[calc(100vh-8rem)] gap-2">
      {/* Barra lateral de Inboxes */}
      <Card className="hidden md:flex flex-col">
        <CardContent className="p-4 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <Inbox className="h-4 w-4" /> Cajas de Entrada
            </h3>
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Todas las conversaciones
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Asignadas a mí
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Star className="mr-2 h-4 w-4" />
              Importantes
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <Archive className="h-4 w-4" /> Archivo
            </h3>
            <Button variant="ghost" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Pendientes
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Cerradas
            </Button>
          </div>
          <Button variant="outline" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Conversación
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Conversaciones */}
      <Card className="flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar conversación..." className="pl-8" />
          </div>
        </div>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "w-full text-left p-3 hover:bg-muted/50 transition-colors flex items-start gap-3",
                  selectedConversation.id === conv.id && "bg-muted"
                )}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={conv.avatarUrl} />
                  <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">{conv.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Panel de Chat Activo */}
      <Card className="flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={selectedConversation.avatarUrl} />
              <AvatarFallback>
                {selectedConversation.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{selectedConversation.name}</h3>
              <p className="text-xs text-muted-foreground">
                ID del Caso: {selectedConversation.caseId}
              </p>
            </div>
          </div>
          <Badge
            variant={
              selectedConversation.status === "Abierto"
                ? "default"
                : "secondary"
            }
          >
            {selectedConversation.status}
          </Badge>
        </div>
        <Tabs defaultValue="messages" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4">
                <TabsTrigger value="messages" className="gap-1">
                    <MessagesSquare className="h-4 w-4"/>
                    Mensajes
                </TabsTrigger>
                <TabsTrigger value="comments" className="gap-1">
                    <MessageCircle className="h-4 w-4"/>
                    Comentarios
                </TabsTrigger>
            </TabsList>
            <TabsContent value="messages" className="flex-1 p-4 space-y-4 overflow-y-auto">
                 <ChatMessagesList messages={chatMessages.filter(msg => msg.conversationId === selectedConversation.id)} />
            </TabsContent>
            <TabsContent value="comments" className="flex-1 p-4 space-y-4 overflow-y-auto">
                 <InternalNotesList notes={internalNotes.filter(note => note.conversationId === selectedConversation.id)} />
            </TabsContent>
        
            <div className="p-4 border-t bg-background">
              <div className="relative">
                <Textarea
                  placeholder="Escribe tu mensaje..."
                  className="pr-20"
                  rows={2}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Adjuntar</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                    <span className="sr-only">Emoji</span>
                  </Button>
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Enviar</span>
                  </Button>
                </div>
              </div>
            </div>
        </Tabs>
      </Card>
    </div>
  );
}


function ChatMessagesList({ messages }: { messages: ChatMessage[] }) {
    return (
        <div className="space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.senderType === 'agent' ? 'justify-end' : ''}`}>
                    {msg.senderType === 'client' && (
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src={msg.avatarUrl} />
                        <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    )}
                    <div className={`flex flex-col ${msg.senderType === 'agent' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-md rounded-lg px-3 py-2 ${msg.senderType === 'agent' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{msg.time}</span>
                    </div>
                    {msg.senderType === 'agent' && (
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src={msg.avatarUrl} />
                        <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    )}
                </div>
            ))}
        </div>
    );
}

function InternalNotesList({ notes }: { notes: InternalNote[] }) {
    return (
        <div className="space-y-4">
            {notes.map((note, index) => (
                <div key={index} className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src={note.avatarUrl} />
                        <AvatarFallback>{note.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm font-semibold">{note.senderName}</p>
                        <p className="text-sm text-gray-700 mt-1">{note.text}</p>
                        <p className="text-xs text-muted-foreground mt-2">{note.time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
