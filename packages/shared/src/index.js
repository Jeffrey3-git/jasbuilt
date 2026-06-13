export const GH_SCHOOLS = [
  { id: 'UG', name: 'University of Ghana' },
  { id: 'KNUST', name: 'Kwame Nkrumah University of Science and Technology' },
  { id: 'ASHESI', name: 'Ashesi University' },
  { id: 'RMU', name: 'Regional Maritime University' },
  { id: 'GCTU', name: 'Ghana Communication Technology University' },
  { id: 'AIT', name: 'Accra Institute of Technology' }
];

export const TECH_TAGS = [
  'React', 'Vue', 'Next.js', 'Vite', 'Node.js', 'Express', 
  'Python', 'Django', 'Flask', 'PostgreSQL', 'MongoDB', 
  'Prisma', 'TailwindCSS', 'SCSS', 'TypeScript', 'AI/ML'
];

export const formatUpvoteCount = (count) => {
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
  return count.toString();
};