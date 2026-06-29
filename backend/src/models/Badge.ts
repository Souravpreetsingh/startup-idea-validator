export const BADGE_DEFINITIONS = [
  { key: 'first_idea', name: 'First Startup Created', icon: 'rocket_launch', description: 'Created your first startup idea' },
  { key: 'ten_analyses', name: '10 Analyses Completed', icon: 'analytics', description: 'Ran 10 AI analyses' },
  { key: 'ai_expert', name: 'AI Expert', icon: 'smart_toy', description: 'Generated 25+ analyses' },
  { key: 'market_pro', name: 'Market Research Pro', icon: 'monitoring', description: 'Analyzed 5+ different industries' },
  { key: 'chat_master', name: 'Chat Master', icon: 'chat', description: 'Sent 50+ chat messages' },
  { key: 'team_player', name: 'Team Player', icon: 'groups', description: 'Joined a team' },
  { key: 'serial_founder', name: 'Serial Founder', icon: 'flag', description: 'Created 5+ startup ideas' },
  { key: 'early_adopter', name: 'Early Adopter', icon: 'star', description: 'Completed first analysis' },
]

export interface IBadge {
  key: string
  name: string
  icon: string
  description: string
}
