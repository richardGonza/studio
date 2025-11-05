// Importamos el componente 'Image' de Next.js para optimizar la carga de imágenes.
import Image from "next/image";

// Este componente representa el logo de la aplicación.
export function Logo() {
  // La función devuelve el JSX (la estructura HTML) del logo.
  return (
    // 'div' es el contenedor principal del logo.
    // 'flex items-center gap-2' son clases de Tailwind CSS para alinear la imagen y el texto.
    <div className="flex items-center gap-3">
      {/* 
        Usamos el componente Image para mostrar el logo.
        - src: La ruta a la imagen del logo.
        - width y height: Las dimensiones de la imagen.
        - alt: Texto alternativo que describe la imagen para accesibilidad.
      */}
      <Image 
        src="/logo.png" 
        width={32} 
        height={32} 
        alt="Logo de Fundación Derecho Sin Fronteras" 
      />
      {/* 'span' contiene el nombre de la aplicación, con un estilo específico. */}
      <span className="font-headline text-lg font-semibold">
        DSF Admin
      </span>
    </div>
  );
}
