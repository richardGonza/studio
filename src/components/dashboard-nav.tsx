// La directiva "use client" indica que este componente se ejecutará en el navegador del usuario.
// Esto es necesario para usar el hook `usePathname` que necesita saber la URL actual.
"use client";

// Importamos 'Link' para la navegación y 'usePathname' para saber en qué página estamos.
import Link from "next/link";
import { usePathname } from "next/navigation";
// Importamos los componentes del menú de la barra lateral.
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
// Importamos los íconos que usaremos en el menú.
import {
  LayoutDashboard,
  Users,
  Handshake,
  Building,
  Gavel,
  Route,
  School,
  PlayCircle,
  MessageSquare,
  HeartHandshake,
  UserCheck,
  Briefcase,
  CircleDollarSign,
  Bell,
  ClipboardCheck,
  FolderKanban,
} from "lucide-react";

// Definimos los elementos de nuestro menú de navegación en un array.
// Cada objeto tiene la ruta (href), el ícono y la etiqueta de texto.
const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Reportes" },
  { href: "/dashboard/leads", icon: HeartHandshake, label: "Leads" },
  { href: "/dashboard/deals", icon: Users, label: "Oportunidades" },
  { href: "/dashboard/clientes", icon: UserCheck, label: "Clientes" },
  { href: "/dashboard/volunteers", icon: Handshake, label: "Voluntarios" },
  { href: "/dashboard/branches", icon: Building, label: "Puntos Autorizados" },
  { href: "/dashboard/rutas", icon: Route, label: "Rutas" },
  { href: "/dashboard/cases", icon: FolderKanban, label: "Casos" },
  { href: "/dashboard/amparos", icon: Gavel, label: "Amparos" },
  { href: "/dashboard/amparos-mep", icon: School, label: "Amparos MEP" },
  { href: "/dashboard/ejecuciones", icon: PlayCircle, label: "Ejecuciones" },
  { href: "/dashboard/cobros", icon: CircleDollarSign, label: "Cobros" },
  { href: "/dashboard/notificaciones", icon: Bell, label: "Notificaciones" },
  { href: "/dashboard/tareas", icon: ClipboardCheck, label: "Tareas" },
  { href: "/dashboard/comunicaciones", icon: MessageSquare, label: "Comunicaciones" },
  { href: "/dashboard/staff", icon: Briefcase, label: "Colaboradores" },
];

// Esta es la función que crea el componente de navegación del dashboard.
export function DashboardNav() {
  // `usePathname` nos da la ruta actual de la URL, por ejemplo, "/dashboard/users".
  const pathname = usePathname();

  // Devolvemos una lista (`SidebarMenu`) que contiene los elementos del menú.
  return (
    <SidebarMenu>
      {/* Usamos `map` para recorrer nuestro array `navItems` y crear un botón por cada elemento. */}
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild // `asChild` permite que el botón se comporte como el `Link` que contiene.
            // `isActive` resalta el botón si la ruta actual coincide con la del elemento del menú.
            isActive={
              item.href === '/dashboard'
                ? pathname === item.href
                : pathname.startsWith(item.href)
            }
          >
            <Link href={item.href}>
              <item.icon /> {/* Muestra el ícono del elemento. */}
              {item.label} {/* Muestra el texto del elemento. */}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
