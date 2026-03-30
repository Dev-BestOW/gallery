export interface Artwork {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  link?: string;
  period?: string;
}

export interface Wing {
  id: string;
  name: string;
  theme: 'grand' | 'warm' | 'cool' | 'dark' | 'cozy';
  artworks: Artwork[];
}

const portfolio: Wing[] = [
  {
    id: 'entrance',
    name: 'Welcome',
    theme: 'grand',
    artworks: [
      {
        id: 'intro',
        title: 'Portfolio Gallery',
        image: '',
        description: '미술관을 둘러보듯 나의 이력을 감상해보세요.',
        tags: [],
      },
    ],
  },
  {
    id: 'about',
    name: 'About Me',
    theme: 'warm',
    artworks: [
      {
        id: 'profile',
        title: 'Profile',
        image: '',
        description: '안녕하세요. 개발자 OOO입니다.',
        tags: ['React', 'TypeScript', 'Three.js'],
      },
      {
        id: 'skills',
        title: 'Skills',
        image: '',
        description: 'Frontend 개발을 중심으로 다양한 기술을 다룹니다.',
        tags: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Three.js'],
      },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    theme: 'cool',
    artworks: [
      {
        id: 'project-1',
        title: 'Project Alpha',
        image: '',
        description: '첫 번째 프로젝트 설명입니다.',
        tags: ['React', 'TypeScript'],
        link: 'https://example.com',
        period: '2024.01 - 2024.06',
      },
      {
        id: 'project-2',
        title: 'Project Beta',
        image: '',
        description: '두 번째 프로젝트 설명입니다.',
        tags: ['Next.js', 'Prisma'],
        link: 'https://example.com',
        period: '2024.07 - 2024.12',
      },
      {
        id: 'project-3',
        title: 'Project Gamma',
        image: '',
        description: '세 번째 프로젝트 설명입니다.',
        tags: ['Three.js', 'R3F'],
        period: '2025.01 - Present',
      },
    ],
  },
  {
    id: 'career',
    name: 'Career',
    theme: 'dark',
    artworks: [
      {
        id: 'career-1',
        title: 'Company A',
        image: '',
        description: 'Frontend Developer로 근무했습니다.',
        tags: ['React', 'TypeScript'],
        period: '2022.03 - 2023.12',
      },
      {
        id: 'career-2',
        title: 'Company B',
        image: '',
        description: 'Senior Developer로 근무 중입니다.',
        tags: ['Next.js', 'Three.js'],
        period: '2024.01 - Present',
      },
    ],
  },
  {
    id: 'contact',
    name: 'Contact',
    theme: 'cozy',
    artworks: [
      {
        id: 'contact-info',
        title: 'Get in Touch',
        image: '',
        description: '함께 일하고 싶으시다면 연락주세요.',
        tags: ['GitHub', 'LinkedIn', 'Email'],
        link: 'mailto:example@email.com',
      },
    ],
  },
];

export default portfolio;
