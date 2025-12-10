"use client";

import { useState } from "react";
import { useChallenges, useChallengeDetail } from "@/hooks/use-rewards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Clock,
  Users,
  Star,
  Sparkles,
  Medal,
  CheckCircle2,
  Trophy,
  Flame,
  Calendar,
  Play,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Challenge, ChallengeProgress } from "@/types/rewards";

const typeConfig = {
  daily: { label: "Diario", color: "bg-blue-500", icon: Calendar },
  weekly: { label: "Semanal", color: "bg-purple-500", icon: Calendar },
  monthly: { label: "Mensual", color: "bg-pink-500", icon: Calendar },
  special: { label: "Especial", color: "bg-amber-500", icon: Star },
  individual: { label: "Individual", color: "bg-green-500", icon: Target },
  team: { label: "Equipo", color: "bg-cyan-500", icon: Users },
};

const difficultyConfig = {
  easy: { label: "Fácil", color: "text-green-500", bgColor: "bg-green-500/10" },
  medium: { label: "Medio", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  hard: { label: "Difícil", color: "text-orange-500", bgColor: "bg-orange-500/10" },
  expert: { label: "Experto", color: "text-red-500", bgColor: "bg-red-500/10" },
};

function formatTimeRemaining(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "Finalizado";
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function ChallengeCard({ 
  challenge, 
  progress,
  onJoin,
  onViewDetails,
}: { 
  challenge: Challenge;
  progress?: ChallengeProgress;
  onJoin: () => void;
  onViewDetails: () => void;
}) {
  const type = typeConfig[challenge.type as keyof typeof typeConfig] || typeConfig.individual;
  const difficulty = difficultyConfig[challenge.difficulty as keyof typeof difficultyConfig] || difficultyConfig.medium;
  const TypeIcon = type.icon;
  
  const isJoined = !!progress;
  const isCompleted = progress?.status === "completed";
  const progressPercent = progress?.progressPercentage || 0;

  return (
    <Card className={cn(
      "transition-all hover:shadow-lg",
      isCompleted && "ring-2 ring-green-500/50 bg-green-50/50 dark:bg-green-950/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", type.color, "text-white")}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base line-clamp-1">{challenge.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", difficulty.color, difficulty.bgColor)}>
                  {difficulty.label}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {type.label}
                </Badge>
              </div>
            </div>
          </div>
          {isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {challenge.description}
        </p>

        {/* Progress */}
        {isJoined && !isCompleted && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Time Remaining */}
        {challenge.endsAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTimeRemaining(challenge.remainingTime)}</span>
          </div>
        )}

        {/* Rewards */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t">
          {challenge.pointsReward && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{challenge.pointsReward}</span>
            </div>
          )}
          {challenge.xpReward && (
            <div className="flex items-center gap-1 text-sm">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{challenge.xpReward} XP</span>
            </div>
          )}
          {challenge.badgeReward && (
            <div className="flex items-center gap-1 text-sm">
              <Medal className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Badge</span>
            </div>
          )}
        </div>

        {/* Participants */}
        {challenge.maxParticipants && (
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>
              {challenge.participantCount || 0} / {challenge.maxParticipants} participantes
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {isCompleted ? (
          <Button variant="outline" className="w-full" onClick={onViewDetails}>
            <Trophy className="h-4 w-4 mr-2" />
            Ver detalles
          </Button>
        ) : isJoined ? (
          <Button variant="outline" className="w-full" onClick={onViewDetails}>
            Ver progreso
          </Button>
        ) : (
          <Button className="w-full" onClick={onJoin}>
            <Play className="h-4 w-4 mr-2" />
            Participar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function ChallengeDetailDialog({ 
  challengeId,
  open, 
  onClose,
  onJoin,
}: { 
  challengeId: number | null;
  open: boolean;
  onClose: () => void;
  onJoin: () => void;
}) {
  const { data, isLoading } = useChallengeDetail(challengeId || 0);
  
  if (!challengeId) return null;

  const challenge = data?.challenge;
  const progress = data?.progress;
  const type = challenge ? typeConfig[challenge.type as keyof typeof typeConfig] : typeConfig.individual;
  const difficulty = challenge ? difficultyConfig[challenge.difficulty as keyof typeof difficultyConfig] : difficultyConfig.medium;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : challenge ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className={cn("p-3 rounded-lg", type.color, "text-white")}>
                  {challenge.icon ? (
                    <span className="text-xl">{challenge.icon}</span>
                  ) : (
                    <Target className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <DialogTitle>{challenge.name}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={cn(difficulty.color, difficulty.bgColor)}>
                      {difficulty.label}
                    </Badge>
                    <Badge variant="secondary">{type.label}</Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <DialogDescription className="text-base">
                {challenge.description}
              </DialogDescription>

              {/* Objectives */}
              {challenge.objectives && challenge.objectives.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Objetivos</h4>
                  <div className="space-y-3">
                    {challenge.objectives.map((objective, index) => {
                      const current = progress?.progress?.[index]?.current || 0;
                      const target = objective.target;
                      const percent = Math.min(100, (current / target) * 100);
                      const isComplete = current >= target;

                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className={cn(isComplete && "text-green-500")}>
                              {isComplete && <CheckCircle2 className="h-4 w-4 inline mr-1" />}
                              {objective.description}
                            </span>
                            <span className="font-medium">
                              {current} / {target}
                            </span>
                          </div>
                          <Progress value={percent} className="h-1.5" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rewards */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Recompensas</h4>
                <div className="flex gap-6">
                  {challenge.pointsReward && (
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      <div>
                        <span className="text-lg font-bold">{challenge.pointsReward}</span>
                        <p className="text-xs text-muted-foreground">puntos</p>
                      </div>
                    </div>
                  )}
                  {challenge.xpReward && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <div>
                        <span className="text-lg font-bold">{challenge.xpReward}</span>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </div>
                  )}
                  {challenge.badgeReward && (
                    <div className="flex items-center gap-2">
                      <Medal className="h-5 w-5 text-blue-500" />
                      <div>
                        <span className="text-lg font-bold">Badge</span>
                        <p className="text-xs text-muted-foreground">{challenge.badgeReward.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Time */}
              {(challenge.startsAt || challenge.endsAt) && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <div>
                    {challenge.startsAt && (
                      <span>Inicio: {new Date(challenge.startsAt).toLocaleDateString()}</span>
                    )}
                    {challenge.startsAt && challenge.endsAt && <span className="mx-2">•</span>}
                    {challenge.endsAt && (
                      <span>Fin: {new Date(challenge.endsAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {progress?.status === "completed" ? (
                <Button variant="outline" disabled className="w-full">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Completado
                </Button>
              ) : progress ? (
                <Button variant="outline" onClick={onClose} className="w-full">
                  Cerrar
                </Button>
              ) : (
                <Button onClick={onJoin} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Participar en este challenge
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Challenge no encontrado
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ChallengesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-2 w-full mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function ChallengesPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [joiningId, setJoiningId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useChallenges();

  const challenges = data?.challenges || [];
  const myParticipations = data?.myParticipations || [];
  const progressMap = new Map(myParticipations.map(p => [p.challengeId, p]));

  // Filter challenges
  const filteredChallenges = challenges.filter(c => {
    if (typeFilter === "all") return true;
    return c.type === typeFilter;
  });

  // Separate by status
  const activeChallenges = filteredChallenges.filter(c => {
    const progress = progressMap.get(c.id);
    return progress?.status === "active";
  });

  const availableChallenges = filteredChallenges.filter(c => {
    return !progressMap.has(c.id) && c.isCurrent;
  });

  const completedChallenges = filteredChallenges.filter(c => {
    const progress = progressMap.get(c.id);
    return progress?.status === "completed";
  });

  const handleJoin = async (challengeId: number) => {
    setJoiningId(challengeId);
    try {
      // Aquí iría la llamada a la API para unirse al challenge
      // await joinChallenge(challengeId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular
      refetch();
    } catch (error) {
      console.error("Error joining challenge:", error);
    } finally {
      setJoiningId(null);
    }
  };

  const handleViewDetails = (challengeId: number) => {
    setSelectedChallengeId(challengeId);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold">{activeChallenges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold">{completedChallenges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold">{availableChallenges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Flame className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{challenges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de challenge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {Object.entries(typeConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Challenges */}
      {isLoading ? (
        <ChallengesGridSkeleton />
      ) : (
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              En progreso ({activeChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Disponibles ({availableChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completados ({completedChallenges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeChallenges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tienes challenges activos</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ¡Explora los challenges disponibles y únete a uno!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    progress={progressMap.get(challenge.id)}
                    onJoin={() => handleJoin(challenge.id)}
                    onViewDetails={() => handleViewDetails(challenge.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available">
            {availableChallenges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay challenges disponibles</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vuelve pronto para ver nuevos challenges
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={() => handleJoin(challenge.id)}
                    onViewDetails={() => handleViewDetails(challenge.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedChallenges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aún no has completado challenges</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ¡Completa tu primer challenge para aparecer aquí!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    progress={progressMap.get(challenge.id)}
                    onJoin={() => {}}
                    onViewDetails={() => handleViewDetails(challenge.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Challenge Detail Dialog */}
      <ChallengeDetailDialog
        challengeId={selectedChallengeId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onJoin={() => {
          if (selectedChallengeId) {
            handleJoin(selectedChallengeId);
            setDialogOpen(false);
          }
        }}
      />
    </div>
  );
}
