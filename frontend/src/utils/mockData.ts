import { Article } from '../types';

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Healthcare',
    content: 'AI is revolutionizing healthcare with breakthrough applications in diagnosis, treatment planning, and drug discovery...',
    summary: 'AI technologies are transforming healthcare through improved diagnostics and treatment planning.',
    source: 'Tech Health Journal',
    publishedAt: '2024-03-15T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200',
    sentiment: 'positive'
  },
  {
    id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement',
    content: 'World leaders have reached a landmark agreement on reducing carbon emissions...',
    summary: 'Nations agree to ambitious carbon reduction targets in historic climate summit.',
    source: 'Global News Network',
    publishedAt: '2024-03-14T15:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f68?auto=format&fit=crop&w=1200',
    sentiment: 'positive'
  },
  {
    id: '3',
    title: 'Market Volatility Continues Amid Economic Uncertainty',
    content: 'Global markets experienced significant fluctuations as investors respond to economic indicators...',
    summary: 'Markets remain volatile as economic uncertainties persist globally.',
    source: 'Financial Times',
    publishedAt: '2024-03-14T08:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200',
    sentiment: 'negative'
  }
];