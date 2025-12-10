export interface Location {
  id: string;
  name: string;
}

export interface Province extends Location {
  cantons: Canton[];
}

export interface Canton extends Location {
  districts: Location[];
}

export const PROVINCES: Province[] = [
  {
    id: "1",
    name: "San José",
    cantons: [
      {
        id: "101",
        name: "San José",
        districts: [
          { id: "10101", name: "Carmen" },
          { id: "10102", name: "Merced" },
          { id: "10103", name: "Hospital" },
          { id: "10104", name: "Catedral" },
          { id: "10105", name: "Zapote" },
          { id: "10106", name: "San Francisco de Dos Ríos" },
          { id: "10107", name: "Uruca" },
          { id: "10108", name: "Mata Redonda" },
          { id: "10109", name: "Pavas" },
          { id: "10110", name: "Hatillo" },
          { id: "10111", name: "San Sebastián" },
        ],
      },
      {
        id: "102",
        name: "Escazú",
        districts: [
          { id: "10201", name: "Escazú" },
          { id: "10202", name: "San Antonio" },
          { id: "10203", name: "San Rafael" },
        ],
      },
      {
        id: "103",
        name: "Desamparados",
        districts: [
          { id: "10301", name: "Desamparados" },
          { id: "10302", name: "San Miguel" },
          { id: "10303", name: "San Juan de Dios" },
          { id: "10304", name: "San Rafael Arriba" },
          { id: "10305", name: "San Antonio" },
          { id: "10306", name: "Frailes" },
          { id: "10307", name: "Patarrá" },
          { id: "10308", name: "San Cristóbal" },
          { id: "10309", name: "Rosario" },
          { id: "10310", name: "Damas" },
          { id: "10311", name: "San Rafael Abajo" },
          { id: "10312", name: "Gravilias" },
          { id: "10313", name: "Los Guido" },
        ],
      },
      // Add more cantons as needed...
    ],
  },
  {
    id: "2",
    name: "Alajuela",
    cantons: [
      {
        id: "201",
        name: "Alajuela",
        districts: [
          { id: "20101", name: "Alajuela" },
          { id: "20102", name: "San José" },
          { id: "20103", name: "Carrizal" },
          { id: "20104", name: "San Antonio" },
          { id: "20105", name: "Guácima" },
          { id: "20106", name: "San Isidro" },
          { id: "20107", name: "Sabanilla" },
          { id: "20108", name: "San Rafael" },
          { id: "20109", name: "Río Segundo" },
          { id: "20110", name: "Desamparados" },
          { id: "20111", name: "Turrúcares" },
          { id: "20112", name: "Tambor" },
          { id: "20113", name: "Garita" },
          { id: "20114", name: "Sarapiquí" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Cartago",
    cantons: [
      {
        id: "301",
        name: "Cartago",
        districts: [
          { id: "30101", name: "Oriental" },
          { id: "30102", name: "Occidental" },
          { id: "30103", name: "Carmen" },
          { id: "30104", name: "San Nicolás" },
          { id: "30105", name: "Aguacaliente" },
          { id: "30106", name: "Guadalupe" },
          { id: "30107", name: "Corralillo" },
          { id: "30108", name: "Tierra Blanca" },
          { id: "30109", name: "Dulce Nombre" },
          { id: "30110", name: "Llano Grande" },
          { id: "30111", name: "Quebradilla" },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Heredia",
    cantons: [
      {
        id: "401",
        name: "Heredia",
        districts: [
          { id: "40101", name: "Heredia" },
          { id: "40102", name: "Mercedes" },
          { id: "40103", name: "San Francisco" },
          { id: "40104", name: "Ulloa" },
          { id: "40105", name: "Varablanca" },
        ],
      },
    ],
  },
  {
    id: "5",
    name: "Guanacaste",
    cantons: [
      {
        id: "501",
        name: "Liberia",
        districts: [
          { id: "50101", name: "Liberia" },
          { id: "50102", name: "Cañas Dulces" },
          { id: "50103", name: "Mayorga" },
          { id: "50104", name: "Nacascolo" },
          { id: "50105", name: "Curubandé" },
        ],
      },
    ],
  },
  {
    id: "6",
    name: "Puntarenas",
    cantons: [
      {
        id: "601",
        name: "Puntarenas",
        districts: [
          { id: "60101", name: "Puntarenas" },
          { id: "60102", name: "Pitahaya" },
          { id: "60103", name: "Chomes" },
          { id: "60104", name: "Lepanto" },
          { id: "60105", name: "Paquera" },
          { id: "60106", name: "Manzanillo" },
          { id: "60107", name: "Guacimal" },
          { id: "60108", name: "Barranca" },
          { id: "60109", name: "Monte Verde" },
          { id: "60110", name: "Isla del Coco" },
          { id: "60111", name: "Cóbano" },
          { id: "60112", name: "Chacarita" },
          { id: "60113", name: "Chira" },
          { id: "60114", name: "Acapulco" },
          { id: "60115", name: "El Roble" },
          { id: "60116", name: "Arancibia" },
        ],
      },
    ],
  },
  {
    id: "7",
    name: "Limón",
    cantons: [
      {
        id: "701",
        name: "Limón",
        districts: [
          { id: "70101", name: "Limón" },
          { id: "70102", name: "Valle La Estrella" },
          { id: "70103", name: "Río Blanco" },
          { id: "70104", name: "Matama" },
        ],
      },
    ],
  },
];
