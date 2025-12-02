import { Project } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Scrabble',
    description: 'Web scrabble originally developed in java.',
    technologies: ['Java', 'React', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
    demoUrl: 'https://scrabble.korymsmith.dev/',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '2',
    title: 'AutoComplete Trie',
    description: 'Predictive modeling & autocomplete system using Trie data structure.',
    technologies: ['Next.js', 'TypeScript', 'Data Structures', 'Machine Learning'],
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c',
    demoUrl: 'https://autotrie.korymsmith.dev/'
  },
  {
    id: '3',
    title: 'Smitty Poker Club',
    description: 'Full-Stack custom private poker club with real time multiplayer functionality.',
    technologies: ['TypeScript', 'React', 'AWS', 'WebSockets'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    demoUrl: 'https://poker.korymsmith.dev/'
  }
  // {
  //   id: '4',
  //   title: 'Coming Soon',
  //   description: 'Under Maintenance',
  //   technologies: ['Flutter', 'Dart', 'Firebase'],
  //   image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
  //   demoUrl: 'https://poker.korymsmith.dev/login'
  // }
];