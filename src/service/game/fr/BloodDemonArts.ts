// noinspection JSUnusedGlobalSymbols

import BreathingStyles from './BreathingStyles';
import { Art } from '../Typings';

/**
 * The list of blood demon arts.
 */
const bloodDemonArts: Art[] = [
  {
    id: 'explodingBlood',
    name: 'Sang Enflammé Explosif',
    moves: [
      'Déchaînement du Talon',
      'Déchaînement du Talon, Version Explosive',
      'Le Grattage Fou',
      'Coup de Pied Volant',
      'Les Griffes de la Fureur',
      'Frappe de Sang Explosive',
      'Coups de Pied Frénétiques',
      'Coup de Poing Enflammé',
      'Coup de Pied Tombant',
      'Coup de Pied Rotatif',
      'Sang Explosif, Déchaînement',
    ],
    movesCategories: {
      basic: [0, 2, 8, 9],
      fineness: [3, 4],
      heavy: [1, 5, 6, 7],
      ultimate: [10],
    },
  },
  {
    id: 'hiasobiTemari',
    name: 'Balles Temari',
    moves: [
      'Jeu de Balle',
      'Lancer en Rotation',
      'Coup de Pied',
      'Coup de Pied Perçant',
      'Balles Sextuplées, Lancer de Masse',
      'Coup Cinétique en Spirale',
    ],
    movesCategories: {
      basic: [0, 2],
      fineness: [1, 3],
      heavy: [4],
      ultimate: [5],
    },
  },
  {
    id: 'koketsuArrow',
    name: 'Flèches de Kôketsu',
    moves: [
      'Flèches Chasseuses',
      'Écrasement',
      'Lancer de Blocs',
      'Torrent de Flèches',
      'Éruption',
      'Plongeon',
      'Explosion Multiple Finale',
    ],
    movesCategories: {
      basic: [1, 2],
      fineness: [4, 5],
      heavy: [0, 3],
      ultimate: [6],
    },
  },
  {
    id: 'threadManipulation',
    name: 'Manipulation de Fils',
    moves: [
      'Cage de Fils Coupants',
      "Panier de l'Œil Meurtrier",
      'Rotation de Fils Coupants',
      'Attaque de Front à Trois Fils',
      'Lancer de Toile',
      'Barrière de Fils',
      'Prison de Fils Coupants',
    ],
    movesCategories: {
      basic: [3, 4],
      fineness: [0, 5],
      heavy: [1, 2],
      ultimate: [6],
    },
  },
  {
    id: 'sleepInducement',
    name: 'Stimulation du Sommeil',
    moves: [
      "Murmures de l'Hypnose Forcée et Inconsciente",
      'Yeux du Sommeil Inconscient Forcé',
      'Murmures Mélodiques',
      'Mains de Chair',
      'Chuchotements en Écho',
      'Chuchotements',
      "Murmures de l'Hypnose Forcée et Inconsciente, Cauchemar",
    ],
    movesCategories: {
      basic: [2, 5],
      fineness: [3, 4],
      heavy: [0, 1],
      ultimate: [6],
    },
  },
  {
    id: 'obiSashManipulation',
    name: "Manipulation d'Obi Sash",
    moves: [
      'Obi à Huit Couches',
      'Assaut d’Obi',
      'Poursuite d’Obi',
      'Obi Perçants',
      'Lacération d’Obi',
      'L’Enchevêtrement d’Obi',
      'Obi à Huit Couches, Pulvérisation',
    ],
    movesCategories: {
      basic: [0, 1],
      fineness: [2, 5],
      heavy: [3, 4],
      ultimate: [6],
    },
  },
  {
    id: 'bloodManipulation',
    name: 'Manipulation de Sang',
    moves: [
      'Faucilles de Sang',
      'Déchaînement de Sang Circulaire',
      'Taillades Circulaires Rotatives : Lames de Sang',
      'Assaut de Faucilles de Sang',
      'Lame Tranchante de Sang',
      'Faucilles de Sang Courbée',
      'Taillades Circulaires Rotatives : Lames de Sang, Fauchage',
    ],
    movesCategories: {
      basic: [0, 4],
      fineness: [1, 3],
      heavy: [5],
      ultimate: [6],
    },
  },
  {
    id: 'destructiveDeath',
    name: 'Mise à Mort Destructrice',
    moves: [
      'Boussole',
      'Attaque Aérienne',
      'Maelström',
      'Attaque Annihilatrice',
      'Attaque de Jambe : Destructeur de Couronne',
      'Attaque de Jambe : Rafale Explosive',
      'Attaque de Jambe : Planète Volante aux Milles Roues',
      'Noyau Démoniaque Octuplé',
      'Attaque par Broyage : Dix Milles Feuilles de Saule Éclatantes',
      'Forme Finale : Forme Bleue Argentée et Chaotique Rémanent',
      'Effondrement',
      'Maelström et Éclatement',
      'Attaque Annihilatrice, Punition',
    ],
    movesCategories: {
      basic: [0, 1, 4],
      fineness: [2, 3, 5, 10],
      heavy: [6, 7, 8, 11, 12],
      ultimate: [9],
    },
  },
  {
    id: 'cryokinesis',
    name: 'Cryokinésie',
    moves: [
      'Lotus Gelé',
      'Jardin Suspendu Stérile',
      'Nuages Gelés',
      'Vignes de Lotus',
      'Princesses du Blizzard',
      'Givres Hivernaux',
      'Diffusion de Lotus de Glace',
      'Enfant Divin Cristallin',
      'Bodhisattva de Givre',
    ],
    movesCategories: {
      basic: [0, 2, 6],
      fineness: [1, 3, 5],
      heavy: [4, 7],
      ultimate: [8],
    },
  },
  {
    id: 'crescentMoonBlades',
    name: 'Lames de Croissant de Lune',
    moves: BreathingStyles.find((style: (typeof BreathingStyles)[0]) => style.id === 'moon').moves,
    movesCategories: BreathingStyles.find((style: (typeof BreathingStyles)[0]) => style.id === 'moon').movesCategories,
  },
];

export default bloodDemonArts;
